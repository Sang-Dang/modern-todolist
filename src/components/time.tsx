import { format } from 'date-fns'
import React, { useEffect } from 'react'

type Props = {
    dateProps: string
}

export default function Time({ dateProps }: Props) {
    console.log('render Time')

    const [time, setTime] = React.useState<Date>(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    })

    return <span>{format(time, dateProps)}</span>
}
