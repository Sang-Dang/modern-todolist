import Divider from '@/components/divider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { type BuiltInProviderType } from 'next-auth/providers'
import { signIn, type LiteralUnion } from 'next-auth/react'
import { FaGoogle } from 'react-icons/fa6'
import { SiAuth0 } from 'react-icons/si'

export default function Home() {
    const { toast } = useToast()

    function handleSignin(provider: LiteralUnion<BuiltInProviderType>) {
        signIn(provider, { callbackUrl: '/home' })
            .then((val) => {
                if (val?.ok) {
                    void toast({
                        title: 'Login successful',
                        description: 'Have a nice stay!'
                    })
                }
            })
            .catch((error) => {
                console.error(error)
                void toast({
                    title: 'Error',
                    description: 'Something happened on our side. Please try again later.'
                })
            })
    }

    return (
        <div id="login-page" className="bg-login-hero grid h-screen w-screen place-items-center bg-[url(/login-hero.jpg)] bg-cover">
            <div id="login-dialog" className="h-max w-11/12 max-w-[400px] rounded-lg bg-slate-100 p-7 md:w-6/12">
                <h1 className="text-2xl mb-3 font-bold">Sign in</h1>
                <Button variant="outline" className="mb-2 flex items-center gap-2 w-full" onClick={() => handleSignin('google')}>
                    <FaGoogle />
                    Sign in with Google
                </Button>
                <Button variant="outline" className="mb-2 flex items-center gap-2 w-full">
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
