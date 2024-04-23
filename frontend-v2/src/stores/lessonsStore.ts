import { create } from "zustand"
import { Lesson } from "../interfaces/timetable"
import { fetchLessons, getThisWeeksMonday } from "../utils"


type LessonsStore = {
  lessons: Map<string, Lesson>
  initialized: boolean
  setInitialLessons: (lesson: Lesson[]) => void
  addLessons: (lessons: Lesson[]) => void
  // fetchMore: (date: Date) => Promise<void>
  getLessonsForCourse: (timetableId: string) => Lesson[]
}

// how to keep track of not just the dates but also timetables themselves

export const useLessonsStore = create<LessonsStore>((set, get) => ({
  lessons: new Map(),
  initialized: false,
  setInitialLessons: (lessons) => {
    if (!get().initialized) {
      console.log('initial fetch')
      const lessonsMap = new Map(lessons.map(lesson => [lesson.uuid, lesson]));
      set({ lessons: lessonsMap, initialized: true })
    }
  },
  addLessons: (lessons) => {
    // dilemma, i either:
    // 1. use merging here to avoid duplicated lessons (probably a good idea anyway)
    // 2. write a function that retrieves only unique lessons
    set(state => {
      const newLessons = new Map(state.lessons)
      for (const lesson of lessons) {
        newLessons.set(lesson.uuid, lesson)
      }
      return { lessons: newLessons }
    })
  },
  getLessonsForCourse: (timetableId) => {
    const lessons = Array.from(get().lessons.values()).filter(l => l.timetableId === timetableId)
    return lessons
  }
  // fetchMore: async (date) => {
  //   const lastMonday = getLastMonday(date)
  //   // if the last monday is already in the mondays list, we dont do anything 

  //   // otherwise
  //   // const moreLessons = await fetchLessons(timetableId, date)

  //   // set(state => ({
  //   //   lessons: [...state.lessons, ...moreLessons]
  //   // }))
  // }
}))



// add a method to "potentially" fetch more





/*


type LessonsStore = {
  lessons: Lesson[]
  initialized: boolean
  setInitialLessons: (lesson: Lesson[]) => void
  addLessons: (lessons: Lesson[]) => void
  // fetchMore: (date: Date) => Promise<void>
  getLessonsForCourse: (timetableId: string) => Lesson[]
}

// how to keep track of not just the dates but also timetables themselves

export const useLessonsStore = create<LessonsStore>((set, get) => ({
  lessons: [],
  initialized: false,
  setInitialLessons: (lessons) => {
    if (!get().initialized) {
      console.log('initial fetch')
      set({ lessons, initialized: true })
    }
  },
  addLessons: (lessons) => {
    // dilemma, i either:
    // 1. use merging here to avoid duplicated lessons (probably a good idea anyway)
    // 2. write a function that retrieves only unique lessons
    set(state => ({
      lessons: [...state.lessons, ...lessons]
    }))
  },
  getLessonsForCourse: (timetableId) => {
    const lessons = get().lessons.filter(l => l.timetableId === timetableId)
    return lessons
  }
  // fetchMore: async (date) => {
  //   const lastMonday = getLastMonday(date)
  //   // if the last monday is already in the mondays list, we dont do anything 

  //   // otherwise
  //   // const moreLessons = await fetchLessons(timetableId, date)

  //   // set(state => ({
  //   //   lessons: [...state.lessons, ...moreLessons]
  //   // }))
  // }
}))


*/