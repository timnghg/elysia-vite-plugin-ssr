import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { elysiaVitePluginSsr } from "../src/index";
import * as path from "path";
import react from "@vitejs/plugin-react";
import type { ViteDevServer } from "vite";

describe("elysia-vite-plugin-ssr :: v1", () => {
    let app: Elysia<any>;
    let viteDevServer: ViteDevServer;

    beforeAll(async () => {
        await new Promise((resolve) => {
            app = new Elysia().use(
                elysiaVitePluginSsr({
                    pluginSsr: {},
                    base: "/ssr-v1",
                    root: path.resolve(import.meta.dir, "./v1"),
                    plugins: [react()],
                    onPluginSsrReady(_devServer) {
                        viteDevServer = _devServer;
                        resolve(undefined);
                        console.log("v1 ready");
                    },
                })
            );
        });
    });

    afterAll(async () => {
        if (viteDevServer) {
            await app.server?.stop(true);
            await viteDevServer.close();
            console.log("v1 stopped");
        }
    });

    it("should serve /ssr-v1/spa", async () => {
        const resp = app.handle(new Request(`http://localhost/ssr-v1/spa`));
        const text = await resp.then((r) => r.text());
        const status = await resp.then((r) => r.status);
        // debug
        if (!text || text === "NOT_FOUND") {
            console.log(text);
        }
        expect(status).toBe(200);
        expect(text).not.toBe("NOT_FOUND");
        expect(
            text.includes("This page is rendered only in the browser")
        ).toBeTrue();
    });

    it("should serve /ssr-v1/auth/register", async () => {
        const resp = app.handle(
            new Request(`http://localhost/ssr-v1/auth/register`)
        );
        const text = await resp.then((r) => r.text());
        const status = await resp.then((r) => r.status);
        expect(status).toBe(200);
        expect(text).not.toBe("NOT_FOUND");
        expect(text.includes("<h1>Register</h1>")).toBeTrue();
    });
});
