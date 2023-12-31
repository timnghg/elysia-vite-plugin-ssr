import {Elysia} from "elysia";
import {elysiaConnectDecorate} from "elysia-connect";
import {ViteConfig, getViteConfig} from "elysia-vite";
import * as path from "path";
import {renderPage} from "vite-plugin-ssr/server";
import {
    ssr,
    UserConfig as ConfigVpsUserProvided,
} from "vite-plugin-ssr/plugin";
import type {Connect, ViteDevServer} from "vite";
import {ServerResponse} from "node:http";

export type ElysiaVitePluginSsrConfig = ViteConfig & {
    pluginSsr?: ConfigVpsUserProvided;
    onPluginSsrReady?(viteServer: ViteDevServer): void;
};

const log: (...args: any[]) => void = !!process.env?.DEBUG
    ? console.log.bind(console, "[elysia-vite-plugin-ssr]")
    : () => {
    };

export const elysiaVitePluginSsr =
    (config?: ElysiaVitePluginSsrConfig) => async (app: Elysia) => {
        const _app = app.use(elysiaConnectDecorate());
        const {pluginSsr, onPluginSsrReady, ...resolvedConfig} =
        (await getViteConfig(config)) || {};
        if (!pluginSsr) return _app;
        log("resolvedConfig", resolvedConfig);

        const vite = require("vite");

        const viteServer: ViteDevServer = await vite.createServer({
            root: resolvedConfig?.root || path.resolve(import.meta.dir, "./"),
            ssr: true,
            ...resolvedConfig,
            server: {middlewareMode: true, ...resolvedConfig?.server},
            plugins: (resolvedConfig?.plugins || []).concat([
                ssr({
                    baseServer: resolvedConfig?.base,
                    ...pluginSsr,
                }),
            ]),
        });

        const viteDevMiddleware = viteServer.middlewares;
        log("viteDevMiddleware", !!viteDevMiddleware);

        if (onPluginSsrReady) {
            await onPluginSsrReady?.(viteServer);
        }

        return _app
            .on("stop", async () => {
                log("onStop :: reached");
                return await viteServer.close();
            })
            .group(config?.base || "", (app) =>
                app
                    .onBeforeHandle(async (context) => {
                        log("onBeforeHandle :: reached", context.request.url);
                        const handled = await context.elysiaConnect(
                            viteDevMiddleware,
                            context
                        );
                        log("onBeforeHandle :: handle?", !!handled);
                        if (handled) return handled;
                    })
                    .get("*", async (context) => {
                        const handled = await context.elysiaConnect(
                            createVitePluginSsrConnectMiddleware(
                                resolvedConfig
                            ),
                            context
                        );
                        if (handled) return handled;
                        return "NOT_FOUND";
                    })
            );
    };

function createVitePluginSsrConnectMiddleware(
    config?: ElysiaVitePluginSsrConfig
) {
    return async function vitePluginSsrConnectMiddleware(
        req: Connect.IncomingMessage,
        res: ServerResponse,
        next: Connect.NextFunction
    ) {
        let urlOriginal = req.originalUrl || req.url || "";
        urlOriginal = urlOriginal.match(/^(https?:)/)
            ? new URL(urlOriginal).pathname
            : urlOriginal;

        if (urlOriginal.match(/(ts|tsx|js|jsx|css)$/)) {
            urlOriginal = req.url || "";
        }

        // fix redirect by remove trailing splash
        if (urlOriginal.endsWith("/")) {
            urlOriginal = urlOriginal.replace(/\/$/, "");
        }

        const pageContextInit = {
            urlOriginal,
        };
        log("pageContextInit", pageContextInit);

        const pageContext = await renderPage(pageContextInit);
        const {httpResponse} = pageContext;

        if (!httpResponse) {
            return next();
        } else {
            const {body, statusCode, earlyHints} = httpResponse;

            // @todo: does this work?
            if (res.writeEarlyHints)
                res.writeEarlyHints({
                    link: earlyHints.map((e) => e.earlyHintLink),
                });

            httpResponse?.headers.forEach(([name, value]) =>
                res.setHeader(name, value)
            );
            res.statusCode = statusCode;

            // @todo: can we do HTTP streams with Elysia?
            // For HTTP streams use httpResponse.pipe() instead, see https://vite-plugin-ssr.com/stream
            res.end(body);
        }
    };
}
