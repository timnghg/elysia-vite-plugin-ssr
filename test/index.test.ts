import {describe, expect, it} from "bun:test";
import {Elysia} from "elysia";
import {elysiaVitePluginSsr} from "../src/index";
import * as path from "path";

describe("elysia-vite-plugin-ssr", () => {
    const app = new Elysia()
        .use(elysiaVitePluginSsr({
            ssr: {},
            base: "/ssr",
            root: path.resolve(import.meta.dir, "../"),
        }));

    it("should server /ssr/", async () => {
        const resp = app.handle(new Request(`http://localhost/ssr/`));
        const text = await resp.then(r => r.text());
        const status = await resp.then(r => r.status);

        // debug
        if (!text || text === "NOT_FOUND") {
            console.log(text);
        }
        expect(status).toBe(200);
        expect(text).not.toBe('NOT_FOUND')

        // vite-plugin-ssr
        expect(text.includes("vite-plugin-ssr_pageContext")).toBeTrue();

        // navigation
        expect(text.includes("Home")).toBeTrue();
        expect(text.includes("About")).toBeTrue();
    })

    it("should serve /ssr/about", async () => {
        const resp = app.handle(new Request(`http://localhost/ssr/about`));
        const text = await resp.then(r => r.text());
        const status = await resp.then(r => r.status);
        expect(status).toBe(200);
        expect(text).not.toBe('NOT_FOUND')
        expect(text.includes("<h1>About</h1>")).toBeTrue();
    });
})