
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
      ent:user.defaultsTo({})
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
        password re#(.+)#
        setting(firstName, surname, email, password)
    pre {
      userDoesNotExist = ent:user{"email"}.isnull()
    }
    if email_validator:isValid(email) && userDoesNotExist then noop()
    fired {
      ent:user{"firstName"} := firstName
      ent:user{"surname"} := surname
      ent:user{"email"} := email
      ent:user{"password"} := password
    }
    else {
      log error "User is already initialized."
    }
  }

  rule update_name {
    select when user update
        firstName re#(.+)#
        surname re#(.+)#
        setting(firstName, surname)
    fired {
      ent:user{"firstName"} := firstName
      ent:user{"surname"} := surname
    }
  }

  rule update_email {
    select when user update
        email re#(.+)#
        setting(email)
    if email_validator:isValid(email) then noop()
    fired {
      ent:user{"email"} := email
    }
  }

  rule update_password {
    select when user update
        password re#(.+)#
        setting(password)
    fired {
      ent:user{"password"} := password
    }
  }

  rule delete_user {
    select when user delete
    // Delete user
    noop()
  }
}
