import TabPageTemplate from '@/pages/tasks/_tabpages/TabPageTemplate'
import { AlertCircle } from 'lucide-react'
import React from 'react'

type Props = {}

export default function Important({}: Props) {
    return (
        <TabPageTemplate
            filterFn={(task) => task.starred === true}
            icon={<AlertCircle strokeWidth={1.5} size={25} />}
            title="Important"
            defaultTask={{
                name: '',
                description: '',
                dueDate: undefined,
                reminders: undefined,
                starred: true
            }}
        />
    )
}
