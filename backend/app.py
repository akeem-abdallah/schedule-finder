from fastapi import FastAPI, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, selectinload
from dotenv import load_dotenv
import os
import logging
import threading
import time
from pydantic import BaseModel
from datetime import datetime
from models import Course, Section, FetchLog
from starlette.middleware.gzip import GZipMiddleware

load_dotenv()
DATABASE_URL = os.environ["DATABASE_URL"]
# give up on an unreachable database after 10s instead of hanging on the OS default
engine = create_engine(DATABASE_URL, connect_args={"connect_timeout": 10} if DATABASE_URL.startswith("postgres") else {})
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://schedule-finder-delta.vercel.app", "https://aurak-scheduler.com"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware)

@app.get("/health")
def app_health():
    return {"status": "ok!"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class MeetingOut(BaseModel):
    model_config = {"from_attributes": True}
    day: str
    start_time: str
    end_time: str
    room: str | None

class SectionOut(BaseModel):
    model_config = {"from_attributes": True}
    section_number: str
    instructor: str
    meetings: list[MeetingOut]
    available_seats: int

class CourseOut(BaseModel):
    model_config = {"from_attributes": True}
    subject: str
    code: str
    title: str
    credits: float
    sections: list[SectionOut]

class FetchLogOut(BaseModel):
    model_config = {"from_attributes": True}
    fetched_at: datetime | None

class InitialDataOut(BaseModel):
    courses: list[CourseOut]
    fetched_at: datetime | None


# every visitor gets the same data until the next refresh, so build the JSON once
# and reuse it; without this each request spends ~0.3s of the server's CPU rebuilding it
CACHE_SECONDS = 60
_cache = {"body": None, "expires": 0.0}
_cache_lock = threading.Lock()

def build_initial_data():
    db = SessionLocal()
    try:
        courses = db.query(Course).options(selectinload(Course.sections).selectinload(Section.meetings)).all()
        log = db.query(FetchLog).first()
        data = {"courses": courses, "fetched_at": log.fetched_at if log else None}
        return InitialDataOut.model_validate(data, from_attributes=True).model_dump_json()
    finally:
        db.close()

@app.get("/initial-data", response_model=InitialDataOut)
def get_initial_data():
    with _cache_lock:
        if _cache["body"] is None or time.monotonic() >= _cache["expires"]:
            try:
                _cache["body"] = build_initial_data()
            except Exception:
                # with nothing cached there's nothing to fall back on, so fail as before;
                # otherwise keep serving the last good copy and retry after CACHE_SECONDS
                if _cache["body"] is None:
                    raise
                logging.getLogger("uvicorn.error").exception("rebuilding /initial-data failed, serving cached copy")
            _cache["expires"] = time.monotonic() + CACHE_SECONDS
        body = _cache["body"]
    return Response(content=body, media_type="application/json")

@app.get("/fetch_log", response_model=FetchLogOut)
def get_log(db=Depends(get_db)):
    log = db.query(FetchLog).first()
    return {"fetched_at": log.fetched_at if log else None}
