import React from 'react'
import {hydrateRoot, createRoot, Root} from 'react-dom/client'
import {PageLayout} from './PageLayout.tsx'
import {PageContext, TPageContext} from "./PageContext.tsx";

export {render}

export const clientRouting = true;

export const prefetchStaticAssets = 'viewport';

export const usePageContext = () => React.useContext(PageContext);

let root: Root;

async function render(pageContext: TPageContext) {
    const {Page, pageProps} = pageContext
    const rootElement = document.getElementById('page-view');
    const element = (
        <PageContext.Provider value={pageContext}>
            <PageLayout>
                <Page {...pageProps} />
            </PageLayout>
        </PageContext.Provider>
    );

    if (root) {
        return root.render(element);
    }

    if (pageContext.isHydration) {
        root = hydrateRoot(rootElement, element)
    } else {
        root = createRoot(rootElement);
        root.render(element);
    }
}