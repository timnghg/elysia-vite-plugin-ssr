import React from 'react'
import {renderToString} from "react-dom/server";
import {escapeInject, dangerouslySkipEscape} from 'vite-plugin-ssr/server'
import {PageLayout} from './PageLayout.tsx'
import {PageContext} from "./PageContext.tsx";

export {render}
export {passToClient}

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps', '_baseServer']

async function render(pageContext: any) {
    const {Page, pageProps} = pageContext

    const html = renderToString(
        <PageContext.Provider value={pageContext}>
            <PageLayout>
                <Page {...pageProps} />
            </PageLayout>
        </PageContext.Provider>
    )

    return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`
}