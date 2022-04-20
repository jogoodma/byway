ruleset byway.request.manager {
  meta {
    name "RequestManager"
    description "Manages request picos."
    use module io.picolabs.wrangler alias wrangler
    use module byway.request.tags alias tags
    shares listRequests
  }
  global {

    // Request entity rulesets that are installed in the managed children.
    requestEntityRulesets = [
      "tags",
      "entity",
    ]

    listRequests = function() {
      ecis = ent:requestEntityFamilyChannels.values().defaultsTo([])
      requests = ecis.map(function(eci) {
        return wrangler:picoQuery(eci, "byway.request.entity", "getRequest", {})
      })
      return requests
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    fired {
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:requestChannelTags().get(["manager", "requestList"]),
        "eventPolicy":{"allow": [{"domain": "request", "name": "new"}, {"domain": "request", "name": "delete"}],
                       "deny": []},
        "queryPolicy":{"allow":[{"rid": meta:rid, "name": "listRequests"}], "deny": []},
      }
    }

  }

  /**
   * Starts the event flow to create a new Byway request entity.
   * When initiated, this rule creates a child pico and passes on the 
   * request meta data that will be used to populate the pico.
   * 
   * @param {string} name - Request name.
   * @param {string} description - Request description.
   */
  rule createNewRequest {
    // Fire on a new request event with the required attributes.
    select when request new
      name re#(.+)#
      message re#(.+)#
      type re#^(sell|buy)$#
      quantity re#^[0-9]+$#
      price re#^[0-9\.\,\_]+$#
      setting(name, message, type, quantity, price)
    pre {
      picoName = name
      item_eci = event:attrs{"item_eci"}
      requestEntityExists = ent:requestEntityFamilyChannels.klog("requestEntityFamilyChannels:") >< picoName.klog("picoName:") 
    }
    if not requestEntityExists.klog("requestEnityExists") then 
      send_directive("requesting_new_request", {"name": picoName})
    fired {
      raise wrangler event "new_child_request" attributes {
        "name": picoName,
        "message": message,
        "type": type,
        "quantity": quantity.as("Number"),
        "price": price.as("Number"),
        "item_eci": item_eci,
      }
    }
    else {
      // TODO - Handle this error so that the UI can access it.
      log error "Failed to create a new request, invalid input or the request already exists."
    }

  }

  /** 
   * Installs the Byway request entity rulesets in the request entity pico
   * after it has been created. 
   */
  rule installRequestRulesets {
    select when wrangler new_child_created
    // Loop over all rulesets and request that they be installed.
    foreach requestEntityRulesets setting(rid)
      pre {
        // Family channel of the request entity pico.
        requestEci = event:attrs{"eci"}
      }
      every {
        send_directive("Installing request entity rulesets", {"rid":rid})
        event:send({
          "eci": requestEci,
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
   * Adds pico entity names to the managed request entity list.
   * 
   * @param {string} name - The name of the request entity pico.
   */
  rule addEntityNames {
    select when wrangler new_child_created
    pre {
      name = event:attrs{"name"}
      eci = event:attrs{"eci"}
    }
    fired {
      ent:requestEntityFamilyChannels{name} := eci
    }
  }

  /**
   * Removes pico entity names from the managed user entity list.
   * 
   * @param {string} name - The name of the user entity pico.
   */
  rule deleteRequest {
    select when request delete
    pre {
      name = event:attrs{"name"}
      exists = ent:requestEntityFamilyChannels >< name
      eciToDelete = ent:requestEntityFamilyChannels{name} 
    }
    if exists && eciToDelete then
      send_directive("deleting_request", {"name": name})

    // Delete request
    fired {
      raise wrangler event "child_deletion_request" attributes {
        "eci": eciToDelete,
      }
      clear ent:requestEntityFamilyChannels{name}
    }
  }
}
