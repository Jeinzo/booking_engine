# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import date

import smtplib
from email.message import EmailMessage

app = FastAPI()

# Allow React frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model to validate booking input
class Booking(BaseModel):
    name: str
    email: str
    phone: str
    start_date: date
    end_date: date

# In-memory storage
bookings = []

@app.post("/book")
def create_booking(booking: Booking):
    # Save booking in memory
    bookings.append(booking.dict())

    # Print booking in terminal for debugging
    print("New booking received:", booking.dict())
    print("All bookings so far:", bookings)

    # Send email
    msg = EmailMessage()
    msg["Subject"] = "New Bike Booking"
    msg["From"] = "your-email@gmail.com"
    msg["To"] = "your-email@gmail.com"

    msg.set_content(f"""
    New Booking:

    Name: {booking.name}
    Email: {booking.email}
    Phone: {booking.phone}
    From: {booking.start_date}
    To: {booking.end_date}
    """)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login("kostasxatzoglou93@gmail.com", "bobf mvcq iojg tyzx")
        smtp.send_message(msg)

    return {"message": "Booking received"}

@app.get("/bookings")
def get_bookings():
    # Optional: view all bookings (for testing)
    return {"bookings": bookings}