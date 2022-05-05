ruleset byway.store.entity {
  meta {
    name "StoreEntity"
    description "Defines Byway store attributes."
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    use module byway.store.tags alias tags

    shares getStore, getItems, getPublicEci
  }
  global {

    // Item entity rulesets that are installed in the managed children.
    itemEntityRulesets = [
      "tags",
      "item",
    ]

    getPublicEci = function(type = "readOnly") {
      wrangler:channels(tags:storeChannelTags().get(["entity",type])).head().get("id")
    }

    getStore = function() {
      publicEci = getPublicEci("validated")
      store = ent:store
      store.put("publicEci", publicEci)
    }

    getItems = function() {
      ecis = ent:itemEntityFamilyChannels.values().defaultsTo([])
      items = ecis.map(function(eci) {
        return wrangler:picoQuery(eci, "byway.store.item", "getItem", {})
      })
      return items
    }
  }

  /**
   *  Initializes the store entity pico.
   *  
   * @param {string} name - The store name.
   * @param {string} description - The store description.
  */
  rule initialize {
    select when wrangler ruleset_installed
        name re#(.+)#
        description re#(.+)#
        setting(name, description)
        where event:attrs{"rids"} >< meta:rid

    fired {
      ent:store{"name"} := name
      ent:store{"description"} := description
    }
    else {
      log error "Store initialization failed." 
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    pre {
      allowQueryPolicy = [
        {"rid": meta:rid, "name":"getStore"},
        {"rid": meta:rid, "name":"getPublicEci"},
        {"rid": meta:rid, "name":"getItems"},
      ]
      allowEventPolicy = [
        {"domain": "store", "name":"update"},
        {"domain": "item", "name":"new"},
        {"domain": "item", "name":"delete"},
      ]

    }
    fired {
      log debug "Initializing read only channel in entity."
      log debug tags:storeChannelTags().get(["entity","readOnly"])
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:storeChannelTags().get(["entity","readOnly"]),
        "eventPolicy":{"allow": [], "deny": [{"domain": "*", "name": "*"}]},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:storeChannelTags().get(["entity","validated"]),
        "eventPolicy":{"allow": allowEventPolicy, "deny": []},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
    }
  }

  rule updateName {
    select when store update
        name re#(.+)#
        setting(name)
    fired {
      ent:store{"name"} := name
    }
  }

  rule updateDescription {
    select when store update
        description re#(.+)#
        setting(description)
    fired {
      ent:store{"description"} := description
    }
  }

  /**
   * Starts the event flow to create a new Byway item entity.
   * When initiated, this rule creates a child pico and passes on the 
   * item meta data that will be used to populate the pico.
   * 
   * @param {string} name - Item name.
   * @param {string} description - Item description.
   */
  rule createNewItem {
    // Fire on a new user event with the required attributes.
    select when item new
      name re#(.+)#
      description re#(.+)#
      //image_url re#(.+)#
      //setting(name, description, image_url)
      setting(name, description)
    pre {
      id = random:uuid()
      picoName = name
      itemEntityExists = ent:itemEntityFamilyChannels.klog("itemEntityFamilyChannels:") >< id.klog("Item id:") 
    }
    if not itemEntityExists.klog("itemEnityExists") then 
      send_directive("requesting_new_item", {"name": picoName, "id": id})
    fired {
      raise wrangler event "new_child_request" attributes event:attrs.put({"id": id})
    }
    else {
      // TODO - Handle this error so that the UI can access it.
      log error "Failed to create a new store, invalid input or the store already exists."
    }

  }


  /** 
   * Installs the Byway item rulesets in the item pico
   * after it has been created. 
   */
  rule installItemRulesets {
    select when wrangler new_child_created
    // Loop over all rulesets and request that they be installed.
    foreach itemEntityRulesets setting(rid)
      pre {
        // Family channel of the item entity pico.
        itemEci = event:attrs{"eci"}
      }
      every {
        send_directive("Installing item entity rulesets", {"rid":rid})
        event:send({
          "eci": itemEci,
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
   * Adds pico entity ids to the managed store entity list.
   * 
   * @param {string} id - The id of the store entity pico.
   */
  rule addItemIds {
    select when wrangler new_child_created
    pre {
      id = event:attrs{"id"}
      eci = event:attrs{"eci"}
    }
    fired {
      ent:itemEntityFamilyChannels{id} := eci
    }
  }

  /**
   * Removes pico entity names from the managed user entity list.
   * 
   * @param {string} name - The name of the user entity pico.
   */
  rule deleteItem {
    select when item delete
    pre {
      id = event:attrs{"id"}
      exists = ent:itemEntityFamilyChannels >< id
      eciToDelete = ent:itemEntityFamilyChannels{id} 
    }
    if exists && eciToDelete then
      send_directive("deleting_item", {"id": id})

    // Delete item
    fired {
      raise wrangler event "child_deletion_request" attributes {
        "eci": eciToDelete,
      }
      clear ent:itemEntityFamilyChannels{id}
    }
  }

}
