import {describe, expect, it} from "bun:test";
import {Elysia} from "elysia";
import {elysiaVitePluginSsr} from "../src/index.ts";
import * as path from "path";

describe("elysia-vite-plugin-ssr", () => {
    it("should work", async () => {
        const app = new Elysia()
            .use(elysiaVitePluginSsr({
                ssr: {},
                base: "/ssr",
                root: path.resolve(import.meta.dir, "../"),
            }));

        const text = await app.handle(new Request(`http://localhost/ssr/`)).then(r => r.text());
        if (!text || text === "NOT_FOUND") {
            console.log(text);
        }
        expect(text != "NOT_FOUND").toBeTrue();
        expect(text.includes("vite-plugin-ssr_pageContext")).toBeTrue();
        expect(text.includes("Home")).toBeTrue();
        expect(text.includes("About")).toBeTrue();
    })
})