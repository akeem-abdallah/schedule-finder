from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, selectinload
from dotenv import load_dotenv
import os
from pydantic import BaseModel
from models import Course, Section

load_dotenv()
engine = create_engine(os.environ["DATABASE_URL"])
SessionLocal = sessionmaker(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://schedule-finder-delta.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "hello"}

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

class SectionOut(BaseModel):
    model_config = {"from_attributes": True}
    section_number: str
    instructor: str
    meetings: list[MeetingOut]

class CourseOut(BaseModel):
    model_config = {"from_attributes": True}
    subject: str
    code: str
    title: str
    credits: float
    sections: list[SectionOut]


@app.get("/courses", response_model=list[CourseOut])
def get_courses(db=Depends(get_db)):
    return db.query(Course).options(selectinload(Course.sections).selectinload(Section.meetings)).all()