import { useRouter } from 'next/router'
import { useEffect } from 'react'

type Props = {}

export default function Index({}: Props) {
    const router = useRouter()
    useEffect(() => {
        void router.replace('/tasks/today')
    }, [router])
}
