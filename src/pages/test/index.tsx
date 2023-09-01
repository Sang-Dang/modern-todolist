import React from 'react'
import ReactDatePicker from 'react-datepicker'

type Props = {}

export default function Test({}: Props) {
    const [date, setDate] = React.useState<Date | null>(null)

    return (
        <div>
            <ReactDatePicker selected={date} onChange={setDate} />
        </div>
    )
}
