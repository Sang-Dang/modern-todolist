/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/utils/api'
import { getDateXAgo } from '@/utils/helper'
import { type Task } from '@prisma/client'
import { Bell, Calendar, File, Repeat, Star, Tag, Trash, X } from 'lucide-react'
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
            <SheetContent className="flex flex-col gap-3 bg-[#faf9f8]" showCloseButton={false}>
                <SheetHeader>
                    <SheetTitle className="flex w-full gap-2">
                        <div className="flex w-10/12 items-center rounded-sm bg-white px-5 py-3 transition-all hover:bg-slate-100">
                            <Checkbox
                                className="rounded-full border-2 border-blue-800"
                                checkIconContainerClassName="bg-blue-800 rounded-full outline-none"
                                defaultCheckIconClassName="text-white w-full h-full"
                                checked={task.completed}
                                autoFocus={false}
                                onClick={() => void toggleCompleteTask(!task.completed)}
                            />
                            <span
                                contentEditable
                                className="ml-4 box-border overflow-visible font-[500] outline-none"
                                onFocus={() => setIsFocusedName(true)}
                                onBlur={() => setIsFocusedName(false)}
                            >
                                {task.name}
                            </span>
                        </div>
                        <Button className="h-full w-2/12 rounded-sm bg-white p-0 text-black transition-all hover:bg-slate-100">
                            <Star />
                        </Button>
                    </SheetTitle>
                </SheetHeader>
                <main className="flex flex-grow flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <Button className="flex h-11 w-full justify-start rounded-sm bg-white px-4 py-7 font-normal text-black transition-all hover:bg-slate-100">
                            <Bell size={20} strokeWidth={1.75} />
                            <span className="ml-4">Add reminder</span>
                        </Button>
                        <Button className="flex h-11 w-full justify-start rounded-sm bg-white px-4 py-7 font-normal text-black transition-all hover:bg-slate-100">
                            <Calendar size={20} strokeWidth={1.75} />
                            <span className="ml-4">Due date</span>
                        </Button>
                        <Button className="flex h-11 w-full justify-start rounded-sm bg-white px-4 py-7 font-normal text-black transition-all hover:bg-slate-100">
                            <Repeat size={20} strokeWidth={1.75} />
                            <span className="ml-4">Repeat</span>
                        </Button>
                    </div>
                    <Button className="flex h-11 w-full justify-start rounded-sm bg-white px-4 py-7 font-normal text-black transition-all hover:bg-slate-100">
                        <Tag size={20} strokeWidth={1.75} />
                        <span className="ml-4">Pick a tag</span>
                    </Button>
                    <Button className="flex h-11 w-full justify-start rounded-sm bg-white px-4 py-7 font-normal text-black transition-all hover:bg-slate-100">
                        <File size={20} strokeWidth={1.75} />
                        <span className="ml-4">Add File</span>
                    </Button>
                    <Textarea
                        className="resize-none border-0 outline-none ring-0 focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0"
                        rows={5}
                        placeholder="Description..."
                    />
                </main>
                <Separator />
                <footer className="flex items-center justify-between">
                    <SheetClose>
                        <Button variant="ghost">
                            <X size={20} strokeWidth={1.5} />
                        </Button>
                    </SheetClose>
                    <span className="text-sm text-slate-500">
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
