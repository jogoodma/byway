
ruleset byway.request.tags {
  meta {
    name "Channel tags relating to requests"
    provides requestChannelTags
  }

  global {
    requestChannelTags = function() {
      return {
        "manager": {
          "requestList": ["byway", "request", "manager"]
        },
        "entity": {
          "readOnly": ["byway","request", "entity", "read-only"],
          "validated": ["byway", "request", "entity", "validated"],
        },
      }
    }
  }
}
