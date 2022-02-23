ruleset byway.agent.buyer {
  meta {
    name "Buyer Agent"
    description "Buyer agent pico."
    use module io.picolabs.wrangler alias wrangler
    use module byway.validation.email alias email_validator
    shares items, user, email, type
  }
  global {
    items = function() {
      ent:items.defaultsTo({})
    }
    user = function() { ent:user }
    email = function() { ent:email }
    type = function() { ent:type }

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
    select when wrangler ruleset_installed where event:attrs{"rids"} >< meta:rid
      every {
          wrangler:createChannel(
            ["byway", "buyer", "agent"],
            eventPolicy,
            queryPolicy,
          ) setting(channel)
          send_directive("new channel", {"eci": channel{"id"}})
      }
      fired {
        log debug "Creating buyer agent channel"
        ent:user := event:attrs{"name"}
        ent:email := event:attrs{"email"}
        ent:type := event:attrs{"type"}
        ent:password := event:attrs{"password"}
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
