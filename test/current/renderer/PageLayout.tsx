import React from 'react'
import './PageLayout.css'
import {usePageContext} from "./_default.page.client.tsx";
import {Link} from "../components/link.tsx";

export {PageLayout}

function PageLayout({children}) {
    const pageContext = usePageContext();
    return (
        <React.StrictMode>
            <Layout>
                <Sidebar>
                    <Link href={'/'} className={"navitem"}>
                        Home
                    </Link>
                    <Link href={'/about'} className={"navitem"}>
                        About
                    </Link>
                </Sidebar>
                <Content>{children}</Content>
            </Layout>
        </React.StrictMode>
    )
}

function Layout({children}) {
    return (
        <div
            style={{
                display: 'flex',
                maxWidth: 900,
                margin: 'auto'
            }}
        >
            {children}
        </div>
    )
}

function Sidebar({children}) {
    return (
        <div
            style={{
                padding: 20,
                paddingTop: 42,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                lineHeight: '1.8em'
            }}
        >
            {children}
        </div>
    )
}

function Content({children}) {
    return (
        <div
            style={{
                padding: 20,
                paddingBottom: 50,
                borderLeft: '2px solid #eee',
                minHeight: '100vh'
            }}
        >
            {children}
        </div>
    )
}