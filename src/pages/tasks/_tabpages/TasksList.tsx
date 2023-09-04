import TabPageTemplate from '@/pages/tasks/_tabpages/TabPageTemplate'
import { Inbox } from 'lucide-react'
import React from 'react'

type Props = {}

export default function TasksList({}: Props) {
    return (
        <TabPageTemplate
            filterFn={() => true}
            icon={<Inbox strokeWidth={1.5} size={25} />}
            title="Inbox"
            defaultTask={{
                name: '',
                description: '',
                dueDate: undefined,
                reminders: undefined,
                starred: false
            }}
        />
    )
}
