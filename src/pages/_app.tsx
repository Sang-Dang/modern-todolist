import '@/styles/globals.css'
import { api } from '@/utils/api'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

const MyApp: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps } }) => {
    return (
        <>
            <Head>
                <title>Todolist By Sang Dang</title>
                <meta name="description" content="A todo list application for users" />
                <link rel="icon" type="image/x-icon" href="/favicon.ico" />
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <SessionProvider session={session}>
                <Component {...pageProps} />
                <Toaster position="bottom-center" />
            </SessionProvider>
        </>
    )
}

export default api.withTRPC(MyApp)
