import { useLoaderData, redirect } from "remix";
import type { ActionFunction, LoaderFunction, LinksFunction } from "remix";
import { authenticateUser, fetchUserChannels, fetchUser } from "~/pico/users.server";
import type { User } from "~/pico/users.server";
import { picoEngine } from "~/cookies";

import styles from "~/styles/login.css";
import { Button, Center, Container, Divider, Grid } from "@mantine/core";
import UserLogin from "~/components/UserLogin";
import NewUser from "~/components/NewUser";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
}

export const action: ActionFunction = async ({request}) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await picoEngine.parse(cookieHeader)) ?? {};
  const formData = await request.formData();

  const eci = formData.get("publicEci") as string;
  const password = formData.get("password") as string;

  const result = await authenticateUser(eci, password);
  cookie.privateUserEci = result.directives.find(d => d.name === 'authenticated')?.options?.privateUserEci

  return redirect("/", {
    headers: {
      "Set-Cookie": await picoEngine.serialize(cookie),
    }
  });
}


export let loader: LoaderFunction = async () => {
  // TODO This ECI is hard coded!!!
  const userChannels = await fetchUserChannels("cl05vgib800hd07qh5hgm0xse");
  const userResponses = await Promise.allSettled(
    userChannels?.map(async (channel) => await fetchUser(channel.eci))
  );
  return (
    userResponses.filter((res) => res.status === "fulfilled") as
      | PromiseFulfilledResult<User>[]
      | undefined
  )?.map((u) => u.value);
};

export default function Login() {
  const users: User[] = useLoaderData();
  return (
    <main>
      <div className="login-container">
        <h1>Login</h1>
        <Divider />
        <Grid justify="center" gutter="xl" className="user-grid">
          {users.map((u) => (
            <Grid.Col md={4} lg={3} key={u.publicEci}>
              <UserLogin user={u} />
            </Grid.Col>
          ))}
          <Grid.Col md={4} lg={3}>
            <NewUser />
          </Grid.Col>
        </Grid>
      </div>
    </main>
  );
}
