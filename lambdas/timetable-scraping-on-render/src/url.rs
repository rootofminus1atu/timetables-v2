use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};


enum TimetableKind {
    ForStudents
}

impl std::fmt::Display for TimetableKind {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            TimetableKind::ForStudents => write!(f, "student+set"),
        }
    }
}

/// Info about the `periods` field
/// 
/// 3 = 9:00 
/// 
/// 20 = 18:00
pub struct TimetableUrl {
    id: String,
    days: (i32, i32),
    week_number: i32,
    periods: (i32, i32),
    kind: TimetableKind,
}

impl TimetableUrl {
    const BASE_URL: &'static str = "http://timetables.itsligo.ie:81/reporting/";
    const CRLF: &'static str = "%0D%0A";

    /// If the id is not encoded yet, use this, otherwise use `default_with_encoded_id`.
    pub fn default(id: String, week_number: i32) -> Self {
        let id_encoded = utf8_percent_encode(&id, NON_ALPHANUMERIC).to_string();
        let id_ready = format!("{}{}", id_encoded, Self::CRLF);

        Self::default_with_encoded_id(id_ready, week_number)
    }


    /// In case the id is already in % encoded form, this can be used.
    pub fn default_with_encoded_id(id_encoded: String, week_number: i32) -> Self {
        Self {
            id: id_encoded,
            days: (1, 5), 
            week_number, 
            periods: (3, 20), 
            kind: TimetableKind::ForStudents 
        }
    }

    pub fn construct(&self) -> String {
        let kind = self.kind.to_string();
        format!(
            "{}individual;{};id;{}?t={}+individual&days={}-{}&weeks={}&periods={}-{}&template={}+individual", 
            Self::BASE_URL, 
            kind, 
            self.id,
            kind,
            self.days.0,
            self.days.1,
            self.week_number,
            self.periods.0,
            self.periods.1,
            kind
        )
    }
}