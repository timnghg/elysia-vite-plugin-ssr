import type {Config} from 'vike-react/types'
// import Layout from './layouts/LayoutDefault'
// import Head from './layouts/HeadDefault'
// import logoUrl from '../assets/logo.svg'
// import Head from "../layouts/HeadDefault"
import vikeReact from 'vike-react'

// Default configs (can be overridden by pages)
export default {
    // Layout,
    // Head,
    // <title>
    title: 'Asaleo',
    // <meta name="description">
    description: 'Demo showcasing Vike + React',
    // <link rel="icon" href="${favicon}" />
    // favicon: logoUrl,
    // ssr: true, // can be removed, this is the default anyway
    extends: vikeReact,
    passToClient: ["pageProps", "_baseServer", "urlPathname", "title", "description"]
} satisfies Config
