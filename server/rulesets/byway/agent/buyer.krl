ruleset byway.agent.buyer {
  meta {
    name "Buyer Agent"
    description "Buyer agent pico."
    use module byway.validation.email alias email
    shares items, name, email
  }
  global {
    items = function() {
      ent:items.defaultsTo({}).values()
    }
    name = function() { 
      ent:name
    }
    email = function() {
      ent:email
    }
  }

  rule set_name {
    select when buyer_agent set_name
    pre {
      name = event:attrs{"name"}.klog("Name attribute:")
    }
    send_directive("store_name", {"name":name})
    fired {
      ent:name := name
    }
  }

  rule set_email {
    select when buyer_agent set_email
    pre {
      email_addr = event:attrs{"email"}.klog("Email attribute:")
    }
    if (email.isValid(email_addr)) {
      send_directive("store_email", {"email":email})
    }
    fired {
      ent:email := email
    }
  }

/*
  rule addItem {
    select when item add
    pre {

    } 
  }
  */
}
