ruleset byway.user.entity {
  meta {
    name "UserEntity"
    description "Defines Byway user attributes."
    use module io.picolabs.wrangler alias wrangler
    use module byway.validation.email alias email_validator
    use module io.picolabs.subscription alias subscription

    shares getUser, getItems
  }
  global {
    getUser = function() {
      user = ent:user.defaultsTo({})
      // Hide password from API
      user.delete("passwordHash").put("publicEci", meta:eci)
    }
    // isAuthenticated = function() {
    //   // Add remote call to remix API validation.
    //   privateEci = wrangler:channels(["byway","entity","user","validated"]).head(){"id"}
    //   return privateEci
    // }
    getItems = function() {
      agentSubs = subscription:established("Tx_role","agent")
      itemResult = agentSubs.map(function(agentChannel) {
        queryResult = wrangler:picoQuery(agentChannel{"Tx"}, "byway.agent.entity", "items")
        return queryResult
      })
      return itemResult
    }
  }

  /**
   *  Initializes the user entity pico.
   *  
   * @param {string} firstName - The user's first name.
   * @param {string} surname - The user's surname.
   * @param {string} username - The user's username.
   * @param {string} email - The user's email address.
   * @param {string} passwordHash - The user's password hash.
  */
  rule initialize_user_entity {
    select when wrangler ruleset_installed
        firstName re#(.+)#
        surname re#(.+)#
        username re#(.+)#
        email re#(.+)#
        passwordHash re#(.+)#
        setting(firstName, surname, username, email, passwordHash)
        where event:attrs{"rids"} >< meta:rid

    if email_validator:isValid(email.klog("Email:")) then
      noop()

    fired {
      ent:user{"userId"} := random:uuid()
      ent:user{"firstName"} := firstName
      ent:user{"surname"} := surname
      ent:user{"email"} := email
      ent:user{"username"} := username
      ent:user{"passwordHash"} := passwordHash
    }
    else {
      log error "User initialization failed." 
    }
  }

  rule updateName {
    select when user update
        firstName re#(.+)#
        surname re#(.+)#
        setting(firstName, surname)
    fired {
      ent:user{"firstName"} := firstName
      ent:user{"surname"} := surname
    }
  }

  rule updateEmail {
    select when user update
        email re#(.+)#
        setting(email)
    if email_validator:isValid(email) then noop()
    fired {
      ent:user{"email"} := email
    }
  }

  rule updateUsername {
    select when user update
        username re#(.+)#
        setting(username)
    fired {
      ent:user{"username"} := username
    }
  }

  rule updatePasswordHash {
    select when user update
        oldPasswordHash re#(.+)#
        newPasswordHash re#(.+)#
        setting(oldPasswordHash, newPasswordHash)
    if (oldPasswordHash == ent:user{"passwordHash"}) then noop() 
    fired {
      ent:user{"passwordHash"} := newPasswordHash
    }
    else {
      log error "Invalid password supplied."
    }
  }

  rule deleteUser {
    select when user delete
    // Delete user
    noop()
  }

  rule authenticateUser {
    select when user authenticate
        password re#(.+)#
        setting(password)
    pre {
      privateEci = wrangler:channels(["byway","entity","user","validated"]).head(){"id"}
    }
    if (privateEci && password == ent:user{"password"}) then every {
      send_directive("authenticated", {"privateUserEci": privateEci})
    }
    fired {
      log debug "Password = " + password
    }
    else {
      log debug "Password = " + password
    }
  }
}
