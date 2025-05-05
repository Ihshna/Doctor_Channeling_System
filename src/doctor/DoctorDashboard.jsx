import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [summary, setSummary] = useState({
    todaysAppointments: 0,
    upcomingAppointments: 0,
    patientQueue: 0,
  });

  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    // Fetch summary stats
    axios.get('http://localhost:5000/doctor-dashboard-summary').then((res) => {
      setSummary(res.data);
    });

    // Fetch calendar events
    axios.get('http://localhost:5000/appointments-calendar').then((res) => {
      const formattedEvents = res.data.map((appt) => ({
        title: `Appt with ${appt.patientName}`,
        date: appt.appointment_date,
      }));
      setCalendarEvents(formattedEvents);
    });
  }, []);

  return (
    <div className="container p-4">
      <div className="mb-4">
        <h3 className="fw-bold">Welcome, Doctor</h3>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm border-0">
            <h6>Today's Appointments</h6>
            <h4>{summary.todaysAppointments}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm border-0">
            <h6>Upcoming Appointments</h6>
            <h4>{summary.upcomingAppointments}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center shadow-sm border-0">
            <h6>Patient Queue</h6>
            <h4>{summary.patientQueue}</h4>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="card shadow-sm border-0 mb-4 p-3">
        <h5 className="mb-3 text-primary">Appointments Calendar</h5>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height={500}
        />
      </div>
    </div>
  );
};

export default DoctorDashboard;