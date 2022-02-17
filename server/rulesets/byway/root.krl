ruleset byway.root {
  meta {
    name "Byway Root"
    description "Base rulesets for managing buyer and seller agents.."
    use module io.picolabs.wrangler alias wrangler
    use module byway.validation.email alias email_validator
    shares agents, buyerAgents, sellerAgents, agentExists
  }
  global {
    /**
     * Return a list of agents by type.
     *
     * @param {Array} type - Type of agent to return. default: ["buyer", "seller"]
     * @returns {Array} - An array of all agents matching the type.
    */
    agents = function(type = ["buyer", "seller"]) {
      wrangler:children().filter(function(child) {
        true
      })
    }
    /**
     * Returns an Array of all buyer agents.
     *
     * @returns {Array} - An array of buyer agents.
    */
    buyerAgents = function() { agents(["buyer"]) }

    /**
     * Returns an Array of all seller agents.
     *
     * @returns {Array} - An array of seller agents.
    */
    sellerAgents = function() { agents(["seller"]) }

    /**
     * Tests for the existence of an agent.
     *
     * @param {string} name - The name.
     * @param {string} email - The email.
     * @param {string} type - The type.
     *
     * @returns {boolean} - Whether the given agents exists.
    */
    agentExists = function(name, email, type) {
        agents().any(function(agent) {
           agent{"name"} == name && agent{"email"} == email && agent{"type"} == type
        })
    }
  }

  /**
   * Blocks creation of duplicate agents.
   * Uniqueness is based on name, email and type.
  */
  rule doesAgentExist {
    select when byway create_new_agent
        name re#(.+)#
        email re#(.+)#
        type re#^(buyer|seller)$#
        setting(name, email, type)
     if agentExists(name, email, type) then
        send_directive("duplicate agent", {"name": name, "email": email})
     fired {
        last
     }
  }

  /**
   * Create a new agent.
   *
   * @param {string} name - Fullname.
   * @param {string} email - Email.
   * @param {string} type - The agent type.
   * @param {string} password - The encrypted password.
  */
  rule createNewAgent {
    select when byway create_new_agent
        name re#(.+)#
        email re#(.+)#
        type re#^(buyer|seller)$#
        password re#(.+)#
        setting(name, email, type, password)
    if email_validator:isValid(email) then noop()
    fired {
      raise wrangler event "new_child_request"
          attributes {
              "name": name,
              "email": email,
              "type": type,
              "password": password
          }
    }
  }
}
