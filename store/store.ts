import { create } from 'zustand'
import { User, Course, Quiz } from '@/lib/types'

interface AppState {
  user: User | null
  setUser: (user: User) => void
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  updateCourse: (updatedCourse: Course) => void
  markQuizAsCompleted: (courseId: string, quizId: string) => void
  updateQuizInCourse: (courseId: string, updatedQuiz: Quiz) => void
  reset: () => void
}

export const useStore = create<AppState>(set => ({
  user: null,
  setUser: user => set({ user, courses: user?.courses || [] }),
  courses: [],
  setCourses: courses => set({ courses }),
  addCourse: course =>
    set(state => ({
      courses: [...state.courses.filter(c => c.id !== course.id), course]
    })),
  updateCourse: updatedCourse =>
    set(state => ({
      courses: state.courses.map(c =>
        c.id === updatedCourse.id ? updatedCourse : c
      )
    })),
  markQuizAsCompleted: (courseId, quizId) =>
    set(state => ({
      courses: state.courses.map(course => {
        if (course.id !== courseId) return course
        return {
          ...course,
          lessons: course.lessons.map(lesson => ({
            ...lesson,
            quizz:
              lesson.quizz?.id === quizId
                ? { ...lesson.quizz, isCompleted: true }
                : lesson.quizz
          }))
        }
      })
    })),
  updateQuizInCourse: (courseId, updatedQuiz) =>
    set(state => ({
      user: state.user
        ? {
            ...state.user,
            courses: state.user.courses.map(course => {
              if (course.id !== courseId) return course
              return {
                ...course,
                lessons: course.lessons.map(lesson => ({
                  ...lesson,
                  quizz:
                    lesson.quizz?.id === updatedQuiz.id
                      ? updatedQuiz
                      : lesson.quizz
                }))
              }
            })
          }
        : null
    })),
  reset: () => set({ user: null, courses: [] })
}))
