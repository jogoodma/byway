import { useLoaderData, redirect } from "remix";
import type { ActionFunction, LoaderFunction, LinksFunction } from "remix";
import {
  getItems
} from "~/pico/users.server";

import {Button, Center, Container, Divider, Grid, Table} from "@mantine/core";

/*export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};*/

export let loader: LoaderFunction = async () => {
  // TODO This ECI is hard coded!!!
  const storeItems = await getItems("cl065obr700g408qh5a329yfh");
  return storeItems;
};

const Login = () => {
  const items = useLoaderData();

  return (
    <main>
      <div className="container">
        <h1>Store Items</h1>
        <Divider />
        {items.map(store => {
          const rows = store.items.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
            </tr>
            )
          )
          return (
            <>
              <h2>{store.agentName}</h2>
              <Table striped highlightOnHover>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </>
          )
        })}
      </div>
    </main>
  );
};
export default Login;
