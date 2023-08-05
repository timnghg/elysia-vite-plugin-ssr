# elysia-vite-plugin-ssr ![Test](https://github.com/timnghg/elysia-vite-plugin-ssr/actions/workflows/main.yml/badge.svg)

Use [vite-plugin-ssr](https://vite-plugin-ssr.com/) with [Elysia](https://elysiajs.com/).

## 1. Install

`bun add elysia-vite-plugin-ssr`

## 2. Usage

```js
import {Elysia} from 'elysia';
import {elysiaVitePluginSsr} from 'elysia-vite-plugin-ssr';

const app = new Elysia({
    plugins: [
        elysiaVitePluginSsr({
            // ... vite config
            base: "/ssr", // no trailing slash
            root: path.resolve(import.meta.dir, "../"), // absolute path to parent-dir, dirs should exist: [parent-dir]/pages, [parent-dir]/renderer
            // pluginSsr: {
            //     // ... vite-plugin-ssr config
            // },
        }),
    ],
});
```
