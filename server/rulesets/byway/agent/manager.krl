ruleset byway.agent.manager {
  meta {
    name "AgentManager"
    description "Manage Byway agents (stores)."
    use module io.picolabs.wrangler alias wrangler
    shares agentChannels
  }
  global {
    /**
      * Return a list of channel entities.
     *  value - public ECI for validation.
     * @returns {list} - A user entity list.
    */
    agentChannels = function() {
      ent:agentChannels.defaultsTo([])
    }
  }

  rule createNewAgent {
    select when agent new
    // Create a new user here.
    noop()
  }

  rule addAgentEci {
    select when agent add_eci
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
  
  rule clearAgentChannels {
    select when agent_channels clear
    fired {
      ent:agentChannels := []
    }
  }

  rule delete_agent {
    select when user delete
      name re#(.+)#
      setting(name)
    // Delete user
    fired {
      ent:agentChannels := agentChannels().filter(function(agent) { agent{"name"} != name})
    }
  }
}
