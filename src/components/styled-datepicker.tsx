import ReactDatePicker from 'react-datepicker'

type Props = {
    value: Date | undefined
    handleChange: (name: string, date: Date | null) => void
}

export default function StyledDatePicker({ value, handleChange }: Props) {
    return (
        <ReactDatePicker
            fixedHeight
            highlightDates={[{ 'react-datepicker__day--highlighted-custom-1': [new Date()] }]}
            selected={value}
            inline
            onChange={(date) => handleChange('dueDate', date)}
        />
    )
}
