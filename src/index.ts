import {Elysia} from "elysia"
import {elysiaConnectDecorate} from "elysia-connect";
import {ViteConfig, elysiaViteConfig} from "elysia-vite";
import * as path from "path";
import {renderPage} from "vite-plugin-ssr/server";
import {ssr} from "vite-plugin-ssr/plugin";
import {Connect} from "vite";
import {ServerResponse} from "node:http";

type ConfigVpsUserProvided = Parameters<typeof ssr>[0]

export const elysiaVitePluginSsr = (config?: ViteConfig & { pluginSsr?: ConfigVpsUserProvided }) => (app: Elysia) => app
    .use(elysiaViteConfig(config))
    .use(elysiaConnectDecorate())
    .group(config?.base || "", app => app
        .onBeforeHandle(async (context) => {
            if (!config?.ssr) return;
            const viteConfig = await context.viteConfig();
            const vite = require('vite')
            const viteDevMiddleware = (
                await vite.createServer({
                    root: viteConfig?.root || path.resolve(import.meta.dir, "./"),
                    ...viteConfig,
                    server: {middlewareMode: true, ...viteConfig?.server},
                    plugins: (viteConfig.plugins || []).concat([
                        ssr({
                            baseServer: viteConfig.base,
                            ...viteConfig?.pluginSsr,
                        })
                    ]),
                })
            ).middlewares;
            const handled = await context.elysiaConnect(viteDevMiddleware, context);
            if (handled) return handled;
        })
        .get("*", async (context) => {
            const handled = await context.elysiaConnect(vitePluginSsrConnectMiddleware, context);
            if (handled) return handled;
            return "NOT_FOUND";
        }));

async function vitePluginSsrConnectMiddleware(req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) {
    const pageContextInit = {
        urlOriginal: (req.originalUrl || `http://${req.headers.host}`).replace(/\/$/, ''),
    };
    const pageContext = await renderPage(pageContextInit)
    const {httpResponse} = pageContext
    if (!httpResponse) {
        return next()
    } else {
        const {body, statusCode, earlyHints} = httpResponse
        if (res.writeEarlyHints) res.writeEarlyHints({link: earlyHints.map((e) => e.earlyHintLink)})

        // @todo: do we have headers here?
        // httpResponse?.headers.forEach(([name, value]) => res.setHeader(name, value))

        res.statusCode = statusCode;

        // @todo: can we do HTTP streams with Elysia?
        // For HTTP streams use httpResponse.pipe() instead, see https://vite-plugin-ssr.com/stream
        res.end(body)
    }
}
