ruleset byway.store.item {
  meta {
    name "StoreItem"
    description "Defines Byway store item attributes."
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    use module byway.store.tags alias tags

    shares getItem, getReadOnlyEci
  }
  global {
    getReadOnlyEci = function() {
      wrangler:channels(tags:storeChannelTags().get(["item","readOnly"])).head().get("id")
    }

    getItem = function() {
      publicEci = getReadOnlyEci()
      item = ent:item
      item.put("publicEci", publicEci)
    }
  }

  /**
   *  Initializes the item pico.
   *  
   * @param {string} name - Item name.
   * @param {string} description - Item description.
   * @param {string} image_url - Item image url.
  */
  rule initialize {
    select when wrangler ruleset_installed
        name re#(.+)#
        description re#(.+)#
        image_url re#(.+)#
        setting(name, description, image_url)
        where event:attrs{"rids"} >< meta:rid

    fired {
      ent:item{"itemId"} := random:uuid()
      ent:item{"name"} := name
      ent:item{"description"} := description
      ent:item{"image_url"} := image_url 
    }
    else {
      log error "Item initialization failed." 
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    pre {
      allowQueryPolicy = [
        {"rid": meta:rid, "name":"getItem"},
        {"rid": meta:rid, "name":"getReadOnlyEci"},
      ]

    }
    fired {
      log debug "Initializing read only channel in entity."
      log debug tags:storeChannelTags().get(["item","readOnly"])
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:storeChannelTags().get(["item","readOnly"]),
        "eventPolicy":{"allow": [], "deny": [{"domain": "*", "name": "*"}]},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:storeChannelTags().get(["item","validated"]),
        "eventPolicy":{"allow": [{"domain": "item", "name": "update"}], "deny": []},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
    }
  }


  rule updateName {
    select when item update
        name re#(.+)#
        setting(name)
    fired {
      ent:item{"name"} := name
    }
  }

  rule updateDescription {
    select when item update
        description re#(.+)#
        setting(description)
    fired {
      ent:item{"description"} := description
    }
  }

  rule updateImageUrl {
    select when item update
        image_url re#(.+)#
        setting(image_url)
    fired {
      ent:item{"image_url"} := image_url
    }
  }
}
