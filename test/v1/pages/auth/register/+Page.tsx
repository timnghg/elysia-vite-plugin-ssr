import {Link} from "../../../components/Link.tsx";

export default Page

import React from 'react'

function Page() {
    return (
        <>
            <h1>Register</h1>
            <form action="">
                <input type="text" name="name" id="name" placeholder={"Name"}/>
                <input type="text" name="email" id="email" placeholder={"Email"}/>
                <input type="password" name="password" id="password" placeholder={"Password"}/>
            </form>
            <Link href={"/auth/login"}>Login</Link>
        </>
    )
}
