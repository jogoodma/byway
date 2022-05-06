# Byway

The Byway is an alternate path for buyers and sellers to reach each other independently that does not
rely on Big Tech platforms.

```
Buyer  <------>  Matcher  <------>   Seller
```

**Note**: This is an alpha quality release and is not yet ready for use.

## Dependencies

* Node v16+
* npm
* Docker / Docker Compose

This has only been tested on with Docker on Intel Macs. It is not guaranteed to work on other platforms.

## Getting started

```shell
git clone https://github.com/jogoodma/byway.git
cd byway
touch client/apps/byway-ui/.env.seller
touch client/apps/byway-ui/.env.buyer
docker-compose up -d
```
Verify that the containers are up by running:
```shell
docker-compose ps
```
Be sure to note the host and port numbers that are exposed.

### Pico engine set up (Buyer and Seller)

A certain amount of manual configuration is required to get the Pico engine configured for
the Byway. 

1. Login to the `buyer-pico-admin` by opening a browser and navigating to the ip and port indicated by `docker-compose ps`.
2. Create three children nodes with the following names: `UserManager`, `StoreManager`, and `RequestManager`.
3. Open the `UserManager` pico and install the following rulesets:
```
file:///usr/src/app/rulesets/byway/user/tags.krl
file:///usr/src/app/rulesets/byway/user/manager.krl
```
4. Open the `StoreManager` pico and install the following rulesets:
```
file:///usr/src/app/rulesets/byway/store/tags.krl
file:///usr/src/app/rulesets/byway/store/manager.krl
```
5. Open the `RequestManager` pico and install the following rulesets:
```
file:///usr/src/app/rulesets/byway/request/tags.krl
file:///usr/src/app/rulesets/byway/request/manager.krl
```
6. Repeat this process for the `seller-pico-admin` pico. 

7. Open the `matcher-pico-admin` and install the following rulesets:
```
file:///usr/src/app/rulesets/byway/matcher/matcher.krl
```
### Channel set up

Using the [.env.template](./client/apps/byway-ui/.env.template) file as a guide, record the hostname
and byway ECI channels for the buyer, seller, and matcher. Restart the containers after recording the channels.

## Directory structure
```
├── backups                        - Pico engine backups.
├── client                         - Turbo repo monorepo for client UIs.
│   ├── apps    
│   │   └── byway-ui    - Byway client UI Remix app.
│   └── packages              - Common libraries shared among apps.
│       ├── byway-shared-ui   - Byway client UI Remix shared components. 
│       ├── config            - Turorepo config files. 
│       └── tsconfig          - TypeScript config files.
├── docs                            - Byway documentation.
├── proxy                           - Caddy proxy server config files.
├── server                          - Byway server related files. 
│   └── rulesets              - Pico engine rulesets.
│       └── byway             - Byway rulesets.
└── tests                           - Byway test data.
    └── data
        └── requests
```

## What is the Byway?

This is a proof of concept project that was created to explore the potential of a decentralized network that could be used to connect buyers and sellers.

For example, a local farmer wants to sell their produce to a local buyer. The farmer has a small IOT Byway device
that they use to list their produce for sale. Another local Byway user with a similar device finds the listing and
messages the farmer to buy the produce.

## Byway Architecture

### Overview

The Byway buyer and seller systems are made up of three components. The Pico Engine for implementing
most of the logic and network communication, Remix for the front end UI, and a Caddy proxy server that 
sits atop both.

```
===============================
|      Caddy Proxy Server     |
===============================
|     Remix    | Pico Engine  |    
===============================
```

### Buyer and Seller UI

The Byway buyer and seller system uses Remix for the front end UI. Remix is a React framework that 
takes the middle ground between a typical single page application (SPA) and a server side rendered
application (SSR). [Routes](./client/apps/byway-ui/app/routes/) are used to define pages that the
user can navigate to and use a combination of server side and client side rendering to bring
a fast and responsive experience to the user. The pages/routes use `loader` and `action` functions to define
what data is passed to the page for rendering (`loader`) and what is acted upon when a form is submitted (`action`).

The `loader` and `action` functions are where the communication with the Pico Engine endpoints take place.
Either fetching data for display or submitting data to the Pico Engine.

### Buyer and Seller Pico Engine

The Byway pico engine system has three main concepts. A user manager for managing users, a store manager
for managing stores and items within stores, and request manager for managing requests to buy and sell items.

### Byway Matcher Pico Engine

The Byway matcher uses an extremely simple tag based algorithm for allowing buyers and sellers to find
products that they are interested in. This is not meant to be a robust solution, but rather a proof of
concept that will be improved upon in the future.

## Future work
1. An enhanced matcher network.
2. Continue to refine the UI.
3. Improve error handling and add unit test coverage.
4. Add image upload support.
5. Authentication.

## References

1. [Byway](https://customercommons.org/category/byway/)
2. [Remix](https://remix.run) - React framework used for the Byway UI.
3. [Turbo Repo](https://turborepo.org/) - A monorepo management tool.
4. [Pico Engine](https://picolabs.io/) - The Pico Engine that powers the Byway system.
5. [Caddy](https://caddy.dev) - A lightweight HTTP server.
6. [Tailwind CSS](https://tailwindcss.com/) - CSS framework.
7. [Mantine](https://mantine.dev/) - React UI component library.
8. [Daisy UI](https://daisyui.dev) - Add on to the Tailwind CSS framework.
