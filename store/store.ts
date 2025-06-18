import { create } from 'zustand'
import { User, Course } from '@/lib/types'

interface AppState {
  user: User | null
  setUser: (user: User) => void
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  updateCourse: (updatedCourse: Course) => void
  reset: () => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  courses: [],
  setCourses: (courses) => set({ courses }),
  addCourse: (course) =>
    set((state) => ({
      courses: [...state.courses.filter((c) => c.id !== course.id), course],
    })),
  updateCourse: (updatedCourse) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === updatedCourse.id ? updatedCourse : c
      ),
    })),
  reset: () => set({ user: null, courses: [] }),
}))
