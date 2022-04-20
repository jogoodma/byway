ruleset byway.user.manager {
  meta {
    name "UserManager"
    description "Manages user entity picos."
    use module io.picolabs.wrangler alias wrangler
    use module byway.user.tags alias tags
    shares listUsers
  }
  global {

    // User Entity rulesets that are installed in the managed children.
    userEntityRulesets = [
      "../validation/email",
      "tags",
      "entity",
    ]

    listUsers = function() {
      ecis = ent:userEntityFamilyChannels.values().defaultsTo([])
      users = ecis.map(function(eci) {
        return wrangler:picoQuery(eci, "byway.user.entity", "getUser", {})
      })
      return users
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    fired {
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:userChannelTags().get(["manager", "userList"]),
        "eventPolicy":{"allow": [{"domain": "user", "name": "new"}, {"domain": "user", "name": "delete"}],
                       "deny": []},
        "queryPolicy":{"allow":[{"rid": meta:rid, "name": "listUsers"}], "deny": []},
      }
    }

  }

  /**
   * Starts the event flow to create a new Byway user entity.
   * When initiated, this rule creates a child pico and passes on the 
   * user meta data that will be used to populate the pico.
   * 
   * @param {string} firstName - The user's first name.
   * @param {string} surname - The user's surname.
   * @param {string} username - The user's username.
   * @param {string} email - The user's email address.
   * @param {string} passwordHash - The user's password hash.
   */
  rule createNewUser {
    // Fire on a new user event with the required attributes.
    select when user new
      firstName re#(.+)#
      surname re#(.+)#
      username re#(\w+)#
      email re#(.+)#
      passwordHash re#(\S{6,})#
      setting(firstName, surname, username, email, passwordHash)
    pre {
      picoName = username
      userEntityExists = ent:userEntityFamilyChannels.klog("userEntityFamilyChannels:") >< picoName.klog("picoName:") 
    }
    if not userEntityExists.klog("userEnityExists") then 
      send_directive("requesting_new_user", {"name": picoName})
    fired {
      raise wrangler event "new_child_request" attributes {
        "name": picoName,
        "firstName": firstName,
        "surname": surname,
        "username": username,
        "email": email,
        "passwordHash": passwordHash,
      }
    }
    else {
      // TODO - Handle this error so that the UI can access it.
      log error "Failed to create a new user, invalid input or the user already exists."
    }

  }


  /** 
   * Installs the Byway user entity rulesets in the user entity pico
   * after it has been created. 
   */
  rule installUserRulesets {
    select when wrangler new_child_created
    // Loop over all rulesets and request that they be installed.
    foreach userEntityRulesets setting(rid)
      pre {
        // Family channel of the user entity pico.
        userEci = event:attrs{"eci"}
      }
      every {
        send_directive("Installing user entity rulesets", {"rid":rid})
        event:send({
          "eci": userEci,
          "eid": "install-ruleset",
          "domain": "wrangler",
          "type":"install_ruleset_request",
          "attrs": event:attrs.put({
            "absoluteURL": meta:rulesetURI,
            "rid": rid,
            "config": {}
          })
        })
      }
  }

  /**
   * Adds pico entity names to the managed user entity list.
   * 
   * @param {string} name - The name of the user entity pico.
   */
  rule addEntityNames {
    select when wrangler new_child_created
    pre {
      name = event:attrs{"name"}
      eci = event:attrs{"eci"}
    }
    fired {
      ent:userEntityFamilyChannels{name} := eci
    }
  }

  /**
   * Removes pico entity names from the managed user entity list.
   * 
   * @param {string} name - The name of the user entity pico.
   */
  rule deleteUser {
    select when user delete
    pre {
      name = event:attrs{"name"}
      exists = ent:userEntityFamilyChannels >< name
      eciToDelete = ent:userEntityFamilyChannels{name} 
    }
    if exists && eciToDelete then
      send_directive("deleting_user", {"username": name})

    // Delete user
    fired {
      raise wrangler event "child_deletion_request" attributes {
        "eci": eciToDelete,
      }
      clear ent:userEntityFamilyChannels{name}
    }
  }
}
