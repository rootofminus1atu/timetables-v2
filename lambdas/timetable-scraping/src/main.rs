use lambda_http::{run, service_fn, tracing, Error, IntoResponse, Request, RequestPayloadExt, Response};
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
struct Payload {
    timetable_id: String,

    // 2nd field:

    // DATE
    // the date field could be a datetime.now() from the frontend by default
    // here the frontend would have to do a bit more heavy lifting
    // for the current week it'd have to calculate the current date
    // for the next/previous week it'd have to calculate the current date + 7 days

    // OR

    // OFFSET
    // the offset would by default be 0, which would indicate the current week
    // so the frontend would just request 1 for next week, 2 for 2 weeks further, etc
    // the drawback with this approach is that the 1st/last week would be hard to get

    // I don't know which approach to use just yet, that will prob become more clear in the future
    // and I think we only need these 2 params
}

#[derive(Debug, Serialize)]
struct ResponseBody {
    // the lessons will be here
    hello: String  // placeholder
}

async fn function_handler(event: Request) -> Result<impl IntoResponse, Error> {
    let body = event.payload::<Payload>()?.ok_or("Empty body bruh")?;

    
    // get the correct week number from the body.date/offset (and the 1st monday info)

    // construct the url using the body.timetable_id, week number and other static info

    // scrape the timetable from that url's html

    // send it (that's what the code down below does)
    let body = ResponseBody { hello: "hi".into() };
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
