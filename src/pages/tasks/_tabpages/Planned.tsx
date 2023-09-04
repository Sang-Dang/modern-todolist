import TabPageTemplate from '@/pages/tasks/_tabpages/TabPageTemplate'
import { Calendar } from 'lucide-react'
import React from 'react'

type Props = {}

export default function Planned({}: Props) {
    return (
        <TabPageTemplate
            filterFn={(task) => task.dueDate !== null}
            icon={<Calendar strokeWidth={1.5} size={25} />}
            title="Planned"
            defaultTask={{
                name: '',
                description: '',
                dueDate: new Date(),
                reminders: undefined,
                starred: false
            }}
        />
    )
}
