
ruleset byway.user.tags {
  meta {
    name "Channel tags relating to users"
    provides userChannelTags
  }

  global {
    userChannelTags = function() {
      return {
        "manager": {
          "userList": ["byway", "user", "manager", "list"]
        },
        "entity": {
          "readOnly": ["byway","user", "entity", "read-only"],
          "readWrite": ["byway", "user", "entity", "read-write"]
        },
      }
    }
  }
}
