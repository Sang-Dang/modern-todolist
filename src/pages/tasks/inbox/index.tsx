import withTabLayout from '@/components/layout/withTabLayout'
import TabPageTemplate from '@/modules/TabPageTemplate'
import { Inbox } from 'lucide-react'
import React from 'react'
import { api } from '@/utils/api'

type Props = {}

const index = withTabLayout((props: Props) => {
    const query = api.task.all.useQuery({ fetchType: 'all' })

    return (
        <TabPageTemplate
            icon={<Inbox strokeWidth={1.5} size={25} />}
            title="Inbox"
            fetchData={query}
            defaultTask={{
                name: '',
                description: '',
                dueDate: undefined,
                reminders: undefined,
                starred: false
            }}
        />
    )
})

export default index
