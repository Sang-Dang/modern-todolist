import TabPageTemplate from '@/pages/tasks/_tabpages/TabPageTemplate'
import { isToday } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import React from 'react'

type Props = {}

export default function Today({}: Props) {
    return (
        <TabPageTemplate
            filterFn={(task) => task.dueDate !== null && isToday(task.dueDate)}
            icon={<CalendarDays strokeWidth={1.5} size={25} />}
            title="Today"
            defaultTask={{
                name: '',
                description: '',
                dueDate: new Date(),
                reminders: undefined
            }}
        />
    )
}
