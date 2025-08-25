import { useState } from 'react'

// Define interfaces locally for now
interface ITask {
  _id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'complete' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate: string
  createdAt: string
}

interface UseTasksReturn {
  tasks: ITask[]
  addTask: (task: ITask) => void
  updateTask: (taskId: string, updates: Partial<ITask>) => void
  deleteTask: (taskId: string) => void
  getTaskById: (taskId: string) => ITask | undefined
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<ITask[]>([])

  const addTask = (task: ITask): void => {
    setTasks(prev => [...prev, task])
  }

  const updateTask = (taskId: string, updates: Partial<ITask>): void => {
    setTasks(prev => prev.map(task => 
      task._id === taskId ? { ...task, ...updates } : task
    ))
  }

  const deleteTask = (taskId: string): void => {
    setTasks(prev => prev.filter(task => task._id !== taskId))
  }

  const getTaskById = (taskId: string): ITask | undefined => {
    return tasks.find(task => task._id === taskId)
  }

  return { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    getTaskById 
  }
}
