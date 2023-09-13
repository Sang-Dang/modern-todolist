import { type Task } from '@prisma/client'
import dynamic from 'next/dynamic'
import { createContext, useState, type ReactNode, type ComponentType, useContext } from 'react'
const TaskEdit = dynamic(() => import('@/modules/TabPageTemplate/components/TaskEdit'), { ssr: false })

type Props = {
    children: ReactNode
}

const TaskEditContext = createContext({
    handleEditTask: (_task: Task) => {
        // do nothing
    }
})

export function TaskEditContextProvider({ children }: Props) {
    const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined)
    const [open, setOpen] = useState<boolean>(false)

    function handleEditTask(task: Task) {
        setCurrentTask(task)
        setOpen(true)
    }

    return (
        <TaskEditContext.Provider value={{ handleEditTask }}>
            {children}
            {currentTask && <TaskEdit task={currentTask} open={open} setOpen={() => setOpen((prev) => !prev)} />}
        </TaskEditContext.Provider>
    )
}

export default function withTaskEditContext<
    T extends
        | JSX.IntrinsicAttributes
        | {
              tasks: Task[]
          }
>(Component: ComponentType<T>) {
    return function WithTaskEditContext(props: T) {
        return (
            <TaskEditContextProvider>
                <Component {...props} />
            </TaskEditContextProvider>
        )
    }
}

export function useTaskEdit() {
    const context = useContext(TaskEditContext)

    if (context === undefined) {
        throw new Error('useTaskEdit must be used within a TaskEditContextProvider')
    }

    return context
}
