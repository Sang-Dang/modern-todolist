import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/helper'
import ReactDatePicker from 'react-datepicker'

type DateDropdownSelectProps = {
    name: string
    label: string
    value: Date | undefined | null
    handleChange: (name: string, date: Date | null) => void
    className?: string
    allowTime?: boolean
    allowPast?: boolean
    children: React.ReactNode
}

export default function DateDropdownSelect({
    name,
    label,
    value,
    handleChange,
    allowTime = false,
    allowPast = true,
    className,
    children
}: DateDropdownSelectProps) {
    function handleToday() {
        handleChange(name, new Date())
    }
    function handleTomorrow() {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        handleChange(name, tomorrow)
    }
    function handleNextWeek() {
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        handleChange(name, nextWeek)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn('flex items-center gap-2 p-2 text-xs', value && 'bg-white', className)}>
                    {children}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>{label}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToday}>Today</DropdownMenuItem>
                <DropdownMenuItem onClick={handleTomorrow}>Tomorrow</DropdownMenuItem>
                <DropdownMenuItem onClick={handleNextWeek}>Next week</DropdownMenuItem>
                <DropdownMenuSeparator />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex h-8 w-full justify-start px-2 font-normal" variant="ghost">
                            Custom
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent align="center" side="right" sideOffset={10} className="h-min w-min">
                        <ReactDatePicker
                            fixedHeight
                            highlightDates={[{ 'react-datepicker__day--highlighted-custom-1': [new Date()] }]}
                            selected={value}
                            inline
                            onChange={(date) => handleChange(name, date)}
                            showTimeInput={allowTime}
                            timeInputLabel="Time:"
                            minDate={allowPast ? undefined : new Date()}
                        />
                    </PopoverContent>
                </Popover>
                {value && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleChange(name, null)}>
                            <span className="text-red-500">Remove</span>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
