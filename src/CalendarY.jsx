import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Container
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";

export const MyCalendar = () => {

  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const calendarRef = useRef(null);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState();
  const [eventC, setCreate] = useState("");

  const handleAddEventClick = () => {
    setShowForm(true);
  };

  

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const newEvent = {
      title: title,
      start: startTime,
      end: endTime,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setShowForm(false);
    setTitle("");
    setStartTime("");
    setEndTime("");
  };

  function handleDateSelect(selectInfo){
    if(
      selectInfo.view.type === "timeGridWeek" || 
      selectInfo.view.type === "timeGridDay"
    ) {

        selectInfo.view.calendar.unselect();
        handleFormSubmit({
          preventDefault: () => {},
        });
        setStart(selectInfo.start);
        setEnd(selectInfo.end);
        setModal(true);
    }
  }

  return (
    <div>
      <h1>My Calendar</h1>
      <button onClick={handleAddEventClick}>Etkinlik Ekle</button>
      {showForm && (
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Etkinlik Başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="Başlangıç Zamanı"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="datetime-local"
            placeholder="Bitiş Zamanı"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          <button type="submit">Etkinliği Ekle</button>
        </form>
      )}
      <FullCalendar
        editable
        selectable
        dayMaxEvents
        events={events}
        select={handleDateSelect}
        //dateClick={handleDa}
        headerToolbar={{
          start: "today prev next",
          end: "dayGridMonth timeGridWeek timeGridDay",
          left: "prev next today",
          center: "title",
        }}
        plugins={[daygridPlugin, timeGridPlugin, interactionPlugin]}
        views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
      />
    </div>
  );
};
