ruleset byway.user.manager {
  meta {
    name "UserManager"
    description "Create and delete users."
    use module io.picolabs.wrangler alias wrangler
    shares userChannels
  }
  global {
    /**
     * Return a map of user entities.
     *  key - pico name
     *  value - public ECI for validation.
     * @returns {map} - A user entity map.
    */
    userChannels = function() {
      ent:userChannels.defaultsTo([])
    }
    userEntityRulesets = [
      "../validation/email",
      "entity",
    ]
  }

  rule createNewUser {
    select when user new
      firstName re#(.+)#
      surname re#(.+)#
      username re#(.+)#
      email re#(.+)#
      passwordHash re#(.+)#
      setting(firstName, surname, username, email, passwordHash)
      // TODO - Block duplicate user creation.
    fired {
      raise wrangler event "new_child_request" attributes {
        "userid": random:uuid(),
        "name": email,
        "firstName": firstName,
        "surname": surname,
        "username": username,
        "email": email,
        "passwordHash": passwordHash,
      }
    }
  }

  rule installUserRulesets {
    select when wrangler new_child_created
    foreach userEntityRulesets setting(rid)
      pre {
        userEci = event:attrs{"eci"}
      }
      event:send({
        "eci": userEci,
        "eid": "install-ruleset",
        "domain": "wrangler",
        "type":"install_ruleset_request",
        "attrs": {
          "absoluteURL": meta:rulesetURI,
          "rid": rid,
          "config": {}
        },
      })
  }


  rule addUserEci {
    select when user add_eci
        name re#(.+)#
        eci re#(.+)#
        setting(name, eci)
    pre {
      existingChannels = userChannels()
    }
    fired {
      ent:userChannels := existingChannels.append({"name": name, "eci": eci})
    }
  }
  
  rule clearUserChannels {
    select when user_channels clear
    fired {
      ent:userChannels := []
    }
  }

  rule delete_user {
    select when user delete
      name re#(.+)#
      setting(name)
    // Delete user
    fired {
      ent:userChannels := userChannels().filter(function(user) { user{"name"} != name})
    }
  }
}
