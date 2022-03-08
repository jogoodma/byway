
ruleset byway.user.entity {
  meta {
    name "UserEntity"
    description "Defines basic user attributes."
    use module io.picolabs.wrangler alias wrangler
    use module byway.validation.email alias email_validator
    shares getUser
  }
  global {
    getUser = function() {
      user = ent:user.defaultsTo({})
      // Hide password from API
      user.delete("password").put("publicEci", meta:eci)
    }
  }

  /**
   *  Initializes the user entity pico.
   *  
   * @param {string} firstName
   * @param {string} surname
   * @param {string} email
   * @param {string} password
   * @returns void
  */
  rule init {
    select when user new
        firstName re#(.+)#
        surname re#(.+)#
        email re#(.+)#
        username re#(.+)#
        password re#(.+)#
        setting(firstName, surname, email, username, password)
    pre {
      userDoesNotExist = ent:user{"username"}.isnull()
    }
    if email_validator:isValid(email) && userDoesNotExist then noop()
    fired {
      ent:user{"firstName"} := firstName
      ent:user{"surname"} := surname
      ent:user{"email"} := email
      ent:user{"username"} := username
      ent:user{"password"} := password
    }
    else {
      log error "User is already initialized."
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

  rule updatePassword {
    select when user update
        oldPassword re#(.+)#
        newPassword re#(.+)#
        setting(oldPassword, newPassword)
    if (oldPassword == ent:user{"password"}) then noop() 
    fired {
      ent:user{"password"} := newPassword
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
