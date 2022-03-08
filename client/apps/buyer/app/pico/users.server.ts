export interface UserChannel {
  name: string;
  eci: string;
}

export interface User {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  publicEci: string;
  privateEci?: string;
}

export interface Directives {
  eid: string;
  directives: [
    {
      type: string;
      name: string;
      options: {
        [key: string]: string | number;
        privateUserEci: string;
      };
      meta: {};
    }
  ];
}

/**
 * Fetches the channel ECIs for users from the user manager.
 *
 * @param eci - The ECI of the user manager.
 * @return {Promise<UserChannel[]>} - A promise that resolves an array of user channel ECIs
 */
export const fetchUserChannels = async (
  eci: string
): Promise<UserChannel[]> => {
  const resp = await fetch(
    `http://buyer-server:3000/c/${eci}/query/byway.user.manager/userChannels`,
    { method: "POST" }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw Error("Error fetching user channels.");
};

/**
 * Fetches the basic user data from the public ECI.
 *
 * @param eci - The read-only user ECI.
 * @return {Promise<User>} - The user metadata, except the password.
 *
 */
export const fetchUser = async (eci: string): Promise<User> => {
  const resp = await fetch(
    `http://buyer-server:3000/c/${eci}/query/byway.user.entity/getUser`,
    { method: "POST" }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw Error("Error fetching user.");
};

export const authenticateUser = async (
  eci: string,
  password: string
): Promise<Directives> => {
  const resp = await fetch(
    `http://buyer-server:3000/c/${eci}/event-wait/user/authenticate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ password: password }),
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw Error("Error authenticating user.");
};
