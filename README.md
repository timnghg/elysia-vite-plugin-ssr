# elysia-vite-plugin-ssr ![Test](https://github.com/timnghg/elysia-vite-plugin-ssr/actions/workflows/main.yml/badge.svg)

Use [vite-plugin-ssr](https://vite-plugin-ssr.com/) with [Elysia](https://elysiajs.com/).

This plugin doesn't work right now. Let wait for [Support vite-plugin-ssr](https://github.com/oven-sh/bun/issues/3743)
issue resolved.

## 1. Install

`bun add elysia-vite-plugin-ssr`

## 2. Usage

```js
import {Elysia} from 'elysia';
import {elysiaVitePluginSsr} from 'elysia-vite-plugin-ssr';

const app = new Elysia({
    plugins: [
        elysiaVitePluginSsr({
            // vite & vite-plugin-ssr options
        }),
    ],
});
```