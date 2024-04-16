const fuzzball = require('fuzzball');

const cases = [
    // good cases
    ['Object-Orientated Development/L', 'Object-Orientated Development SDL7/L8'],
    ['Web Programming 1 SODV L7 & L8', 'Web Programming 1'],
    ['Intro to Database Management L', 'Intro to Database Man. SDL7/L8'],
    ['Software Quality and Testing SODV L7 A & SODV L8', 'Software Quality and Testing'],
    ['Introduction to Cloud Computing/L', 'Introduction to Cloud Computing SODV L7 & L8'],
    // bad cases that 
    ['Introduction to Cloud Computing/L', 'Introduction to Database Management/L']
]

cases.map(casePair => {
    const ratio = fuzzball.ratio(casePair[0], casePair[1]);
    console.log(ratio);
});

