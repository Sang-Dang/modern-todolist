import Divider from '@/components/divider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BuiltInProviderType } from 'next-auth/providers'
import { signIn, type LiteralUnion, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaGoogle } from 'react-icons/fa6'
import { SiAuth0 } from 'react-icons/si'

export default function Home() {
    const { status } = useSession()
    const router = useRouter()

    if (status === 'loading') return <div>Loading...</div>
    if (status === 'authenticated') {
        void router.push('/tasks')
    }

    function handleSignin(provider: LiteralUnion<BuiltInProviderType>) {
        void signIn(provider, { callbackUrl: '/tasks' })
    }

    return (
        <div id="login-page" className="bg-login-hero grid h-screen w-screen place-items-center bg-[url(/login-hero.jpg)] bg-cover">
            <div id="login-dialog" className="h-max w-11/12 max-w-[400px] rounded-lg bg-slate-100 p-7 md:w-6/12">
                <h1 className="mb-3 text-2xl font-bold">Sign in</h1>
                <Button variant="outline" className="mb-2 flex w-full items-center gap-2" onClick={() => handleSignin('google')}>
                    <FaGoogle />
                    Sign in with Google
                </Button>
                <Button variant="outline" className="mb-2 flex w-full items-center gap-2">
                    <SiAuth0 />
                    Sign in with Auth0
                </Button>
                <Divider text="Or sign in with email" className="w-[500px]" lineClassName="h-[1px]" />
                <Input placeholder="Email" className="mb-2" />
                <Button variant="default">Sign in</Button>
            </div>
        </div>
    )
}
