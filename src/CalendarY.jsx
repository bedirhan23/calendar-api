import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import daygridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import Modal from "react-modal";
import axios from 'axios';
import './index.css';
import { v4 as uuidv4 } from 'uuid';
import CustomModal from "./components/CustomModal";
import DateRangePicker from "react-bootstrap-daterangepicker";


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
import { data, error, event } from "jquery";

export const MyCalendar = () => {

  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const calendarRef = useRef(null);
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState();
  const [etkinlikId, setEtkinlikId] = useState();
  const [state, setState] = useState({});
  const [confirmEvent, setConfirmEvent] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  };
  const handleAddEventClick = () => {
    toggleModal();
  };
  const handleCloseModal = () => {
    handleClose();
    setModal(false);
  };
  
  const [events, setEvents] = useState(() => {
    const storedEvents = JSON.parse(localStorage.getItem("event")) || [];
    return storedEvents;
  });

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
      //setShowForm(true);
    }
  }
  

  useEffect(() => {
    localStorage.setItem("event", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    // localStorage'dan veriyi çek
    const storedEvents = JSON.parse(localStorage.getItem("event")) || [];
    setEvents(storedEvents);

    getAllEvents();
  }, []);


  // useEffect (() => {
  //   setModal(new bootstrap)
  // })
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    // Aynı etkinlik daha önce eklenmiş mi kontrol et
    const isEventExist = events.some((event) => {
      return (
        event.title === title &&
        new Date(event.start).toISOString() === new Date(startTime).toISOString() &&
        new Date(event.end).toISOString() === new Date(endTime).toISOString()
      );
    });
  
    if (isEventExist) {
      alert("Bu etkinlik zaten eklenmiş.");
    } else {
      // Aynı etkinlik eklenmemişse yeni etkinliği ekleyin
      const newEvent = {
        id: uuidv4(),
        title: title,
        start: startTime,
        end: endTime,
      };
  
      setEvents((prevEvents) => [...prevEvents, newEvent]);
  
      setShowForm(false);
      setTitle("");
      setStartTime("");
      setEndTime("");
      console.log("submit ettim");
    }
  };
  
  
  function handleDateSelect(selectInfo){
    if(
      selectInfo.view.type === "timeGridWeek" || 
      selectInfo.view.type === "timeGridDay"
    ) {
        selectInfo.view.calendar.unselect();

        const newEvent = {
          id: uuidv4(),
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
        console.log("showForm set to true");
        //setModal(true);
        console.log("tıkladım")

        /*selectInfo.view.calendar.select();*/
    }
  }

  function handleEvents(events) {
    setCurrentEvents(events);
  }

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
  

  const handleEventClick = (clickInfo) => {
    const eventId = clickInfo.event.id;
    setState({ clickInfo, state: "update" });
    setTitle(clickInfo.event.title);
    setStart(clickInfo.event.start);
    setEnd(clickInfo.event.end);
    toggleModal();
    setEtkinlikId(eventId);
  };
  

  function handleEventResize(clickInfo) {
    // console.log(checkInfo);
    const updatedEvent = {
      id : state.clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
    }
    alert(clickInfo.event.title + " end is now " + clickInfo.event.end.toISOString());
    fetch(`http://localhost:57200/api/Calendar/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => {
        if (response.ok) {
          // Event başarıyla güncellendiğinde yerel state'i güncelle
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event
            )
          );
          console.log(`Event with ID ${updatedEvent.id} updated successfully.`);
        } else {
          console.error(`Failed to update event with ID ${updatedEvent.id}.`);
        }
        setModalIsOpen(false); // Modal'ı kapat
      })
      .catch((error) => {
        console.error(`Error updating event with ID ${updatedEvent.id}: `, error);
      });
      updateEvent(updatedEvent);

      setConfirmModal(true);

  }
  // function handleDeleteEventClick(event) {
  //   if (window.confirm(`Etkinliği silmek istediğinizden emin misiniz?`)) {
  //     deleteEventById(event.eventId);
  //   }
  // }
//   function handleEventClick(clickInfo) {

//     const eventId = clickInfo.event.id;
//     // console.log("open modal update, delete");
//     setState({ clickInfo, state: "update" });
//     // set detail
//     setTitle(clickInfo.event.title);
//     setStart(clickInfo.event.start);
//     setEnd(clickInfo.event.end);
//     deleteEventById(eventId);
//     console.log(eventId);
//     setShowForm(true);
//     setModal(true);
// }

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

  const postData = (e) => {
    const dataToSend = {
      title: title,
      start: new Date(startTime).toISOString().slice(0,-1),
      end: new Date(endTime).toISOString().slice(0,-1),
    }
    console.log("zorludeneme",dataToSend )
    fetch('http://localhost:57200/api/Calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
  }

  const deleteEventById = (event) => {
    const eventId = event.id;
    console.log("deleteEvent",eventId);
    console.log("Zorlu");
    fetch(`http://localhost:57200/api/Calendar/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })

      .then((response) => {
        console.log("response icindeyim")
        if (response.ok) {
          // If the delete request was successful, remove the event from the events state
          setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
          console.log(`Event with ID ${eventId} deleted successfully.`);
        } else {
          console.error(`Failed to delete event with ID ${eventId}.`);
        }
      })
      .catch((error) => {
        console.error(`Error deleting event with ID ${eventId}: `, error);
      });
  };
  

  const updateEvent = () => {
    const updatedEvent = {
      id: state.clickInfo.event.id, // Event ID'si değişmeden kalır
      title: title,
      start: startTime,
      end: endTime,
    };
  
    fetch(`http://localhost:57200/api/Calendar/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => {
        if (response.ok) {
          // Event başarıyla güncellendiğinde yerel state'i güncelle
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === updatedEvent.id ? updatedEvent : event
            )
          );
          console.log(`Event with ID ${updatedEvent.id} updated successfully.`);
        } else {
          console.error(`Failed to update event with ID ${updatedEvent.id}.`);
        }
        setModalIsOpen(false); // Modal'ı kapat
      })
      .catch((error) => {
        console.error(`Error updating event with ID ${updatedEvent.id}: `, error);
      });
  };
  


  const getAllEvents = () => {
    fetch('http://localhost:57200/api/Calendar', {
      method: 'GET',
      //body: JSON.stringify(dataGetAll),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then( response => response.json())
    .then(data => {
      setEvents(data);
      console.log("data", data);
    })
    .catch( error => {
      console.error('Etkinlikleri getirirken hata oluştu: ', error);
    });
  }

  const getEvent =() => {
    fetch('http://localhost:57200/api/Calendar', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then( response => response.json())
    .then(data => {
      setEvents(data);
    })
    .catch( error => {
      console.error('')
    })
  }
  //console.log(events)

  // UTC tarihini yerel saat dilimine dönüştürme

  function handleClose() {
    setTitle("");
    setStart(new Date());
    setEnd(new Date());
    setState({});
    setModal(false);
  }



 return (
    <div className="calendarForm">
      <h1>My Calendar</h1>
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
          <button type="submit" onClick={postData}>Etkinliği Ekle</button>
          <button type="button" onClick={() => {deleteEventById(state.clickInfo.event)}}> Etkinliği Sil</button>
          <button type="button" onClick={getAllEvents}>All Events</button>
          <button type= "button" onClick={updateEvent}>Etkinliği Güncelle</button>
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
        //eventResize={handleEventResize}
        //slotWidth={0.5}
        //height={'80%'}
        //windowResize={'50%'}
        //contentHeight={1000}
        //contentWidth = {50}
        //aspectRatio={1.65}
        headerToolbar={{
          start: "today prev next listDay listWeek listMonth",
          end: "dayGridMonth timeGridWeek timeGridDay",
          //left: "prev next today",
          center: "title",
        }}
        timeZone="UTC"
        locale="tr"
        plugins={[daygridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        views={{
          listDay: { buttonText: 'Day List' }, // List Day görünümü için düğme metni
          listWeek: { buttonText: 'Week List' }, // List Week görünümü için düğme metni
          listMonth: { buttonText: 'Month List' }, // List Month görünümü için düğme metni
        }}
        
      />
      <CustomModal
        title={state.state === "update" ? "Update Event" : "Add Event"}
        isOpen={modal}
        toggle={handleCloseModal}
        onCancel={handleCloseModal}
        onSubmit={state.clickInfo ? updateEvent : handleFormSubmit}
        submitText={state.clickInfo ? "Update" : "Save"}
        onDelete={() => {
          
          if (state.clickInfo){
            deleteEventById(state.clickInfo.event);
            handleCloseModal();
          }
        }}
        deleteText="Delete"
      >
        <FormGroup>
          <Label for="exampleEmail">Title</Label>
          <Input
            type="text"
            title="title"
            placeholder="with a placeholder"
            value={title}
            onChange={(e) => {setTitle(e.target.value)}}
            
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">From - End</Label>
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
        </FormGroup>

      </CustomModal>

    </div>
  );
};
