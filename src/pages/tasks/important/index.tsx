import withTabLayout from '@/components/layout/withTabLayout'
import TabPageTemplate from '@/modules/TabPageTemplate'
import { AlertCircle } from 'lucide-react'
import { api } from '@/utils/api'

const index = withTabLayout(() => {
    const query = api.task.all.useQuery({ fetchType: 'starred' })

    return (
        <TabPageTemplate
            icon={<AlertCircle strokeWidth={1.5} size={25} />}
            title="Important"
            fetchData={query}
            defaultTask={{
                name: '',
                description: '',
                dueDate: undefined,
                reminders: undefined,
                starred: true
            }}
        />
    )
})

export default index
