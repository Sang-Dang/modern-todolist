import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { api } from '@/utils/api'
import { getDateXAgo } from '@/utils/helper'
import { taskDeleteInput } from '@/validation/task'
import { type Task } from '@prisma/client'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// open and setOpen because I wanna use setOpen after deleting
type TaskEditProps = {
    task: Task
    open: boolean
    setOpen: (open: boolean) => void
}

export default function TaskEdit({ task: inputTask, open, setOpen }: TaskEditProps) {
    const [isFocusedName, setIsFocusedName] = useState<boolean>(false)
    const [task, setTask] = useState<Task>(inputTask)

    useEffect(() => {
        setTask(inputTask)
    }, [inputTask])

    const trpc = api.useContext()
    const { mutate: completeTask } = api.task.toggleComplete.useMutation({
        onSuccess: () => {
            toast.success('Task updated')
            setTask((prev) => ({ ...prev, completed: !prev.completed }))
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })
    const { mutate: deleteTask } = api.task.delete.useMutation({
        onSuccess: () => {
            toast.success('Task deleted')
            setOpen(false)
        },
        onSettled: () => {
            void trpc.task.invalidate()
        }
    })

    function toggleCompleteTask(completed: boolean) {
        completeTask({ id: task.id, completed })
    }

    function handleDeleteTask() {
        deleteTask({ id: task.id })
    }

    function handleSheetOpen() {
        setOpen(!open)
    }

    if (task === undefined) return null

    return (
        <Sheet open={open} onOpenChange={handleSheetOpen}>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>
                        <Checkbox
                            className="rounded-full border-2 border-blue-800"
                            checkIconContainerClassName="bg-blue-800 rounded-full outline-none"
                            defaultCheckIconClassName="text-white w-full h-full"
                            checked={task.completed}
                            onClick={() => void toggleCompleteTask(!task.completed)}
                        />
                        <span
                            contentEditable
                            className="ml-2 outline-none"
                            onFocus={() => setIsFocusedName(true)}
                            onBlur={() => setIsFocusedName(false)}
                        >
                            {task.name}
                        </span>
                    </SheetTitle>
                    <SheetDescription>Edit your task!</SheetDescription>
                </SheetHeader>
                <main className="flex-grow"></main>
                <footer className="flex items-center justify-between">
                    <span>
                        {task.updatedAt === task.createdAt
                            ? `Last updated ${getDateXAgo(task.updatedAt!)}`
                            : `Created ${getDateXAgo(task.createdAt!)}`}
                    </span>
                    <Button variant="ghost" onClick={handleDeleteTask}>
                        <Trash size={20} strokeWidth={1.5} />
                    </Button>
                </footer>
            </SheetContent>
        </Sheet>
    )
}
