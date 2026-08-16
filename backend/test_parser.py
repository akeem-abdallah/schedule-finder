from fetch_schedule import load_rows, parse_section, parse_row

def test_rows():
    rows = load_rows("aurak_schedule.html")
    assert len(rows) == 421

def test_no_meeting_course():
    rows = load_rows("aurak_schedule.html")
    biol_494 = None
    for row in rows:
        info = parse_section(row)
        if info["subject"] == "BIOL" and info["code"] == "494":
            biol_494 = info
            break
    assert biol_494["meetings"] == []

def test_full_seats_becomes_zero():
    rows = load_rows("aurak_schedule.html")
    for row in rows:
        cells = row.find_all("td")
        if cells[4].get_text().strip() == "Full":
            info = parse_row(row)
            assert info["available_seats"] == 0
            break