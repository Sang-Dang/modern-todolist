import { api } from '@/utils/api'
import { taskDeleteInput, taskInput, taskUpdateInputPartial } from '@/validation/task'
import { type Task } from '@prisma/client'
import { type z } from 'zod'
import { create } from 'zustand'

type TaskStoreState = {
    tasks: Task[]
    addTask: (task: z.infer<typeof taskInput>) => boolean
    deleteTask: (id: string) => void
    updateTask: (id: string, name: string, value: unknown) => void
    fetchTasks: () => void
}

const trpc = api.useContext()

const { mutate: createTask } = api.task.create.useMutation({
    onSettled: () => {
        void trpc.task.all.invalidate()
    }
})
const { mutate: deleteTask } = api.task.delete.useMutation({})
const { mutate: updateTask } = api.task.update.useMutation({})

export const uesTaskStore = create<TaskStoreState>((set) => ({
    tasks: [],
    addTask(task) {
        if (!taskInput.safeParse(task).success) {
            return false
        }

        createTask(task)
        return true
    },
    deleteTask(id) {
        const object = { id }
        if (!taskDeleteInput.safeParse(object).success) {
            return false
        }

        deleteTask(object)
        set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }))
    },
    updateTask(id, name, value) {
        const object = {
            id,
            [name]: value
        }
        if (!taskUpdateInputPartial.safeParse(object).success) {
            return false
        }

        updateTask(object)
        set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? { ...task, [name]: value } : task))
        }))
    },
    fetchTasks() {
        set(() => {
            const data = api.task.all.useQuery()
            return { tasks: data.data }
        })
    }
}))
