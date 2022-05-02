
ruleset byway.matcher.matcher {
  meta {
    name "MatcherNetwork"
    description "A simple tag based matcher for the Byway"
    use module io.picolabs.wrangler alias wrangler
    use module io.picolabs.subscription alias subscription

    shares getRequests, getTagIndex, findRequestByTag
  }
  global {
    getRequests = function() { ent:requests.defaultsTo([]) }
    getTagIndex = function() { ent:tagIndex.defaultsTo({}) }

    findRequestByTag = function(tags = "") {
      tagList = tags.split(re#[,;\s]+#).klog("tagList")
      tagIndex = getTagIndex().klog("tagIndex")
      matchingTags = tagIndex.keys().intersection(tagList).klog("Matching tags")
      matchingTags.reduce(
        function(a, b) {
          requestIndices = tagIndex[b]
          a.put(requestIndices)
        },
        {}
      ).keys().map(function(i) {
        getRequests()[i.as("Number")]
      }).defaultsTo([])
    }


    /**
      * Given a list of tags and a request index, inserts them into the tag index.
      *
      * The index is a map of maps where the outer map key
      * is the tag name and the value is a map of the index for the corresponding
      * request. The value of the inner map is ignored and always 1. 
      * This is so that we can avoid having to deal with duplication.
      *
      * @param {map} tagIndex - The tag index to update
      * @param {array} tags - The tags to add to the index
     */
    updateTagIndex = function(tagIndex, tags, requestIdx) {
      return tags.reduce(
        function(a, b)  {
          return a.put([b, requestIdx], 1)
        },
        tagIndex.defaultsTo({})
      )
    }
  }

  rule initialize_channels {
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
    pre {
      allowQueryPolicy = [
        {"rid": meta:rid, "name":"findRequestByTag"},
      ]
    }
    noop()
    fired {
      log debug "Initializing matcher manager channel."
      raise wrangler event "new_channel_request" attributes {
        "tags": ["byway","matcher"],
        "eventPolicy":{"allow": [], "deny": [{"domain": "*", "name": "*"}]},
        "queryPolicy":{"allow": allowQueryPolicy, "deny": []},
      }
    }
  }

  rule addRequest {
    select when matcher add_request
    pre {
      requests = getRequests()
      // Next array index for the new request
      nextReqPos = requests.length()
      id = random:uuid()
      userReq = event:attrs{"request"}.put(["id"], id)

      // Check that the request object isn't empty.
      numKeys = userReq.keys().length().klog("numKeys")
      tags = userReq{"tags"}.defaultsTo([])
      isValid = userReq && numKeys > 0 && tags.length() > 0
    }

    if isValid then
      send_directive("Adding user request")
    fired {
      ent:requests := requests.append(userReq)
      ent:tagIndex := updateTagIndex(getTagIndex(), tags, nextReqPos)
      log debug "Added request"
    }
  }

  rule clearRequests {
    select when matcher clear_requests
    fired {
      ent:requests := []
      ent:tagIndex := {}
      log debug "Cleared requests"
    }
  }
}
