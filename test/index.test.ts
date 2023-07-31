import {describe, expect, it} from "bun:test";
import {Elysia} from "elysia";
import {elysiaVitePluginSsr} from "../src/index.ts";
import * as path from "path";

describe("elysia-vite-plugin-ssr", () => {
    it("should work", async () => {
        const app = new Elysia()
            .use(elysiaVitePluginSsr({
                root: path.resolve(import.meta.dir, "../src")
            }))
            .get('/', () => 'Hello');

        const text = await app.handle(new Request(`http://localhost/`)).then(r => r.text());
        
        expect(text != "Hello" && text != "NOT_FOUND").toBeTrue();
    })
})