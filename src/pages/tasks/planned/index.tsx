import withTabLayout from '@/components/layout/withTabLayout'
import TabPageTemplate from '@/modules/TabPageTemplate'
import { Calendar } from 'lucide-react'
import React from 'react'
import { api } from '@/utils/api'

const index = withTabLayout(() => {
    const query = api.task.all.useQuery({ fetchType: 'planned' })

    return (
        <TabPageTemplate
            icon={<Calendar strokeWidth={1.5} size={25} />}
            title="Planned"
            fetchData={query}
            defaultTask={{
                name: '',
                description: '',
                dueDate: new Date(),
                reminders: undefined,
                starred: false
            }}
        />
    )
})

export default index
