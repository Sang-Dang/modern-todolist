import TabPageTemplate from '@/modules/TabPageTemplate'
import withTabLayout from '@/components/layout/withTabLayout'
import { api } from '@/utils/api'
import { CalendarDays } from 'lucide-react'

const index = withTabLayout(() => {
    const query = api.task.all.useQuery({ fetchType: 'today' })

    return (
        <TabPageTemplate
            icon={<CalendarDays strokeWidth={1.5} size={25} />}
            title="Today"
            fetchData={query}
            defaultTask={{
                name: '',
                description: '',
                dueDate: new Date(),
                reminders: undefined
            }}
        />
    )
})

export default index
