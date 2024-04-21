use lambda_http::{run, service_fn, tracing, Error, IntoResponse, Request, RequestPayloadExt, Response};
use ::tracing::info;
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use url::TimetableUrl;
use weekday::get_week_number_for_date;
use parsing::{Lesson, get_all_lessons};

mod parsing;
mod url;
mod weekday;

// TODO: 
// - better error handling at the function_handler level
// - better error reporting at the scraper level, with some parsing/validation entry and some lifetime structs
// - allow to return poisoned timetables, aka ones with mising data chunks

#[derive(Debug, Deserialize)]
struct RequestBody {
    #[serde(rename = "timetableId")]
    timetable_id: String,
    date: NaiveDate
}

#[derive(Debug, Serialize)]
struct ResponseBody {
    lessons: Vec<Lesson>
}

#[tracing::instrument(err)]
async fn function_handler(event: Request) -> Result<impl IntoResponse, Error> {
    info!("starting, event: {:?}", event);

    let body = event.payload::<RequestBody>()?.ok_or("Empty body bruh")?;
    info!("body: {:?}", body);
    let RequestBody { timetable_id, date } = body;

    // 1. get the correct week number from the body.date (and the 1st monday info)
    // NOTE: instead of re-fetching it here every time, the date could be accessed from a store (s3 file) and be refreshed every once in a while with another lambda
    // (approx 150 ms on average)
    // if speed becomes an issue we should do what I wrote above
    let week_number = get_week_number_for_date(date).await?;

    // 2. construct the url using the body.timetable_id, week number and other static info
    let url = TimetableUrl::default(timetable_id.clone(), week_number).construct();
    info!("url: {}", url);

    // 3. scrape the timetable from that url's html
    // (approx 150ms on average too)
    let html = reqwest::get(&url)
        .await?
        .error_for_status()?
        .text()
        .await?;

    // (approx 40ms on average)
    let lessons = get_all_lessons(&html)?;

    // 4. send it
    let body = ResponseBody { lessons };
    let stringified = serde_json::to_string(&body)?;

    let resp = Response::builder()
        .status(200)
        .header("Content-Type", "application/json")
        .body(stringified)
        .map_err(Box::new)?;

    Ok(resp)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing::init_default_subscriber();

    run(service_fn(function_handler)).await
}
