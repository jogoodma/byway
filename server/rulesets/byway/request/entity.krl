ruleset byway.request.entity {
  meta {
    name "Request"
    description "Defines Byway Request attributes."
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    use module byway.request.tags alias tags

    shares getRequest, getReadOnlyEci
  }
  global {
    getReadOnlyEci = function() {
      wrangler:channels(tags:requestChannelTags().get(["request","readOnly"])).head().get("id")
    }

    getRequest = function() {
      publicEci = getReadOnlyEci()
      request = ent:request
      request.put("publicEci", publicEci)
    }
  }

  /**
   *  Initializes the request pico.
   *  
   * @param {string} name - request name.
   * @param {string} description - request description.
   * @param {string} image_url - request image url.
  */
  rule initialize {
    select when wrangler ruleset_installed
      name re#(.+)#
      message re#(.+)#
      type re#^(sell|buy)$#
      quantity re#^[0-9]+$#
      price re#^[0-9\.\,\_]+$#
      item_eci re#(.+)#
      setting(name, message, type, quantity, price, item_eci)
      where event:attrs{"rids"} >< meta:rid

    fired {
      ent:request{"requestId"} := random:uuid()
      ent:request{"name"} := name
      ent:request{"message"} := message
      ent:request{"type"} := type
      ent:request{"quantity"} := quantity
      ent:request{"price"} := price
      ent:request{"itemEci"} := item_eci
    }
    else {
      log error "request initialization failed." 
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    pre {
      allowQueryPolicy = [
        {"rid": meta:rid, "name":"getRequest"},
        {"rid": meta:rid, "name":"getReadOnlyEci"},
      ]

    }
    fired {
      log debug "Initializing read only channel in entity."
      log debug tags:requestChannelTags().get(["request","readOnly"])
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:requestChannelTags().get(["request","readOnly"]),
        "eventPolicy":{"allow": [], "deny": [{"domain": "*", "name": "*"}]},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
      raise wrangler event "new_channel_request" attributes {
        "tags": tags:requestChannelTags().get(["request","validated"]),
        "eventPolicy":{"allow": [{"domain": "request", "name": "update"}], "deny": []},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
    }
  }

  rule addComments {
    select when request add_comments
        comment re#(.+)#
        party re#(.+)#
        setting(comment, party)
    pre {
      comments = ent:request{"comments"}.defaultsTo([]).append({"comment": comment, "party": party})
    }
    fired {
      ent:request{"comments"} := comments
    }
  }
}
