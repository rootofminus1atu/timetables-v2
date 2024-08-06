use chrono::NaiveDate;
use regex::Regex;
use reqwest;
use tracing::info;

const JS_URL: &str = "http://timetables.itsligo.ie:81/js/form.js";

#[derive(thiserror::Error, Debug, Clone)]
pub enum WeekDayError {
    #[error("Requesting the js file with `startMonday` failed")]
    RequestingJsFailed,
    #[error("Requesting the js file with `startMonday` failed, Bad Request 400")]
    RequestingJsFailedBadRequest,
    #[error("Could not find `startMonday` in the js")]
    StartMondayNotFound,
    #[error("Could not parse `startMonday`, got: `{got}`")]
    CouldNotParseStartMonday { got: String },
    #[error("Invalid date `{date}`. The date must come after the start_monday `{start_monday}`")]
    InvalidDate { start_monday: String, date: String }
}


/// Returns the week number for a given date. The week number is used to request the correct timetable.
/// 
/// ## Note for the future:
/// Under the hood it requests a js file containing the necessary info (the date of a starting monday) to calculate the proper date.
/// Which is probably inefficient, considering `startMonday` does not change almost at all.
/// That could be fixed in the future by instead storing tha `startMonday` in s3 and periodically refreshing it with a lambda, mostly during August or even just each day at 2am.
/// Then this function could just request the date from s3 instead.
/// 
/// Another issue with the current approach is having the js url hardcoded here. It could change in the future which would break this whole process.
pub async fn get_week_number_for_date(date: NaiveDate) -> Result<i32, WeekDayError> {
    let js = reqwest::get(JS_URL)
        .await
        .map_err(|_| WeekDayError::RequestingJsFailed)?
        .error_for_status()
        .map_err(|_| WeekDayError::RequestingJsFailedBadRequest)?
        .text()
        .await
        .map_err(|_| WeekDayError::RequestingJsFailed)?;

    let start_monday = find_start_monday(&js)?;

    get_week_number(start_monday, date)
}

fn get_week_number(start_monday: NaiveDate, date: NaiveDate) -> Result<i32, WeekDayError> {
    if date < start_monday {
        return Err(WeekDayError::InvalidDate { start_monday: start_monday.to_string(), date: date.to_string() });
    }

    let duration = date - start_monday;
    let days = duration.num_days();
    let week_number = (days / 7) + 1;

    Ok(week_number as i32)
}

fn find_start_monday(js: &str) -> Result<NaiveDate, WeekDayError> {
    let re = Regex::new(r#"var startMonday = new Date\("(\d{2}/\d{2}/\d{4})"#).unwrap();

    let date_str = re.captures(&js).ok_or(WeekDayError::StartMondayNotFound)?
        .get(1).ok_or(WeekDayError::StartMondayNotFound)?
        .as_str();

    // the date will be in mdY format
    let date = NaiveDate::parse_from_str(date_str, "%m/%d/%Y")
        .map_err(|_| WeekDayError::CouldNotParseStartMonday { got: date_str.into() })?;

    info!("found date: {:?}", date);

    Ok(date)
}