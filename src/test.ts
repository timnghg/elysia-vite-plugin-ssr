import {Elysia} from "elysia";
import {elysiaVitePluginSsr} from "./index.ts";

const app = new Elysia()
    .use(elysiaVitePluginSsr({}))
    .get('/', () => 'Hello')
    .listen(3000);

console.log(`Listening on http://${app.server?.hostname}:${app.server?.port}`);