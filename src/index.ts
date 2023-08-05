import {Elysia} from "elysia"
import {elysiaConnectDecorate} from "elysia-connect";
import {ViteConfig, elysiaViteConfig} from "elysia-vite";
import * as path from "path";
import {renderPage} from "vite-plugin-ssr/server";
import {ssr, UserConfig as ConfigVpsUserProvided} from "vite-plugin-ssr/plugin";
import {Connect} from "vite";
import {ServerResponse} from "node:http";

export type ElysiaVitePluginSsrConfig = ViteConfig & { pluginSsr?: ConfigVpsUserProvided }

export const elysiaVitePluginSsr = (config?: ElysiaVitePluginSsrConfig) => (app: Elysia) => app
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
                            ...(viteConfig as ElysiaVitePluginSsrConfig)?.pluginSsr,
                        })
                    ]),
                })
            ).middlewares;
            const handled = await context.elysiaConnect(viteDevMiddleware, context);
            if (handled) return handled;
        })
        .get("*", async (context) => {
            const viteConfig = await context.viteConfig();
            const handled = await context.elysiaConnect(
                createVitePluginSsrConnectMiddleware(viteConfig),
                context
            );
            if (handled) return handled;
            return "NOT_FOUND";
        }));

function createVitePluginSsrConnectMiddleware(config: ElysiaVitePluginSsrConfig) {
    return async function vitePluginSsrConnectMiddleware(req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) {
        let urlOriginal = req.originalUrl || req.url || '';

        if (urlOriginal.match(/(ts|tsx|js|jsx|css)$/)) {
            urlOriginal = (req.url || '');
        }

        const pathName = new URL(urlOriginal).pathname;

        // fix redirect by remove trailing splash
        if (pathName.endsWith('/')) {
            urlOriginal = urlOriginal.replace(/\/$/, '');
        }

        const pageContextInit = {
            urlOriginal,
        };

        const pageContext = await renderPage(pageContextInit)
        const {httpResponse} = pageContext

        if (!httpResponse) {
            return next()
        } else {
            const {body, statusCode, earlyHints} = httpResponse

            // @todo: does this work?
            if (res.writeEarlyHints) res.writeEarlyHints({link: earlyHints.map((e) => e.earlyHintLink)})

            httpResponse?.headers.forEach(([name, value]) => res.setHeader(name, value))
            res.statusCode = statusCode;

            // @todo: can we do HTTP streams with Elysia?
            // For HTTP streams use httpResponse.pipe() instead, see https://vite-plugin-ssr.com/stream
            res.end(body)
        }
    }
}


