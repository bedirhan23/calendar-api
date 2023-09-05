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
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState();
  const [state, setState] = useState({});
  const [confirmEvent, setConfirmEvent] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  //const [click, setClickEvent] = 


  function handleDateClick(arg) {
    const clickedDate = arg.date;
    const hasEvent = events.some((event) => {
      return (
        clickedDate >= new Date(event.start) &&
        clickedDate <= new Date(event.end)
      );
    });
  
    if (hasEvent) {
      // Etkinlik varsa etkinlik güncelleme ve etkinlik silme işlemleri için gerekli kodu buraya ekleyebilirsiniz.
      // Örneğin, bir düzenleme veya silme işlemi başlatmak için bir işlev çağırabilirsiniz.
      console.log("Tıklanan tarihde etkinlik bulunuyor.");
    } else {
      // Etkinlik yoksa etkinlik ekleme işlemi için gerekli kodu buraya ekleyebilirsiniz.
      // Örneğin, etkinlik ekleme formunu açabilirsiniz.
      setShowForm(true);
    }
  }
  
  const handleAddEventClick = () => {
    setShowForm(true);
    console.log("add event click")
  };

  //console.log(startTime)

  


  const handleFormSubmit = (e) => {
    e.preventDefault();

    //const eventsObj = [];
    const newEvent = {
      id: 'hamza',
      title: title,
      start: startTime,
      end: endTime,
    };

    setEvents((prevEvents)=> [...prevEvents, newEvent]);

    setShowForm(false);
    setTitle("");
    setStartTime("");
    setEndTime("");
    console.log("submit ettim")
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
        //const eventsObj = [];
        //setEvents(eventsObjasd => [...eventsObjasd, newEvent]);
        console.log(events);

        setState({ selectInfo, state: "create" });
        console.log("open modal create");
        setStart(selectInfo.start);
        setEnd(selectInfo.end);
        console.log(selectInfo);
        setStartTime(new Date(selectInfo.start).toISOString().slice(0,-1))
        setEndTime(new Date(selectInfo.end).toISOString().slice(0,-1))
        setShowForm(true);
        setModal(true);
        console.log("tıkladım")

        /*selectInfo.view.calendar.select();*/
    }
  }
  const handleCloseForm = () => {
    setShowForm(false);
  };

  function handleEventDrop(clickInfo) {

    console.log("dropun içindeyim")
    console.log(events)
    if (clickInfo) {
      console.log(clickInfo)
      if (
        window.confirm(
          `Etkinliği silmek istediğinizden emin misiniz? '${clickInfo.event.title}'`
        )
      ) {
        const updatedEvents = events.filter((event) => {
          return event !== clickInfo.event;
        });
  
        setEvents(updatedEvents);
        setModal(false);
      }
    }
  }
  

  function handleEventClick(clickInfo) {

      // console.log("open modal update, delete");
      setState({ clickInfo, state: "update" });
      // set detail
      setTitle(clickInfo.event.title);
      setStart(clickInfo.event.start);
      setEnd(clickInfo.event.end);
      console.log("handleEventClickk")
      setShowForm(true);
      setModal(true);
  }

  /*function handleEdit() {
    // console.log(start, end);
    // state.clickInfo.event.setAllDay(true);

    state.clickInfo.event.setStart(start);
    state.clickInfo.event.setEnd(end);
    state.clickInfo.event.mutate({
      standardProps: { title }
    });
    handleClose();
  }*
  
  /*function handleDelete() {
    // console.log(JSON.stringify(state.clickInfo.event));
    // console.log(state.clickInfo.event.id);
    state.clickInfo.event.remove();
    handleClose();
  }*/

  /*function handleClose() {
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setState({});
    setModal(false);
  }*/



 return (
    <div>
      <h1>My Calendar</h1>
      {/*<button onClick={handleAddEventClick}>Etkinlik Ekle</button>*/}
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
          <button type="button" onClick={handleEventDrop}> Etkinliği Sil</button>
        </form>
      )}
      <FullCalendar
        editable
        selectable
        dayMaxEvents
        events={events}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        headerToolbar={{
          start: "today prev next",
          end: "dayGridMonth timeGridWeek timeGridDay",
          left: "prev next today",
          center: "title",
        }}
        timeZone="UTC"
        locale="tr"
        plugins={[daygridPlugin, timeGridPlugin, interactionPlugin]}
        views={["dayGridMonth", "dayGridWeek", "dayGridDay"]}
      />
    </div>
  );
};
