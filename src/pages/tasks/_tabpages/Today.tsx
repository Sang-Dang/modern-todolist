import CreateTaskBox from '@/components/features/CreateTaskBox'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { api } from '@/utils/api'
import { formatDate } from '@/utils/helper'
import { ArrowDownUp, CalendarDays, MoreHorizontal } from 'lucide-react'

type Props = {}

export default function Today({}: Props) {
    const query = api.task.all.useQuery()

    if (query.isLoading) return <div>Loading...</div>
    if (query.isError) return <div>Error</div>

    return (
        <article className="flex h-full flex-col">
            <header className="col-span-1 h-auto p-8">
                <div className="flex w-full justify-between">
                    <h2 className="mb-2 flex cursor-default select-none items-center gap-3 text-2xl">
                        <CalendarDays strokeWidth={1.5} size={25} />
                        Today
                        <MoreHorizontal size={20} strokeWidth={1.25} className="ml-2" />
                    </h2>
                    <Button variant="outline" className="flex items-center gap-1">
                        <ArrowDownUp size={20} strokeWidth={1.25} />
                        Sort
                    </Button>
                </div>
                <div className="text-xs text-slate-500">{formatDate(new Date())}</div>
            </header>
            <CreateTaskBox className="mb-6 px-8" />
            <ul className="grid h-max gap-2 overflow-y-auto px-8">
                {query.data?.map((task) => (
                    <li key={task.id} className="flex h-14 w-full items-center rounded-md bg-white px-6 py-3 shadow-md">
                        <Checkbox className="mr-4 h-5 w-5 rounded-full" />
                        <div className="flex flex-col">
                            <h5 className="text-lg">{task.name}</h5>
                        </div>
                    </li>
                ))}
            </ul>
        </article>
    )
}
