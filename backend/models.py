from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime

Base = declarative_base()

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True)
    subject = Column(String, nullable=False)
    code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    credits = Column(Float, nullable=False)
    sections = relationship("Section", back_populates="course")


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    section_number = Column(String, nullable=False)
    instructor = Column(String, nullable=False)
    course = relationship("Course", back_populates="sections")
    meetings = relationship("Meeting", back_populates="section")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True)
    section_id = Column(Integer, ForeignKey("sections.id"), nullable=False)
    day = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    section = relationship("Section", back_populates="meetings")


class FetchLog(Base):
    __tablename__ = "fetch_log"

    id = Column(Integer, primary_key=True)
    fetched_at = Column(DateTime, nullable=False)