

macro_rules! timer {
    ($($code:tt)*) => { 
        let start = std::time::Instant::now();
        $($code)*;
        println!("elapsed: {:?}", start.elapsed())
    };
}

macro_rules! timer2 {
    ($process_name:expr, $($code:tt)*) => { 
        let start = std::time::Instant::now();
        $($code)*;
        println!("{} | elapsed: {:?}", $process_name, start.elapsed())
    };
}

fn main() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {

    timer2!("d", let h = 2 + 2);

    println!("h is {}", h);

    Ok(())
}