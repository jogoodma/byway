ruleset byway.store.item {
  meta {
    name "StoreItem"
    description "Defines Byway store item attributes."
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    use module byway.store.tags alias tags

    shares getItem, getPublicEci
  }
  global {
    getPublicEci = function(type = "readOnly") {
      wrangler:channels(tags:storeChannelTags().get(["item",type])).head().get("id")
    }

    getItem = function() {
      publicEci = getPublicEci("validated")
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
        id re#(.+)#
        name re#(.+)#
        description re#(.+)#
        setting(id, name, description)
        where event:attrs{"rids"} >< meta:rid
    pre {
      item_id = id.defaultsTo(random:uuid())
      image_url = event:attrs{"image_url"}
      tags = event:attrs{"tags"}.defaultsTo("").split(re#\s*,\s*#).map(function(tag) { tag.trim() }).filter(function(tag) { tag.length() > 0 })
    }

    fired {
      ent:item{"id"} := item_id
      ent:item{"name"} := name
      ent:item{"description"} := description
      ent:item{"image_url"} := image_url 
      ent:item{"tags"} := tags
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
        {"rid": meta:rid, "name":"getPublicEci"},
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

  rule updateTags {
    select when item update
        tags re#(.+)#
        setting(tags)
    pre {
      splitTags = event:attrs{"tags"}.defaultsTo("").split(re#\s*,\s*#).map(function(tag) { tag.trim() }).filter(function(tag) { tag.length() > 0 })
    }
    fired {
      ent:item{"tags"} := splitTags
    }
  }
}
