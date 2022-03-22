ruleset byway.item {
  meta {
    name "Byway item"
    description "Item pico."
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    shares item
  }
  global {
    item = function() {
      ent:item
    }

    // TODO Tighten down permissions after debugging.
    eventPolicy = {
      "allow": [ { "domain": "*", "name": "*" }, ],
      "deny": []
    }
    queryPolicy = {
      "allow": [ { "rid": meta:rid, "name": "*" } ],
      "deny": []
    }
  }

  rule updateItem {
    select when item update 
        name re#(.+)#
        description re#(.+)#
        // TODO - add validation for price.
        price re#([\-\d\.]+)#
        setting(name, description, price)

      fired {
        ent:item := ent:item.defaultsTo({}).put({
          "name": name,
          "description": description,
          "price": price.as("Number")
        })
      }
        
  }

}

