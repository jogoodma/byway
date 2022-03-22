
ruleset byway.agent.entity {
  meta {
    name "Agent Entity"
    description "Agent entity pico."
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription
    shares items
  }
  global {
    items = function() {
      itemSubs = subscription:established("Tx_role","item")
      itemResult = itemSubs.map(function(itemChannel) {
        queryResult = wrangler:picoQuery(itemChannel{"Tx"}, "byway.item", "item")
        return queryResult
      })
      return {
         "agentName": wrangler:name(),
          "items": itemResult
        }
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

}
