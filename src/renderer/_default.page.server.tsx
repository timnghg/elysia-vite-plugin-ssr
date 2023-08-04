import React from 'react'
import {renderToString} from "react-dom/server";
import {escapeInject, dangerouslySkipEscape} from 'vite-plugin-ssr/server'
import {PageLayout} from './PageLayout'

export {render}
export {passToClient}

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext: any) {
    const {Page, pageProps} = pageContext
    const html = renderToString(
        <PageLayout>
            <Page {...pageProps} />
        </PageLayout>
    )

    return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(html)}</div>
      </body>
    </html>`
}