from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, selectinload
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from datetime import datetime
from models import Course, Section, FetchLog
from starlette.middleware.gzip import GZipMiddleware

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
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
    fetched_at: datetime

class InitialDataOut(BaseModel):
    courses: list[CourseOut]
    fetched_at: datetime


@app.get("/courses", response_model=list[CourseOut])
def get_courses(db=Depends(get_db)):
    return db.query(Course).options(selectinload(Course.sections).selectinload(Section.meetings)).all()

@app.get("/initial-data", response_model=InitialDataOut)
def get_initial_data(db=Depends(get_db)):
    courses = db.query(Course).options(selectinload(Course.sections).selectinload(Section.meetings)).all()
    log = db.query(FetchLog).first()
    return {"courses": courses, "fetched_at": log.fetched_at}

@app.get("/fetch_log", response_model=FetchLogOut)
def get_log(db=Depends(get_db)):
    return db.query(FetchLog).first()
