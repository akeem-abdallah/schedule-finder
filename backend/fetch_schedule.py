import requests

URL = "https://eums.aurak.ac.ae/Public/Schedule?h42blu9ygNZPnBJmMbXuWAu8XR3hS4tcKtMIP6xFd2U="

response = requests.get(URL)
print(response.status_code)

with open("aurak_schedule.html", "w", encoding="utf-8") as f:
    f.write(response.text)