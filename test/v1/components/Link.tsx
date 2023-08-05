export {Link}

import {usePageContext} from 'vike-react/usePageContext'
import React from 'react'

function Link({href, children}: { href: string; children: string }) {
    const pageContext = usePageContext()
    console.log('pageContext', pageContext)
    const {urlPathname} = pageContext
    const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href)
    return (
        <a href={(pageContext._baseServer || "") + href} className={isActive ? 'is-active' : undefined}>
            {children}
        </a>
    )
}
