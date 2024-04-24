import { BaseLesson, Lesson, TimetableResponse } from "./interfaces/timetable"


export type DataReturn<Func extends (...args: any) => any> = Awaited<ReturnType<Func>>

export function toFullLesson(baseLesson: BaseLesson, timetableId: string): Lesson {
  const date = new Date(baseLesson.startDate)
  const monday = getThisWeeksMonday(date)

  const title = baseLesson.details.subject
  const color = getColorForLesson(baseLesson.details.subject)

  return {
    ...baseLesson,
    timetableId,
    monday,
    title,
    color
  }
}

export function getColorForLesson(lessonName: string) {
  let hash = 0;
  for (let i = 0; i < lessonName.length; i++) {
    hash = lessonName.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = ((hash >> (i * 8)) & 0x5B) + 0x60;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return color;
}

export function getDefaults() {
  const rn = new Date()
  return {
    date: rn,
    dateStr: rn.toISOString().split('T')[0],
    view: 'Week'
  };
}

export function getThisWeeksMonday(inputDate: Date) {
  const date = new Date(inputDate)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) 
  return new Date(date.setDate(diff))
}

export const dateToString = (date: Date) => date.toISOString().split('T')[0]
export const stringToDate = (dateStr: string) => new Date(dateStr)

export async function fetchLessons(timetableId: string, date: Date) {
  console.log('starting REAL fetch')
	try {
		const dateOnly = date.toISOString().split('T')[0]
	
		const data = {
		  timetableId,
		  date: dateOnly
		}
		console.log(data)
	
		const res = await fetch("https://vtlxqv4eyh.execute-api.eu-west-1.amazonaws.com/GetModules/timetable", {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(data)
		})
	
		if (!res.ok) {
		  throw new Error(`HTTP error! status: ${res.status}, status text: ${res.statusText}`);
		}
	
		const json: TimetableResponse = await res.json()
		return json.lessons
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

// export async function fetchLessonsFake(timetableId: string, _date: Date) {
//   console.log('starting FAKE fetch')

//   await new Promise(resolve => setTimeout(resolve, 1000))
//   const lessons = mockStoreThisWeek[timetableId]

//   return lessons
// }

