import { type Task } from '@prisma/client'
import { create } from 'zustand'

export const uesTaskStore = create<Task[]>(() => [])
