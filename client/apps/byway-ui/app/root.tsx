import type { LinksFunction, MetaFunction } from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import tailwindStyles from "~/styles/app.css";
import styles from "~/styles/global.css";
import { Link } from "@remix-run/react";
import React from "react";

export const meta: MetaFunction = () => {
  return { title: "Byway" };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStyles },
    { rel: "stylesheet", href: styles },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col justify-between">
        <header className="pt-4 pb-2 px-4 bg-black/70 text-white border-b border-b-white flex flex-col flex-nowrap items-center justify-end">
          <h1 className="uppercase text-5xl font-bold">Byway</h1>
          <div className="self-stretch flex justify-between">
            <div>
              <nav>
                <ol className="flex flex-row flex-wrap md:gap-6 gap-2 text-lg">
                  <li>
                    <Link to="/" className="py-1 px-4">Home</Link>
                  </li>
                  <li>
                    <Link to="/stores" className="py-1 px-4">My Stores</Link>
                  </li>
                  <li>
                    <Link to="/marketplace" className="py-1 px-4">Requests</Link>
                  </li>
                </ol>
              </nav>
            </div>
            <div>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </header>
        <Outlet />
        <footer className="h-32 shrink-0 text-white bg-black w-full text-center">Byway footer</footer>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
