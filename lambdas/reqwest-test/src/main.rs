use lambda_http::{run, service_fn, tracing, Error, IntoResponse, Request, Response};
use serde::Serialize;
use serde_json::Value;

#[derive(Debug, Serialize)]
struct ResponseBody {
    joke: String
}

async fn function_handler(_event: Request) -> Result<impl IntoResponse, Error> {
    let joke = reqwest::get("https://api.chucknorris.io/jokes/random")
        .await?
        .json::<Value>()
        .await?
        ["value"].as_str().unwrap().to_owned();

    let body = ResponseBody { joke };
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