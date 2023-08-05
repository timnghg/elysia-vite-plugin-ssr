import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it} from "bun:test";
import {Elysia} from "elysia";
import {elysiaVitePluginSsr} from "../src/index";
import * as path from "path";
import react from "@vitejs/plugin-react"

describe("elysia-vite-plugin-ssr :: current", () => {
    let app: Elysia<any>;

    beforeAll(async () => {
        return new Promise((resolve) => {
            app = new Elysia()
                .use(elysiaVitePluginSsr({
                    pluginSsr: {},
                    base: "/ssr-v1",
                    root: path.resolve(import.meta.dir, "./v1"),
                    plugins: [react()],
                    onPluginSsrReady() {
                        console.log("V1 STARTED")
                        resolve(undefined);
                    }
                }))
                .listen(process.env.PORT || process.env.APP_PORT || 3000);
        })
    });

    afterAll(() => {
        return app.stop();
    })

    it("should serve /ssr-v1/spa", async () => {
        const resp = app.handle(new Request(`http://localhost/ssr-v1/spa`));
        const text = await resp.then(r => r.text());
        const status = await resp.then(r => r.status);

        // debug
        if (!text || text === "NOT_FOUND") {
            console.log(text);
        }
        expect(status).toBe(200);
        expect(text).not.toBe('NOT_FOUND')
        expect(text.includes("This page is rendered only in the browser")).toBeTrue();
    })

    it("should serve /ssr-v1/auth/register", async () => {
        const resp = app.handle(new Request(`http://localhost/ssr-v1/auth/register`));
        const text = await resp.then(r => r.text());
        const status = await resp.then(r => r.status);
        expect(status).toBe(200);
        expect(text).not.toBe('NOT_FOUND')
        expect(text.includes("<h1>Register</h1>")).toBeTrue();
    });
})