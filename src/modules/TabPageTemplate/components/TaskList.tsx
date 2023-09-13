import withTaskEditContext, { useTaskEdit } from '@/context/TaskEditContext'
import TaskCard from '@/modules/TabPageTemplate/components/TaskCard'
import { type Task } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'

const MotionTaskCard = motion(TaskCard)

type Props = {
    tasks: Task[]
}

const TaskList = withTaskEditContext(({ tasks }: Props) => {
    const { handleEditTask } = useTaskEdit()

    return (
        <ul className="flex flex-col gap-2 py-5">
            <AnimatePresence>
                {tasks.map((task: Task) => (
                    <MotionTaskCard key={task.id} initial={{ y: -20 }} animate={{ y: 0 }} task={task} onClick={() => handleEditTask(task)} />
                ))}
            </AnimatePresence>
        </ul>
    )
})

export default TaskList
