import { create } from "zustand"
import { Course } from "../interfaces/course"
import Fuse from "fuse.js"

type CourseStore = {
  courses: Course[]
  initialized: boolean
  setInitialCourses: (courses: Course[]) => void
  setCourses: (courses: Course[]) => void
  getCourseById: (id: string) => Course | undefined
  searchCourses: (query: string, keys: string[]) => Course[]
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  initialized: false,
  setInitialCourses: (courses) => {
      if (!get().initialized) {
        set({ courses, initialized: true })
      }
    },
  setCourses: (courses) => set({ courses }),
  getCourseById: (id) => get().courses.find(course => course.id === id),
  searchCourses: (query, keys) => {
    if (query.trim() === '') {
      return get().courses
    }

    const fuseOptions = {
      keys
    }
    const fuse = new Fuse(get().courses, fuseOptions)
    const res = fuse.search(query)

    return res.map(({ item }) => item)
  },
}))