from bs4 import BeautifulSoup

with open("aurak_schedule.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
table = soup.find("table", id="dt_basic")
tbody = table.find("tbody")
rows = tbody.find_all("tr")

def parse_row(row):
    cells = row.find_all("td")

    code_text = cells[0].get_text().strip()
    subject, code = code_text.split()

    seats_text = cells[4].get_text().strip()
    if seats_text == "Full":
        available_seats = 0
    else:
        available_seats = int(seats_text)

    teacher = cells[6].get_text().strip()
    if teacher == "To Be Announced": 
        teacher = "TBA"
    else:
        teacher = teacher.title()

    return {
        "subject": subject,
        "code": code,
        "section": cells[1].get_text().strip(),
        "description": cells[2].get_text().strip(),
        "credits": float(cells[3].get_text().strip()),
        "available_seats": available_seats,
        "registered": int(cells[5].get_text().strip()),
        "teacher": teacher,
        "day_time_room": cells[7].get_text().strip(),
    }

def to_24_hour(time):
    time_part = time[:-2]
    am_pm = time[-2:]
    hour, minute = time_part.split(':')
    hour, minute = int(hour), int(minute)
    if am_pm == "AM" and hour == 12:
        hour = 0
    elif am_pm == "PM":
        if hour != 12:
            hour += 12
    return f"{hour:02d}:{minute:02d}"

def parse_meetings(cell):
    meetings = []
    for span in cell.find_all("span"):
        text = span.get_text().strip().rstrip(",").strip()
        parts = text.split()
        day = parts[0]
        time_range = parts[1]
        start, end = time_range.split("-")
        meetings.append({"day": day, "start": to_24_hour(start), "end": to_24_hour(end)})
    return meetings

def parse_section(row):
    cells = row.find_all("td")
    info = parse_row(row)
    del info["day_time_room"]
    info["meetings"] = parse_meetings(cells[7])
    return info

sections = []
for row in rows:
    sections.append(parse_section(row))

subjects_dict = {}

for record in sections:
    subj = record["subject"]
    if subj not in subjects_dict:
        subjects_dict[subj] = {"subject": subj, "courses": {}}

    courses = subjects_dict[subj]["courses"]
    code = record["code"]
    if code not in courses:
        courses[code] = {
            "code": code,
            "description": record["description"],
            "credits": record["credits"],
            "sections": [],
        }

    courses[code]["sections"].append({
        "section": record["section"],
        "instructor": record["teacher"],
        "available_seats": record["available_seats"],
        "registered": record["registered"],
        "meetings": record["meetings"],
    })

subjects = []
for subj_data in subjects_dict.values():
    subj_data["courses"] = list(subj_data["courses"].values())
    subjects.append(subj_data)

total = sum(len(c["sections"]) for s in subjects for c in s["courses"])
print(total)






print(len(sections))
print(sections[0])

