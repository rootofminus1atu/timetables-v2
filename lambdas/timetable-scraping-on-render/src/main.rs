use axum::{response::{Html, IntoResponse, Response}, routing::{get, post}, Json, Router};
use chrono::NaiveDate;
use parsing::{Lesson, ParsingError};
use serde::{Deserialize, Serialize};
use tower_http::services::{ServeDir, ServeFile};
use tracing::info;
use axum::http::StatusCode;

use crate::{parsing::get_all_lessons, url::TimetableUrl, weekday::get_week_number_for_date};

use tower_http::cors::{Any, CorsLayer};

mod parsing;
mod url;
mod weekday;

#[derive(Debug, Deserialize)]
struct RequestBody {
    #[serde(rename = "timetableId")]
    timetable_id: String,
    date: NaiveDate,
}

#[derive(Debug, Serialize)]
struct ResponseBody {
    lessons: Vec<Lesson>,
}


async fn handler(Json(payload): Json<RequestBody>) -> Result<impl IntoResponse, Error> {
    // Process the payload
    info!("starting");
    info!("body: {:?}", payload);
    let RequestBody { timetable_id, date } = payload;

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

    Ok(Json(body))
}


// quick bandaids when porting this to axum:

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        .init();

    let app = Router::new()
        .route("/api/lessons", post(handler))
        .route("/dummy", get(|| async { Html(r#"<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title></head><body><h1>dummy html</h1></body></html>"#) }))
        .layer(CorsLayer::new()
            .allow_origin(Any)
            .allow_methods(Any)
            .allow_headers(Any)
        )
        .nest_service("/", ServeDir::new("public").not_found_service(ServeFile::new("public/index.html")))
        .fallback_service(ServeDir::new("public").not_found_service(ServeFile::new("public/index.html")));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("listening");
    axum::serve(listener, app).await.unwrap();
}



// quick bandaids when porting this to axum:

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Parsing error: {0}")]
    ParsingError(#[from] ParsingError),
    #[error("Weekday error: {0}")]
    WeekDayError(#[from] weekday::WeekDayError),
    #[error("Request error: {0}")]
    ReqwestError(#[from] reqwest::Error),
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}

impl IntoResponse for Error {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            Error::ParsingError(why) => (StatusCode::BAD_REQUEST, why.to_string()),
            Error::WeekDayError(why) => (StatusCode::BAD_REQUEST, why.to_string()),
            Error::ReqwestError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "Request Error".into()),
            Error::IoError(_) => (StatusCode::INTERNAL_SERVER_ERROR, "IO Error".into()),
        };

        let body = Json(serde_json::json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}
