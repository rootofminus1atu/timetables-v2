use std::str::FromStr;
use tracing::{self, info};
use tracing_subscriber;
use chrono::{Days, Duration, NaiveDate, NaiveDateTime, NaiveTime, TimeDelta};
use scraper::{Element, ElementRef, Html, Selector};


type Error = Box<dyn std::error::Error + Send + Sync + 'static>;

fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let res = get_the_thing(HTML_STRING)?;
    info!("res: {:#?}", res);

    Ok(())
}

// TODO:
// - implement table poisoning
// aka when a single cell/room_desc cannot be parsed, instead of returning a big error
// return an incomplete timetable
// - divide the ParsingError into separate error kinds




#[derive(thiserror::Error, Debug, Clone)]
enum ParsingError {
    // targetting errors
    #[error("Could not find the `9:00` cell")]
    NineOClockCellNotFound,
    #[error("Could not find the parent of `{elem}`")]
    ParentNotFound { elem: String },
    #[error("Somehow a week day row had no children (row index: {row_index})")]
    NoCellsInWeekDayRowFound { row_index: usize },
    #[error("What kind of a crooked timetable is that? The 1st row had no weekday cell")]
    FirstRowHasNoWeekDayName,
    #[error("Invalid colspan value encountered (how?)")]
    InvalidColspan,

    // parsing single cell data errors
    #[error("Invalid amount of text elements in lesson cell. Expected {expected}, got {got}")]
    InvalidAmountOfTextElementsInLessonCell { expected: i32, got: i32},
    
    // room errors
    #[error("Invalid room string. Expected something of the form `<room_id> - <room_desc> (attributes)`, got {got}")]
    InvalidRoomString { got: String },
    #[error("Could not find a room cap, got: `{got}`")]
    RoomCapNotFound { got: String },
    #[error("Could not find a room desc, got: `{got}`")]
    RoomDescNotFound{ got: String },

    // date errors
    #[error("Could not find a date string in the timetable")]
    DateNotFound,
    #[error("Could not extract the date, got: `{got}`")]
    InvalidDateString { got: String },
}


fn get_the_thing(html_str: &str) -> Result<Vec<Lesson>, ParsingError> {
    let document = Html::parse_document(html_str);

    let header_row = get_header_row(&document)?;

    let week_rows = get_week_rows(header_row)?;

    let lesson_primitives = LessonPrimitive::from_week_rows(&week_rows)?;

    let monday_date = get_monday_date(&document)?;

    // currently if parsing for any single cell fails the whole process fails
    // would probably be nice to have an optional return with poisoned cells
    // and then the json could returned a poisoned timetable that we decide later what do do with
    let lessons = lesson_primitives.into_iter()
        .map(|l| Lesson::from_primitive(l, monday_date))
        .collect::<Result<Vec<_>, _>>()?;

    Ok(lessons)
}

fn get_monday_date(document: &Html) -> Result<NaiveDate, ParsingError> {
    let selector = Selector::parse("b").unwrap();
    let b = document.select(&selector)
        .find(|element| element.text().collect::<String>().contains("Weeks selected for output"))
        .ok_or(ParsingError::DateNotFound)?;
    let text = b.text().collect::<String>();

    let (_, date_part) = text.split_once('(')
        .ok_or(ParsingError::InvalidDateString { got: text.clone() })?;

    let (date_part, _) = date_part.split_once('-')
        .ok_or(ParsingError::InvalidDateString { got: text.clone() })?;

    let date = NaiveDate::parse_from_str(date_part, "%d %b %Y")
        .map_err(|_| ParsingError::InvalidDateString { got: text.clone() })?;

    Ok(date)
}

#[derive(Debug, Clone)]
struct Lesson {
    start_date: NaiveDateTime,
    end_date: NaiveDateTime,
    details: LessonDetails
}

#[derive(Debug, Clone)]
struct LessonDetails {
    subject: String,
    room_details: RoomDetails,
    lecturer: String,
    week_range_idk: String
}

impl LessonDetails {
    fn from_preprocessed(preprocessed: LessonDetailsPreProcessed) -> Result<Self, ParsingError> {
        Ok(Self { 
            subject: preprocessed.subject,
            room_details: RoomDetails::from_str(&preprocessed.room_details)?,
            lecturer: preprocessed.lecturer,
            week_range_idk: preprocessed.week_range_idk
        })
    }
}

#[derive(Debug, Clone)]
struct RoomDetails {
    id: String,
    desc: String,
    cap: i32,
    full_str: String,
    attributes: Vec<String>
}

impl FromStr for RoomDetails {
    type Err = ParsingError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        // possible cases:
        // B2315 - Flat Classroom (30)
        // B2315 - Flat Classroom (Eng) (30)
        // even more () thingies, but one of them, last or closest to last ones that is a number, is the room_cap
        let (id, desc_and_attrs) = s.split_once("-")
            .ok_or(ParsingError::InvalidRoomString { got: s.into() })?;

        let id = id.trim().to_string();
        let desc_and_attrs = desc_and_attrs.trim();

        let secondary_parts = desc_and_attrs.split('(')
            .map(|s| s.trim().trim_end_matches(')'))
            .collect::<Vec<_>>();

        info!("{:?}", secondary_parts);

        let mut parts_iter = secondary_parts.into_iter();

        let desc = parts_iter.next().ok_or(ParsingError::RoomDescNotFound { got: s.into() })?
            .to_string();

        let mut room_cap = None;
        let mut attrs = vec![];

        // before this line, id like to take away the 1st element and put it in a variable called desc
        for part in parts_iter.rev() {
            if room_cap.is_none() && part.chars().all(|c| c.is_digit(10)) {
                room_cap = part.parse::<i32>().ok();
            }
            
            // can i instead push in reverse order
            attrs.push(part.to_string());
        }

        let room_cap = room_cap.ok_or(ParsingError::RoomCapNotFound { got: s.into() })?;
        attrs.reverse();

        Ok(Self {
            id,
            desc,
            cap: room_cap,
            full_str: s.to_string(),
            attributes: attrs
        })
    }
}

#[derive(Debug, Clone)]
struct LessonDetailsPreProcessed {
    subject: String,
    room_details: String,
    lecturer: String,
    week_range_idk: String
}

impl LessonDetailsPreProcessed {
    fn from_element_ref(elem_ref: ElementRef) -> Result<Self, ParsingError> {
        let font_selector = Selector::parse("font").unwrap();
        let found = elem_ref.select(&font_selector)
            .map(|e| e.inner_html())
            .collect::<Vec<_>>();

        // have another similar case but one that allows for recovery, one with the subject name

        if found.len() != 4 {
            return Err(ParsingError::InvalidAmountOfTextElementsInLessonCell { expected: 4, got: found.len() as i32 });
        }

        let [subject, room_details, lecturer, week_range_idk] = found.try_into().unwrap();

        Ok(Self { subject, room_details, lecturer, week_range_idk })
    }
}

impl Lesson {
    pub fn from_primitive(primitive: LessonPrimitive, monday_date: NaiveDate) -> Result<Self, ParsingError> {
        let start_date = monday_date
            .checked_add_days(Days::new(primitive.day_index as u64)).unwrap()
            .and_time(primitive.time_start);

        let end_date = start_date
            .checked_add_signed(Duration::minutes(primitive.duration_minutes as i64)).unwrap();

        let preprocessed = LessonDetailsPreProcessed::from_element_ref(primitive.elem_ref)?;
        let details = LessonDetails::from_preprocessed(preprocessed)?;

        Ok(Self {
            start_date,
            end_date,
            details
        })
    }
}



struct LessonPrimitive<'a> {
    elem_ref: ElementRef<'a>,
    row_index: i32,
    day_index: i32,
    time_start: NaiveTime,
    duration_minutes: i32
}

impl<'a> LessonPrimitive<'a> {
    fn new(elem_ref: ElementRef<'a>, row_index: i32, day_index: i32, time_start: NaiveTime, duration_minutes: i32) -> Self {
        Self {
            elem_ref,
            row_index,
            day_index,
            time_start,
            duration_minutes
        }
    }

    pub fn from_week_rows(day_rows: &[ElementRef<'a>]) -> Result<Vec<Self>, ParsingError> {
        // the index below is used to keep track of the day a row belongs to
        let mut current_day_index = -1;
        let mut lesson_primitives_store = Vec::<LessonPrimitive>::new();

        for (i, &row) in day_rows.iter().enumerate() {
            let mut children = row.child_elements();

            let row_has_weekday_cell = Self::row_has_weekday_cell(row);
            
            if row_has_weekday_cell {
                // IMPORTANT
                // skip ONLY IF we do find a day
                // since for the case of multiple rows for a given day only the 1st one contains the junk "Mon"/"Tue"/etc. info
                let first_unimportant_cell = children
                    .next()
                    .ok_or(ParsingError::NoCellsInWeekDayRowFound { row_index: i })?;
            
                info!("skipping: {:?}", first_unimportant_cell.html());    
        
                current_day_index += 1;
            }

            // the previous block should always be true when starting out
            // and to make sure that it is true we do this:
            Self::first_iteration_check(i, row_has_weekday_cell)?;

            info!("row index: {}", i);
            info!("current day index: {}", current_day_index);
            
            let lesson_cells_for_this_row = Self::from_single_week_row(children, current_day_index, i as i32)?;

            lesson_primitives_store.extend(lesson_cells_for_this_row.into_iter());
        }

        Ok(lesson_primitives_store)
    }

    fn row_has_weekday_cell(row: ElementRef) -> bool {
        let selector = Selector::parse("font[color='#FFFFFF']").unwrap();
        let found_day = row.select(&selector).next();
    
        found_day.is_some()
    }
    
    fn first_iteration_check(i: usize, row_has_weekday_cell: bool) -> Result<(), ParsingError> {
        if i == 0 {
            if row_has_weekday_cell == false {
                return Err(ParsingError::FirstRowHasNoWeekDayName)
            }
        }
    
        Ok(())
    }

    /// Parses a colspan
    /// 
    /// A colspan is responsible for decoding how long a particular lesson would last for, with the rule
    /// `1 colspan = 30 minutes`
    fn parse_colspan(elem: ElementRef<'_>) -> Result<Option<i32>, ParsingError> {
        match elem.attr("colspan") {
            Some(s) => {
                // we want to return an Err only if the parsing fails, somehow (it never should)
                let parsed = s.parse::<i32>().map_err(|_| ParsingError::InvalidColspan)?;  
                Ok(Some(parsed))
            },
            None => Ok(None)
        }
    }

    fn from_single_week_row(cells: impl Iterator<Item = ElementRef<'a>>, day_index: i32, row_index: i32) -> Result<Vec<Self>, ParsingError> {
        let mut time = NaiveTime::from_hms_opt(9, 0, 0).unwrap();
        let mut lessons_store = vec![];

        let colspan_minutes = 30;
        
        for cell in cells {
            // check out the colspan doc to find out what it actually means
            let colspan = Self::parse_colspan(cell)?;

            // read the below as "if there is a lesson going on"
            if let Some(colspan_num) = colspan { 
                let duration_minutes = colspan_num * colspan_minutes;

                info!("\nOMG OMG OMG\nTIME: {} - {}\nDAY INDEX: {}\nWE GOT EM\n{}", time, duration_minutes, day_index, cell.html());

                let lesson = LessonPrimitive::new(cell, row_index, day_index, time, duration_minutes);
                lessons_store.push(lesson);
            }

            match colspan {
                Some(n) => time += TimeDelta::minutes(n as i64 * colspan_minutes as i64),
                None => time += TimeDelta::minutes(colspan_minutes as i64)
            }
        }

        Ok(lessons_store)
    }
}



fn get_header_row(document: &Html) -> Result<ElementRef, ParsingError> {
    let hour_cell_selector = Selector::parse("font[color='#FFFFFF']").unwrap();

    let first_hour_font_elem = document.select(&hour_cell_selector)
        .next()
        .ok_or(ParsingError::NineOClockCellNotFound)?;

    let first_hour_td = first_hour_font_elem.parent_element()
        .ok_or(ParsingError::ParentNotFound { elem: "first_hour_font_elem".into() })?;

    let header_row_tr = first_hour_td.parent_element()
        .ok_or(ParsingError::ParentNotFound { elem: "first_hour_td".into() })?;
    
    Ok(header_row_tr)
}

fn get_week_rows(header_row: ElementRef) -> Result<Vec<ElementRef>, ParsingError> {

    let day_rows = header_row.next_siblings()
        .filter_map(ElementRef::wrap)
        .collect::<Vec<_>>();

    Ok(day_rows)
}




const HTML_STRING: &str = r###"

"###;

