# Byway

The Byway is an alternate path for buyers and sellers to reach each other independently that doesn’t rely on Big Tech platforms.

## Dependencies

* Node v16+
* Docker / Docker Compose

## Getting started

```
git clone https://github.com/jogoodma/byway.git
cd byway
docker-compose up -d
```

## Directory structure

```
.
├── client                  - Turbo Repo monorepo for client UIs
│   ├── apps                - Buyer and seller UIs
│   │   ├── buyer           - Buyer UI Remix app
│   │   ├── docs            - Documentation
│   └── packages            - Common libraries shared among apps
│       ├── config
│       ├── tsconfig
│       └── ui              - UI components
├── proxy                   - Proxy server that sits on top of the server and client.
└── server
    └── rulesets            - Pico engine rulesets
```

## References

1. [Byway](https://customercommons.org/category/byway/)
2. [Remix](https://remix.run)
3. [Turbo Repo](https://turborepo.org/)
