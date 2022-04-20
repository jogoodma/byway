ruleset byway.store.manager {
  meta {
    name "StoreManager"
    description "Manages store entity picos."
    use module io.picolabs.wrangler alias wrangler
    use module byway.store.tags alias tags
    shares listStores
  }
  global {

    // Store entity rulesets that are installed in the managed children.
    storeEntityRulesets = [
      "tags",
      "entity",
    ]

    listStores = function() {
      ecis = ent:storeEntityFamilyChannels.values().defaultsTo([])
      stores = ecis.map(function(eci) {
        return wrangler:picoQuery(eci, "byway.store.entity", "getStore", {})
      })
      return stores
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    fired {
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:storeChannelTags().get(["manager", "storeList"]),
        "eventPolicy":{"allow": [{"domain": "store", "name": "new"}, {"domain": "store", "name": "delete"}],
                       "deny": []},
        "queryPolicy":{"allow":[{"rid": meta:rid, "name": "listStores"}], "deny": []},
      }
    }

  }

  /**
   * Starts the event flow to create a new Byway store entity.
   * When initiated, this rule creates a child pico and passes on the 
   * store meta data that will be used to populate the pico.
   * 
   * @param {string} name - Store name.
   * @param {string} description - Store description.
   */
  rule createNewStore {
    // Fire on a new user event with the required attributes.
    select when store new
      name re#(.+)#
      description re#(.+)#
      setting(name, description)
    pre {
      picoName = name
      storeEntityExists = ent:storeEntityFamilyChannels.klog("storeEntityFamilyChannels:") >< picoName.klog("picoName:") 
    }
    if not storeEntityExists.klog("storeEnityExists") then 
      send_directive("requesting_new_store", {"name": picoName})
    fired {
      raise wrangler event "new_child_request" attributes {
        "name": picoName,
        "description": description
      }
    }
    else {
      // TODO - Handle this error so that the UI can access it.
      log error "Failed to create a new store, invalid input or the store already exists."
    }

  }


  /** 
   * Installs the Byway store entity rulesets in the store entity pico
   * after it has been created. 
   */
  rule installStoreRulesets {
    select when wrangler new_child_created
    // Loop over all rulesets and request that they be installed.
    foreach storeEntityRulesets setting(rid)
      pre {
        // Family channel of the store entity pico.
        storeEci = event:attrs{"eci"}
      }
      every {
        send_directive("Installing store entity rulesets", {"rid":rid})
        event:send({
          "eci": storeEci,
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
   * Adds pico entity names to the managed store entity list.
   * 
   * @param {string} name - The name of the store entity pico.
   */
  rule addEntityNames {
    select when wrangler new_child_created
    pre {
      name = event:attrs{"name"}
      eci = event:attrs{"eci"}
    }
    fired {
      ent:storeEntityFamilyChannels{name} := eci
    }
  }

  /**
   * Removes pico entity names from the managed user entity list.
   * 
   * @param {string} name - The name of the user entity pico.
   */
  rule deleteStore {
    select when store delete
    pre {
      name = event:attrs{"name"}
      exists = ent:storeEntityFamilyChannels >< name
      eciToDelete = ent:storeEntityFamilyChannels{name} 
    }
    if exists && eciToDelete then
      send_directive("deleting_store", {"name": name})

    // Delete store
    fired {
      raise wrangler event "child_deletion_request" attributes {
        "eci": eciToDelete,
      }
      clear ent:storeEntityFamilyChannels{name}
    }
  }
}
