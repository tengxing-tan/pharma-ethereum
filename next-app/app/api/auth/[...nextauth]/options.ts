import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail, getUserByEthers } from "./authorize";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "stakeholder-login",
            name: "Stakeholder Account",
            async authorize(credentials): Promise<User | null> {
                // get metamask account from ethreum
                const userOnEth = await getUserByEthers(credentials?.metaMaskAccount ?? '');

                // get user from database
                const user = await getUserByEmail(credentials?.email ?? '');

                // console.log(`🥚 Checking user input: MetaMask account (${credentials?.metaMaskAccount}), email (${credentials?.email})
                //     MetaMask account is valid: ${userOnEth}
                //     User is: ${JSON.stringify(user)}`)
                return (userOnEth && user && userOnEth.email === user.email)
                    ? user
                    : null;
            },
            credentials: {
                email: { label: "Email", type: "text", placeholder: "" },
                metaMaskAccount: { label: "MetaMask Account", type: "text", placeholder: "" },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, credentials }) {
            // console.log(`🥚 NextAuth: signIn successful with ${user.id}, ${user.email}
            //     The user object is: ${JSON.stringify(user)}`)
            // console.log(`🥚 See other parameter:
            //     accounts    : ${JSON.stringify(account)}
            //     credentials : ${JSON.stringify(credentials)}`)
            return true
            // if invalid credential, GET ?error=CredentialsSignin
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token and user id from a provider.

            return session
        }
    },
    pages: {
        signIn: "/signin",
        signOut: "/trace"
    }
}