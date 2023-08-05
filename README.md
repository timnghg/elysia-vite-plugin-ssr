# elysia-vite-plugin-ssr ![Test](https://github.com/timnghg/elysia-vite-plugin-ssr/actions/workflows/main.yml/badge.svg)

Use [vite-plugin-ssr](https://vite-plugin-ssr.com/) with [Elysia](https://elysiajs.com/).

## 1. Install

`bun add elysia-vite-plugin-ssr`

## 2. Usage

2.1. Prepare `src/pages` & `src/renderer` directory for vite-plugin-ssr. `src` can be changed at will.
Please follow [vite-plugin-ssr guide](https://vite-plugin-ssr.com/add) for detailed instruction & example.

2.2. Use `elysiaVitePluginSsr` plugins.

```js
// src/index.ts
import {Elysia} from 'elysia';
import {elysiaVitePluginSsr} from 'elysia-vite-plugin-ssr';

const app = new Elysia()
    .use(elysiaVitePluginSsr({
        pluginSsr: { // <-- must be exist to trigger vite-plugin-ssr
            // ... vite-plugin-ssr options
            // baseAssets: 'https://cdn.example.com/assets/'
        },
        // ... optional other vite config
        base: "/ssr", // no trailing slash
        root: path.resolve(import.meta.dir, "./"), // directories `./pages`, `./renderer` should exists
    }));
```
