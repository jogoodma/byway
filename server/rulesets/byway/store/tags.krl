
ruleset byway.store.tags {
  meta {
    name "Channel tags relating to stores"
    provides storeChannelTags
  }

  global {
    storeChannelTags = function() {
      return {
        "manager": {
          "storeList": ["byway", "store", "manager"]
        },
        "entity": {
          "readOnly": ["byway","store", "entity", "read-only"],
          "validated": ["byway", "store", "entity", "validated"],
        },
        "item": {
          "readOnly": ["byway","store", "item", "read-only"],
          "validated": ["byway", "store", "item", "validated"],
        },
      }
    }
  }
}
