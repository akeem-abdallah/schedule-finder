from bs4 import BeautifulSoup

with open("aurak_schedule.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")
table = soup.find("table", id="dt_basic")
tbody = table.find("tbody")
rows = tbody.find_all("tr")

first_row = rows[0]
cells = first_row.find_all("td")
for cell in cells:
    print(repr(cell.get_text().strip()))