import Link from "next/link"

export default function emailConfirmation(){
    return(
        <>
            <h1>You have been sent an account confirmation email</h1>
            <Link href="/unauthenticated/login">login page</Link>
        </>
    )
}