ruleset byway.user.manager {
  meta {
    name "UserManager"
    description "Create and delete users."
    use module io.picolabs.wrangler alias wrangler
    shares users
  }
  global {
    /**
     * Return a map of user entities.
     *  key - pico name
     *  value - public ECI for validation.
     * @returns {map} - A user entity map.
    */
    users = function() {
      ent:users.defaultsTo({})
    }
  }

  rule create_new_user {
    select when user new
    // Create a new user here.
    noop()
  }

  rule delete_user {
    select when user delete
    // Delete user
    noop()
  }
}
