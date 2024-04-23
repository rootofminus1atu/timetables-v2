export interface TimetableResponse {
    lessons: BaseLesson[]
}

export type Lesson = BaseLesson & {
    timetableId: string
    monday: Date
    color: string
    title: string
    uuid: string
    // other possible props
}

export interface BaseLesson {
    startDate: string,
    endDate: string,
    details: LessonDetails
}

export interface LessonDetails {
    subject: string, 
    roomDetails: RoomDetails,
    lecturer: string,
    weekRangeIdk: string
}

export interface RoomDetails {
    id: string,
    desc: string,
    cap: number,
    fullStr: string,
    attributes: string[]
}