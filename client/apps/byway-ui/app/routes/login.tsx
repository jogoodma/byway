import { useState } from 'react';
import { useLoaderData, redirect, Link, Form } from "remix";
import type { ActionFunction, LoaderFunction, LinksFunction } from "remix";

import {
  authenticateUser,
  listUsers,
  fetchUser,
} from "~/pico/users.server";
import type { User } from "~/pico/users.server";
import { picoEngine } from "~/cookies";

import styles from "~/styles/login.css";
import { Divider } from "@mantine/core";
import UserLogin from "~/components/UserLogin";
import NewUser from "~/components/NewUser";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = (await picoEngine.parse(cookieHeader)) ?? {};
  const formData = await request.formData();

  const eci = formData.get("eci") as string;
  const password = formData.get("password") as string;
  console.log(eci, password);
  //const passwordHash = await bcrypt.hash(password, 10)

  // const result = await authenticateUser(eci, password);
  // cookie.privateUserEci = result.directives.find(
  //   (d) => d.name === "authenticated"
  // )?.options?.privateUserEci;
  //
  // if (cookie.privateUserEci) {
  //   return redirect("/", {
  //     headers: {
  //       "Set-Cookie": await picoEngine.serialize(cookie),
  //     },
  //   });
  // }
  return null;
};

export let loader: LoaderFunction = async () => {
  return listUsers();
};

const Login = () => {
  const users: User[] = useLoaderData();
  const [ showPassword, setShowPassword ] = useState(false);
  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <section>
        <h1 className="text-slate-600 text-4xl mb-4">Login</h1>
        <Divider />
        <div className="mt-10 flex flex-wrap justify-center gap-10 md:gap-20">
          <Form method="post">
            {users.map((user) => <UserLogin user={user} key={user.email} />)}
          </Form>
          <Link to={`/users/new`} className="py-1 px-4 bg-slate-400 text-white rounded-full self-center ring-2 ring-gray-600">
            Register New User
          </Link>
        </div>
      </section>
    </main>
  );
};
export default Login;
