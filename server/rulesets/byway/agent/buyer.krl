ruleset byway.agent.buyer {
  meta {
    name "Buyer Agent"
    description "Buyer agent pico."
    use module byway.validation.email alias email_validator
    shares items, user
  }
  global {
    items = function() {
      ent:items.defaultsTo({})
    }
    user = function() {
      ent:user
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

  rule init {
    select when wrangler ruleset_installed where event:attr("rids") >< meta:rid
      every {
        wrangler:createChannel(["byway","buyer","agent"], eventPolicy, queryPolicy)
      }
  }

  rule update_user_name {
    select when user update
    pre {
      name = event:attrs{"name"}.klog("Name attribute:")
    }
    fired {
      ent:user{"name"} := name
    }
  }

  rule update_user_email {
    select when user update
    pre {
      email = event:attrs{"email"}.klog("Email attribute:")
    }
    if (email_validator:isValid(email)) then
        send_directive("user_updated", {"email":email})
    fired {
      ent:user{"email"} := email
    }
    else {
      error error email + " is invalid."
    }
  }
}
