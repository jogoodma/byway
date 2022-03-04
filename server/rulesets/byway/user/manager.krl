ruleset byway.user.manager {
  meta {
    name "UserManager"
    description "Create and delete users."
    use module io.picolabs.wrangler alias wrangler
    shares userChannels
  }
  global {
    /**
     * Return a map of user entities.
     *  key - pico name
     *  value - public ECI for validation.
     * @returns {map} - A user entity map.
    */
    userChannels = function() {
      ent:userChannels.defaultsTo([])
    }
  }

  rule createNewUser {
    select when user new
    // Create a new user here.
    noop()
  }

  rule addUserEci {
    select when user add_eci
        name re#(.+)#
        eci re#(.+)#
        setting(name, eci)
    pre {
      existingChannels = userChannels()
    }
    fired {
      ent:userChannels := existingChannels.append({"name": name, "eci": eci})
    }
  }
  
  rule clearUserChannels {
    select when user_channels clear
    fired {
      ent:userChannels := []
    }
  }

  rule delete_user {
    select when user delete
      name re#(.+)#
      setting(name)
    // Delete user
    fired {
      ent:userChannels := userChannels().filter(function(user) { user{"name"} != name})
    }
  }
}
