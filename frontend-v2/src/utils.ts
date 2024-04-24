import { BaseLesson, Lesson, TimetableResponse } from "./interfaces/timetable"


export type DataReturn<Func extends (...args: any) => any> = Awaited<ReturnType<Func>>

export function toFullLesson(baseLesson: BaseLesson, timetableId: string): Lesson {
  const date = new Date(baseLesson.startDate)
  const monday = getThisWeeksMonday(date)

  const title = baseLesson.details.subject
  const color = '#87CEEB'  // in the future it will be generated based on the lesson name

  return {
    ...baseLesson,
    timetableId,
    monday,
    title,
    color
  }
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
		return { lessons: json.lessons, timetableId, date: new Date() }
  } catch (error) {
    console.error('Error:', error)
    return { lessons: null, timetableId, date: new Date() }
  }
}

export async function fetchLessonsFake(timetableId: string, date: Date) {
  console.log('starting FAKE fetch')

  await new Promise(resolve => setTimeout(resolve, 1000))
  const lessons = mockStoreThisWeek[timetableId]

  return lessons
}


const mockStoreThisWeek: { [key: string]: BaseLesson[]} = {
  "SG_KSODV_H08/F/Y2/1/(B)": [
    {
      "startDate": "2024-04-22T09:00:00",
      "endDate": "2024-04-22T10:00:00",
      "details": {
        "subject": "Object-Orientated Development/L",
        "roomDetails": {
          "id": "D2022",
          "desc": "Flat Classroom",
          "cap": 48,
          "fullStr": "D2022 - Flat Classroom (48)",
          "attributes": [
            "48"
          ]
        },
        "lecturer": "Mcmanus, Keith",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T10:00:00",
      "endDate": "2024-04-22T13:00:00",
      "details": {
        "subject": "Object-Orientated Development SDL7/L8",
        "roomDetails": {
          "id": "B2314",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2314 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Mcmanus, Keith",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T14:00:00",
      "endDate": "2024-04-22T15:00:00",
      "details": {
        "subject": "Intro to Database Management L",
        "roomDetails": {
          "id": "C1004",
          "desc": "Tiered Classroom",
          "cap": 80,
          "fullStr": "C1004 - Tiered Classroom (80)",
          "attributes": [
            "80"
          ]
        },
        "lecturer": "Harte,P",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T16:00:00",
      "endDate": "2024-04-22T17:00:00",
      "details": {
        "subject": "Web Programming 1",
        "roomDetails": {
          "id": "D1025",
          "desc": "Tiered Classroom",
          "cap": 60,
          "fullStr": "D1025 - Tiered Classroom (60)",
          "attributes": [
            "60"
          ]
        },
        "lecturer": "Peyton,K",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T17:00:00",
      "endDate": "2024-04-22T18:00:00",
      "details": {
        "subject": "Introduction to Cloud Computing/L",
        "roomDetails": {
          "id": "E0017",
          "desc": "Tiered Classroom",
          "cap": 106,
          "fullStr": "E0017 - Tiered Classroom (106)",
          "attributes": [
            "106"
          ]
        },
        "lecturer": "Davey,C",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-23T11:00:00",
      "endDate": "2024-04-23T13:00:00",
      "details": {
        "subject": "Software Quality and Testing SODV L7 A &amp;  SODV L8",
        "roomDetails": {
          "id": "B2306",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2306 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Kinsella,V",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-23T13:00:00",
      "endDate": "2024-04-23T14:00:00",
      "details": {
        "subject": "Software Quality and Testing",
        "roomDetails": {
          "id": "C1006",
          "desc": "Tiered Classroom",
          "cap": 67,
          "fullStr": "C1006 - Tiered Classroom (67)",
          "attributes": [
            "67"
          ]
        },
        "lecturer": "Kinsella,V",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-23T17:00:00",
      "endDate": "2024-04-23T18:00:00",
      "details": {
        "subject": "Intro to Database Management",
        "roomDetails": {
          "id": "C1006",
          "desc": "Tiered Classroom",
          "cap": 67,
          "fullStr": "C1006 - Tiered Classroom (67)",
          "attributes": [
            "67"
          ]
        },
        "lecturer": "Harte,P",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T10:00:00",
      "endDate": "2024-04-24T11:00:00",
      "details": {
        "subject": "Web Programming 1 SODV L7 &amp; L8",
        "roomDetails": {
          "id": "B2311",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2311 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Peyton,K",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T11:00:00",
      "endDate": "2024-04-24T13:00:00",
      "details": {
        "subject": "Web Programming 1 SODV L7 &amp; L8",
        "roomDetails": {
          "id": "B2311",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2311 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Peyton,K",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T13:00:00",
      "endDate": "2024-04-24T14:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "E0017",
          "desc": "Tiered Classroom",
          "cap": 106,
          "fullStr": "E0017 - Tiered Classroom (106)",
          "attributes": [
            "106"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T14:00:00",
      "endDate": "2024-04-24T16:00:00",
      "details": {
        "subject": "Intro to Database Man. SDL7/L8",
        "roomDetails": {
          "id": "B2311",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2311 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Harte,P",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T16:00:00",
      "endDate": "2024-04-24T17:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "E0017",
          "desc": "Tiered Classroom",
          "cap": 106,
          "fullStr": "E0017 - Tiered Classroom (106)",
          "attributes": [
            "106"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T10:00:00",
      "endDate": "2024-04-25T13:00:00",
      "details": {
        "subject": "Introduction to Cloud Computing SODV L7 &amp; L8",
        "roomDetails": {
          "id": "B2307",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2307 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Davey,C",
        "weekRangeIdk": "23, 25-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T15:00:00",
      "endDate": "2024-04-25T16:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "A0005",
          "desc": "Tiered Lecture Theatre",
          "cap": 132,
          "fullStr": "A0005 - Tiered Lecture Theatre (132)",
          "attributes": [
            "132"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T16:00:00",
      "endDate": "2024-04-25T17:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "A0005",
          "desc": "Tiered Lecture Theatre",
          "cap": 132,
          "fullStr": "A0005 - Tiered Lecture Theatre (132)",
          "attributes": [
            "132"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    }
  ],
  "SG_KGADV_B07/F/Y2/1/(A)": [
    {
      "startDate": "2024-04-22T09:00:00",
      "endDate": "2024-04-22T10:00:00",
      "details": {
        "subject": "Object-Orientated Development/L",
        "roomDetails": {
          "id": "D2022",
          "desc": "Flat Classroom",
          "cap": 48,
          "fullStr": "D2022 - Flat Classroom (48)",
          "attributes": [
            "48"
          ]
        },
        "lecturer": "Mcmanus, Keith",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T10:00:00",
      "endDate": "2024-04-22T12:00:00",
      "details": {
        "subject": "Data Structures and Algorithms Group",
        "roomDetails": {
          "id": "B2307",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2307 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Powell,P",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T13:00:00",
      "endDate": "2024-04-22T15:00:00",
      "details": {
        "subject": "Software Quality and Testing GADV",
        "roomDetails": {
          "id": "B2306",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2306 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Kinsella,V",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T15:00:00",
      "endDate": "2024-04-22T16:00:00",
      "details": {
        "subject": "Game Content Design 2",
        "roomDetails": {
          "id": "E1010",
          "desc": "Computer Laboratory",
          "cap": 30,
          "fullStr": "E1010 - Computer Laboratory (30)",
          "attributes": [
            "30"
          ]
        },
        "lecturer": "Rooney,M",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-22T16:00:00",
      "endDate": "2024-04-22T17:00:00",
      "details": {
        "subject": "Game Content Design 2",
        "roomDetails": {
          "id": "E1010",
          "desc": "Computer Laboratory",
          "cap": 30,
          "fullStr": "E1010 - Computer Laboratory (30)",
          "attributes": [
            "30"
          ]
        },
        "lecturer": "Rooney,M",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-23T11:00:00",
      "endDate": "2024-04-23T13:00:00",
      "details": {
        "subject": "Data Structures and Algorithms Group",
        "roomDetails": {
          "id": "B2314",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2314 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Powell,P",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-23T13:00:00",
      "endDate": "2024-04-23T14:00:00",
      "details": {
        "subject": "Software Quality and Testing",
        "roomDetails": {
          "id": "C1006",
          "desc": "Tiered Classroom",
          "cap": 67,
          "fullStr": "C1006 - Tiered Classroom (67)",
          "attributes": [
            "67"
          ]
        },
        "lecturer": "Kinsella,V",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-23T15:00:00",
      "endDate": "2024-04-23T17:00:00",
      "details": {
        "subject": "3D Game Programming",
        "roomDetails": {
          "id": "B2313",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2313 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Gannon, N",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T09:00:00",
      "endDate": "2024-04-24T10:00:00",
      "details": {
        "subject": "Object-Orientated Dev/KCMPU + GD - Group B",
        "roomDetails": {
          "id": "B2314",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2314 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Mcmanus, Keith",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T10:00:00",
      "endDate": "2024-04-24T13:00:00",
      "details": {
        "subject": "Object-Orientated Dev/KCMPU + GD - Group A",
        "roomDetails": {
          "id": "B2314",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2314 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Mcmanus, Keith",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T13:00:00",
      "endDate": "2024-04-24T14:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "E0017",
          "desc": "Tiered Classroom",
          "cap": 106,
          "fullStr": "E0017 - Tiered Classroom (106)",
          "attributes": [
            "106"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T14:00:00",
      "endDate": "2024-04-24T16:00:00",
      "details": {
        "subject": "Object-Orientated Dev/KCMPU + GD - Group B",
        "roomDetails": {
          "id": "B2314",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2314 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Mcmanus, Keith",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-24T16:00:00",
      "endDate": "2024-04-24T17:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "E0017",
          "desc": "Tiered Classroom",
          "cap": 106,
          "fullStr": "E0017 - Tiered Classroom (106)",
          "attributes": [
            "106"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T09:00:00",
      "endDate": "2024-04-25T11:00:00",
      "details": {
        "subject": "Game Content Design 2",
        "roomDetails": {
          "id": "B2313",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2313 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Rooney,M",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T11:00:00",
      "endDate": "2024-04-25T13:00:00",
      "details": {
        "subject": "3D Game Programming",
        "roomDetails": {
          "id": "B2313",
          "desc": "Computer Laboratory",
          "cap": 32,
          "fullStr": "B2313 - Computer Laboratory (32)",
          "attributes": [
            "32"
          ]
        },
        "lecturer": "Gannon, N",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T15:00:00",
      "endDate": "2024-04-25T16:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "A0005",
          "desc": "Tiered Lecture Theatre",
          "cap": 132,
          "fullStr": "A0005 - Tiered Lecture Theatre (132)",
          "attributes": [
            "132"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    },
    {
      "startDate": "2024-04-25T16:00:00",
      "endDate": "2024-04-25T17:00:00",
      "details": {
        "subject": "Mathematics 4 GD/SD",
        "roomDetails": {
          "id": "A0005",
          "desc": "Tiered Lecture Theatre",
          "cap": 132,
          "fullStr": "A0005 - Tiered Lecture Theatre (132)",
          "attributes": [
            "132"
          ]
        },
        "lecturer": "Hughes, Kieran",
        "weekRangeIdk": "23-31, 34-37"
      }
    }
  ]
}
