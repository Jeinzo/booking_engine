// frontend/src/components/BookingForm.jsx
import { useState } from "react";

export default function BookingForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    start_date: "",
    end_date: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.start_date ||
      !form.end_date
    ) {
      setStatus("Please fill in all fields.");
      return;
    }

    // Optional: check that end date >= start date
    if (form.end_date < form.start_date) {
      setStatus("End date cannot be before start date.");
      return;
    }

    setStatus("Sending...");

    try {
      const response = await fetch("http://127.0.0.1:8000/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Ensure dates are properly formatted as strings
        body: JSON.stringify({
          ...form,
          start_date: form.start_date,
          end_date: form.end_date,
        }),
      });

      if (response.ok) {
        setStatus("Booking sent! Check your email.");
        setForm({
          name: "",
          email: "",
          phone: "",
          start_date: "",
          end_date: "",
        });
      } else {
        const data = await response.json();
        setStatus(
          data.detail
            ? `Failed: ${data.detail}`
            : "Failed to send booking. Try again."
        );
      }
    } catch (error) {
      console.error(error);
      setStatus("Error sending booking.");
    }
  };

  return (
    <div>
      <h2>Bike Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <label>
          Start Date:
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Book Now</button>
      </form>
      <p>{status}</p>
    </div>
  );
}