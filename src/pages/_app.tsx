import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { api } from '@/utils/api'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import Head from 'next/head'

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <>
            <Head>
                <title>Todolist By Sang Dang</title>
                <meta name="description" content="A todo list application for users" />
            </Head>
            <SessionProvider session={session}>
                <Component {...pageProps} />
                <Toaster />
            </SessionProvider>
        </>
    )
}

export default api.withTRPC(MyApp)
