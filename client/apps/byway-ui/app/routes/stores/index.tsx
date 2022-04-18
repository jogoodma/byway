import { useState } from 'react';
import {useLoaderData, redirect, Link} from "remix";
import type { ActionFunction, LoaderFunction, LinksFunction } from "remix";
import { getItems } from "~/pico/users.server";
import { faker } from "@faker-js/faker";

import { Button, Center, Container, Divider, Grid, Table } from "@mantine/core";

/*export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};*/

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const stores = ['Personal', 'Btown Organic','Btown Antiques']

export let loader: LoaderFunction = async () => {
  // TODO This ECI is hard coded!!!
  // const storeItems = await getItems("cl065obr700g408qh5a329yfh");
  const storeItems = [];
  const stores = ['Personal', 'Btown Organic','Btown Antiques']
  for (let i = 0; i < 30; i++) {
    storeItems.push({
      id: i,
      name: faker.commerce.productName(),
      store: stores[getRandomInt(stores.length)],
      description: faker.commerce.productDescription(),
      quantity: getRandomInt(10) + 1,
      price: faker.commerce.price()
    });
  }
  return storeItems;
};

const StoresIndexRoute = () => {
  const items = useLoaderData();
  const [selectedStores, setSelectedStores] = useState(new Set(stores));
  const handleFilterStore = (store) => {
    setSelectedStores((prevState => {
      if (prevState.has(store)) {
        prevState.delete(store);
      } else {
        prevState.add(store);
      }
      return new Set(prevState);
    }))

  }
  const rows = items
    .filter(item => selectedStores.has(item.store))
    .map((item) => (
      <tr key={item.name}>
        <td><input type="checkbox" name={item.name} /></td>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.store}</td>
        <td>{item.quantity}</td>
        <td><strong>$</strong>{item.price}</td>
      </tr>
    ));

  return (
    <main className="m-10 p-10 bg-white rounded-lg">
      <h1 className="text-slate-600 text-4xl mb-4">Items</h1>
      <Divider />
      <section className="mb-10">
        <h2 className="text-2xl">Filters</h2>
        <div>
          <strong>Stores:</strong>
          {stores.map(store => (
            <span key={store} className="mr-2">
              <input type="checkbox" checked={selectedStores.has(store)} name={store} onClick={() => handleFilterStore(store)} />
              {store}
            </span>
          ))}
        </div>
      </section>
      <section className="mb-10">
        <Link to="/stores/item/new">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            New Item
          </button>
        </Link>
      </section>
      <section>
      <Table striped highlightOnHover>
        <thead>
        <tr>
          <th><input type="checkbox" /></th>
          <th>Name</th>
          <th>Description</th>
          <th>Store</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      </section>
    </main>
  );
};
export default StoresIndexRoute;
