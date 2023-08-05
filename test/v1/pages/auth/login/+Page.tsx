import {Link} from "../../../components/Link.tsx";

export default Page

import React from 'react'

function Page() {
    return (
        <>
            <h1>Login</h1>
            <form action="">
                <input type="text" name="email" id="email" placeholder={"Email"}/>
                <input type="password" name="password" id="password" placeholder={"Password"}/>
            </form>
            <Link href={"/auth/register"}>Register</Link>
        </>
    )
}
