import React, {HTMLProps} from "react";
import {usePageContext} from "../renderer/_default.page.client.tsx";

export function Link(props?: HTMLProps<HTMLLinkElement>) {
    const baseServer = usePageContext()?._baseServer;
    return <a {...props} href={props?.href ? `${baseServer}${props.href}` : props?.href}/>
}