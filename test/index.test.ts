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
                root: path.resolve(import.meta.dir, "../")
            }));

        const text = await app.handle(new Request(`http://localhost/ssr/`)).then(r => r.text());
        console.log('text', text);
        expect(text != "Hello" && text != "NOT_FOUND").toBeTrue();
    })
})