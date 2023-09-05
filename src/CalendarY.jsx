import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import Modal from "react-modal";

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
  const [state, setState] = useState({});
  const [confirmEvent, setConfirmEvent] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  

  const openModal = () => {
    setModalIsOpen(true);
  };

  const handleAddEventClick = () => {
    setShowForm(true);
  };

  

  const handleFormSubmit = (e) => {
    e.preventDefault();

    //const eventsObj = [];
    const newEvent = {
      title: title,
      start: startTime,
      end: endTime,
    };

    setEvents((prevEvents)=> [...prevEvents, newEvent]);

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

        const newEvent = {
          title: title,
          start: selectInfo.start,
          end: selectInfo.end,
        }
        const eventsObj = [];
        setEvents(eventsObjasd => [...eventsObjasd, newEvent]);
        console.log(events);

        setState({ selectInfo, state: "create" });
        console.log("open modal create");
        setStart(selectInfo.start);
        setEnd(selectInfo.end);
        setShowForm(true);
        setModal(true);
    }
  }
  const handleCloseForm = () => {
    setShowForm(false);
  };


  /*function handleEventClick(clickInfo) {

    setState({ clickInfo, state: "update" });
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);

    setModal(true);
  }*/

  return (
    <div>
      <h1>My Calendar</h1>
      <button onClick={handleAddEventClick}>Etkinlik Ekle</button>
      {showForm && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-button" onClick={handleCloseForm}>
              X
            </button>
            <h2>Etkinlik Ekle</h2>
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
              {/*<button type="submit">Etkinliği Ekle</button>*/}
            </form>
          </div>
        </div>
      )}
      <FullCalendar
        editable
        selectable
        dayMaxEvents
        events={events}
        select={handleDateSelect}
        eventClick={handleAddEventClick}
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
