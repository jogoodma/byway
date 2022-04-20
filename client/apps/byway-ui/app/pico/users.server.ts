export interface UserChannel {
  name: string;
  eci: string;
}

export interface User {
  firstName: string;
  surname: string;
  username: string;
  email: string;
  passwordHash: string;
  publicEci?: string;
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


// Set some defaults depending on if we are running in Docker vs. dev mode.
const PICO_BASE_URI = (process.env.NODE_ENV === 'production')
  ? 'https://buyer-server:3000'
  : (process.env?.PICO_BASE_URI)
    ? process.env.PICO_BASE_URI
    : (() => {throw new Error("PICO_BASE_URI is not set")})();

const USER_MANAGER_ECI = (process.env?.USER_MANAGER_ECI)
  ? process.env?.USER_MANAGER_ECI
  : (() => {throw new Error("USER_MANAGER_ECI is not set")})();

/**
 * Get a list of Byway users.
 *
 * @return {Promise<User[]>} - A promise that resolves an array of users.
 */
export const listUsers = async (): Promise<User[]> => {
  const resp = await fetch(
    `${PICO_BASE_URI}/c/${USER_MANAGER_ECI}/query/byway.user.manager/listUsers`,
    { method: "POST" }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error fetching user channels.");
};

export const registerUser = async ({ user }) => {
  console.log("Registering user...", user);
  const resp = await fetch(
    `${PICO_BASE_URI}/c/${USER_MANAGER_ECI}/event-wait/user/new`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "post",
      body: JSON.stringify(user)
    }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error registering user.");
};

/**
 * Fetches the basic user data from the public ECI.
 *
 * @param eci - The read-only user ECI.
 * @return {Promise<User>} - The user metadata, except the password.
 *
 */
export const fetchUser = async (eci: string): Promise<User> => {
  const userManagerEci = process.env.USER_MANAGER_ECI;
  if (!userManagerEci) {
    throw new Error("USER_MANAGER_ECI must be set");
  }
  const resp = await fetch(
    `${PICO_BASE_URI}/c/${userManagerEci}/query/byway.user.manager/getUser`,
    { method: "POST" }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error fetching user.");
};

export const authenticateUser = async (
  eci: string,
  password: string
): Promise<Directives> => {
  const resp = await fetch(
    `${PICO_BASE_URI}/c/${eci}/event-wait/user/authenticate`,
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
  throw new Error("Error authenticating user.");
};

export const getItems = async (eci: string) => {
  const resp = await fetch(
    `${PICO_BASE_URI}/c/${eci}/query/byway.user.entity/getItems`,
    { method: "POST" }
  );
  if (resp.ok) {
    return resp.json();
  }
  throw new Error("Error fetching user.");
};
