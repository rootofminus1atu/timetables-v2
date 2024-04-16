export interface MondayToFridayTimetable {
    monday: Lesson[],
    tuesday: Lesson[],
    wednesday: Lesson[],
    thursday: Lesson[],
    friday: Lesson[]
}

// probably a pain, so we prob should not use tables
const alternativeMock = {
    '9:00': {
        monday: []  // arr of lessons tarting at 9:00
        // every other day
    }
    // every other hour
}

export interface Lesson {
    start: string,
    duration: number,
    day: number,
    details: LessonDetails
}

export interface LessonDetails {
    subject: string,
    roomId: string,
    roomDesc: string,
    roomCap: number,
    lecturer: string,
    idkWhatThisMeans: string
}


// why this not wroking (the json is as before)
export const mockTimetable: MondayToFridayTimetable = {
    monday: [
        {
            "start": "09:00:00",
            "duration": 1,
            "day": 1,
            "details": {
                "subject": "Object-Orientated Development/L",
                "roomId": "D2022",
                "roomDesc": "Flat Classroom",
                "roomCap": 48,
                "lecturer": "Mcmanus, Keith",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "10:00:00",
            "duration": 3,
            "day": 1,
            "details": {
                "subject": "Object-Orientated Development SDL7/L8",
                "roomId": "B2314",
                "roomDesc": "Computer Laboratory",
                "roomCap": 32,
                "lecturer": "Mcmanus, Keith",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "14:00:00",
            "duration": 1,
            "day": 1,
            "details": {
                "subject": "Intro to Database Management L",
                "roomId": "C1004",
                "roomDesc": "Tiered Classroom",
                "roomCap": 80,
                "lecturer": "Harte,P",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "16:00:00",
            "duration": 1,
            "day": 1,
            "details": {
                "subject": "Web Programming 1",
                "roomId": "D1025",
                "roomDesc": "Tiered Classroom",
                "roomCap": 60,
                "lecturer": "Peyton,K",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "17:00:00",
            "duration": 1,
            "day": 1,
            "details": {
                "subject": "Introduction to Cloud Computing/L",
                "roomId": "E0017",
                "roomDesc": "Tiered Classroom",
                "roomCap": 106,
                "lecturer": "Davey,C",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        }
    ],
    tuesday: [
        {
            "start": "11:00:00",
            "duration": 2,
            "day": 2,
            "details": {
                "subject": "Software Quality and Testing SODV L7 A &amp;  SODV L8",
                "roomId": "B2306",
                "roomDesc": "Computer Laboratory",
                "roomCap": 32,
                "lecturer": "Kinsella,V",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "13:00:00",
            "duration": 1,
            "day": 2,
            "details": {
                "subject": "Software Quality and Testing",
                "roomId": "C1006",
                "roomDesc": "Tiered Classroom",
                "roomCap": 67,
                "lecturer": "Kinsella,V",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "17:00:00",
            "duration": 1,
            "day": 2,
            "details": {
                "subject": "Intro to Database Management",
                "roomId": "C1006",
                "roomDesc": "Tiered Classroom",
                "roomCap": 67,
                "lecturer": "Harte,P",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        }
    ],
    wednesday: [
        {
            "start": "10:00:00",
            "duration": 1,
            "day": 3,
            "details": {
                "subject": "Web Programming 1 SODV L7 &amp; L8",
                "roomId": "B2311",
                "roomDesc": "Computer Laboratory",
                "roomCap": 32,
                "lecturer": "Peyton,K",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "11:00:00",
            "duration": 2,
            "day": 3,
            "details": {
                "subject": "Web Programming 1 SODV L7 &amp; L8",
                "roomId": "B2311",
                "roomDesc": "Computer Laboratory",
                "roomCap": 32,
                "lecturer": "Peyton,K",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "13:00:00",
            "duration": 1,
            "day": 3,
            "details": {
                "subject": "Mathematics 4 GD/SD",
                "roomId": "E0017",
                "roomDesc": "Tiered Classroom",
                "roomCap": 106,
                "lecturer": "Hughes, Kieran",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "14:00:00",
            "duration": 2,
            "day": 3,
            "details": {
                "subject": "Intro to Database Man. SDL7/L8",
                "roomId": "B2311",
                "roomDesc": "Computer Laboratory",
                "roomCap": 32,
                "lecturer": "Harte,P",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "16:00:00",
            "duration": 1,
            "day": 3,
            "details": {
                "subject": "Mathematics 4 GD/SD",
                "roomId": "E0017",
                "roomDesc": "Tiered Classroom",
                "roomCap": 106,
                "lecturer": "Hughes, Kieran",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        }
    ],
    thursday: [
        {
            "start": "10:00:00",
            "duration": 3,
            "day": 4,
            "details": {
                "subject": "Introduction to Cloud Computing SODV L7 &amp; L8",
                "roomId": "B2307",
                "roomDesc": "Computer Laboratory",
                "roomCap": 32,
                "lecturer": "Davey,C",
                "idkWhatThisMeans": "23, 25-31, 34-37"
            }
        },
        {
            "start": "15:00:00",
            "duration": 1,
            "day": 4,
            "details": {
                "subject": "Mathematics 4 GD/SD",
                "roomId": "A0005",
                "roomDesc": "Tiered Lecture Theatre",
                "roomCap": 132,
                "lecturer": "Hughes, Kieran",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        },
        {
            "start": "16:00:00",
            "duration": 1,
            "day": 4,
            "details": {
                "subject": "Mathematics 4 GD/SD",
                "roomId": "A0005",
                "roomDesc": "Tiered Lecture Theatre",
                "roomCap": 132,
                "lecturer": "Hughes, Kieran",
                "idkWhatThisMeans": "23-31, 34-37"
            }
        }
    ],
    friday: []
}
