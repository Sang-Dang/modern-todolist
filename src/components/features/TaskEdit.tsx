import DateDropdownSelect from '@/components/features/DateDropdownSelect'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/utils/api'
import { getDateXAgo } from '@/utils/helper'
import { taskUpdateInputPartial } from '@/validation/task'
import { type Task } from '@prisma/client'
import { format, isEqual } from 'date-fns'
import { Bell, Calendar, File, Repeat, Star, Tag, Trash, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ZodError, type z } from 'zod'

// open and setOpen because I wanna use setOpen after deleting
type TaskEditProps = {
    task: Task
    open: boolean
    setOpen: (open: boolean) => void
}

export default function TaskEdit({ task: inputTask, open, setOpen }: TaskEditProps) {
    const [task, setTask] = useState<Task>(inputTask)
    const [hasTextChanged, setHasTextChanged] = useState(false)

    // #region API functions

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
    const { mutate: updateTask } = api.task.update.useMutation({
        onSuccess: () => {
            task.updatedAt = new Date() // set here for instant update
            setHasTextChanged(false)
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

    const handleUpdateTaskPartial = useCallback(
        (name: string, value: unknown) => {
            const updateParams = {
                id: task.id,
                [name]: value
            } as z.infer<typeof taskUpdateInputPartial>
            try {
                taskUpdateInputPartial.parse(updateParams)
                updateTask(updateParams)
            } catch (error) {
                if (error instanceof ZodError) {
                    const errors = error.issues
                    errors.forEach((error) => {
                        toast.error(error.message)
                        setTask((prev) => ({ ...prev, [error.path[0] as string]: 'Error...' }))
                    })
                }
            }
        },
        [task?.id, updateTask]
    )

    const handleUpdateTask = useCallback(
        (task: Task) => {
            try {
                taskUpdateInputPartial.parse(task)
                updateTask(task)
            } catch (error) {
                if (error instanceof ZodError) {
                    const errors = error.issues
                    errors.forEach((error) => {
                        toast.error(error.message)
                    })
                }
            }
        },
        [updateTask]
    )

    // #endregion

    // this function is used for both textarea and input, it DOES NOT update the task in the database
    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) {
        setTask((prev) => ({ ...prev, [e.target.name]: e.target.value }))
        setHasTextChanged(true)
    }

    // this function is used for the date dropdown, it DOES update the task in the database
    function handleChangeDate(name: string, date: Date | null) {
        setTask((prev) => ({ ...prev, [name]: date }))
        handleUpdateTaskPartial(name, date)
    }

    function handleTextBlur(e: React.FocusEvent<HTMLTextAreaElement> | React.FocusEvent<HTMLInputElement>) {
        if (hasTextChanged) {
            handleUpdateTaskPartial(e.target.name, e.target.value)
        }
    }

    useEffect(() => {
        setTask(inputTask)
    }, [inputTask, inputTask.id])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && hasTextChanged) {
                handleUpdateTask(task)
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleUpdateTask, hasTextChanged, task])

    if (task === undefined) return null

    return (
        <Sheet open={open} onOpenChange={() => setOpen(!open)}>
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
                            <input
                                className="ml-4 box-border resize-y overflow-visible bg-transparent font-[500] outline-none"
                                value={task.name}
                                onChange={handleChange}
                                onBlur={handleTextBlur}
                                name="name"
                            />
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
                        <DateDropdownSelect allowPast name="dueDate" label="Due date" value={task.dueDate!} handleChange={handleChangeDate}>
                            <Button className="flex h-11 w-full justify-start rounded-sm bg-white px-4 py-7 font-normal text-black transition-all hover:bg-slate-100">
                                <Calendar size={20} strokeWidth={1.75} />
                                <span className="ml-4">{task.dueDate ? 'Due ' + format(task.dueDate, 'EEE, MMMM d') : 'Add due date'}</span>
                            </Button>
                        </DateDropdownSelect>
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
                        value={task.description ?? ''}
                        onBlur={handleTextBlur}
                        name="description"
                        onChange={handleChange}
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
                        {isEqual(task.createdAt!, task.updatedAt!)
                            ? `Created ${getDateXAgo(task.createdAt!)}`
                            : `Last updated ${getDateXAgo(task.updatedAt!)}`}
                    </span>
                    <Button variant="ghost" onClick={handleDeleteTask}>
                        <Trash size={20} strokeWidth={1.5} />
                    </Button>
                </footer>
            </SheetContent>
        </Sheet>
    )
}
