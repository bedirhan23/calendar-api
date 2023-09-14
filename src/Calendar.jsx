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
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateIcon from "@mui/icons-material/Update";



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
  const [endTime, setEndTime] =  useState(new Date());
  const [etkinlikId, setEtkinlikId] = useState(uuidv4());//uuidv4 parametre olarak verdim
  const [state, setState] = useState({clickInfo: {event: null}});
  const [confirmEvent, setConfirmEvent] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [resizingEvent, setResizingEvent] = useState(null);
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


  // useEffect(() => {
  //   if(state.clickInfo.event){
  //     handleEventResize(state.clickInfo.event);
  //   }
  // }, [state.clickInfo.event]);
  
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
        start: new Date(startTime),
        end: new Date(endTime),
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
        console.log("handleDateSelect",events);

        setState({ selectInfo, state: "create" });
        console.log("open modal create");
        setStart(selectInfo.start);
        setEnd(selectInfo.end);
        console.log("selectInfo: handleDateSelect",selectInfo);
        setStartTime(new Date(selectInfo.start).toISOString().slice(0,-1))
        setEndTime(new Date(selectInfo.end).toISOString().slice(0,-1))
        console.log("after", selectInfo)
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

  function fixTimes(){

  }

  function handleEventDrop(dropInfo) {
    const updatedEvent = {
      id: dropInfo.event.id,
      title: dropInfo.event.title,
      start: dropInfo.event.start,
      end: dropInfo.event.end,
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
          getAllEvents();
        } else {
          console.error(`Failed to update event with ID ${updatedEvent.id}.`);
        }
        // Modal'ı kapatmak istemiyorsanız aşağıdaki satırı kaldırabilirsiniz.
        setModal(false);
      })
      .catch((error) => {
        console.error(`Error updating event with ID ${updatedEvent.id}: `, error);
      });
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
  
  // const handleEventResize = (eventInfo) => {
  //   console.log("Click Info Event:", state.clickInfo.event);

  //   if (!eventInfo) {
  //     console.error("Event info is undefined.");
  //     return;
  //   }

  //   const eventId = eventInfo.id;

  //   const updatedEvent = {
  //     id : eventId,
  //     start : eventInfo.start,
  //     end: eventInfo.end
  //   };

  //   updateEvent(updatedEvent);
  // };

  function handleEventResizeStart(resizeInfo) {
    setResizingEvent(resizeInfo.event);
  }
  
  function handleEventResizeStop() {
    setResizingEvent(null);
  }




  function handleEventResize(event) {
    if (resizingEvent) {
      // Etkinlik yeniden boyutlandırma işlemi burada gerçekleştirilir
      const updatedEvent = {
        id: resizingEvent.id,
        title: resizingEvent.title,
        start: event.start,
        end: event.end,
      };
  
      // Daha sonra güncellenmiş etkinliği sunucuya gönderme işlemi burada yapılır
  
      // resizingEvent'i sıfırlayın
      setResizingEvent(null);
    }
  }
  

  const postData = (e) => {


    
    let newStart = new Date(startTime).setHours(new Date(startTime).getHours() + 3);
    new Date(startTime).setMinutes( new Date(startTime).getMinutes());
    console.log("upd start time", new Date(newStart));
    let newEnd = new Date(endTime).setHours(new Date(endTime).getHours() + 3);
    new Date(endTime).setMinutes(new Date(endTime).getMinutes());
    console.log("upd end time", endTime);

    const dataToSend = {
      title: title,
      start: new Date(newStart),
      end: new Date(newEnd),
    }
    console.log("postData",dataToSend )
    fetch('http://localhost:57200/api/Calendar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })

    .then((response) => {
      console.log("response icindeyim")
      if (response.ok){
        console.log("Etkinlik başarıyla oluşturuldu.");
        getAllEvents();

      } else {
        console.error("Etkinlik oluşturulurken hata oldu.");
      }
    })
    .catch((error) => {
      console.error('Error adding new event');
    });
  };

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
          getAllEvents();
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
      start: new Date(startTime + 'Z').toISOString(),
      end: new Date(endTime + 'Z').toISOString(),
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
          getAllEvents();
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
      const correctedEvents = data.map((event) => {
        return {
          ...event,
          start: new Date(event.start + 'Z'),
          end: new Date(event.end + 'Z'),
        };
      });
      setEvents(correctedEvents);
      console.log("data", correctedEvents);
    })
    .catch( error => {
      console.error('Etkinlikleri getirirken hata oluştu: ', error);
    });
    console.log("GET ALL EVENTS GELDİİİİİ");
  };

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

      <h1 >&nbsp;My Calendar</h1>
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
          <IconButton type="submit" onClick={postData}><AddIcon /></IconButton>
          <IconButton type="button" onClick={() => {deleteEventById(state.clickInfo.event)}}><DeleteIcon /></IconButton>
          {/* <button type="button" onClick={getAllEvents}>All Events</button> */}
          <IconButton type= "button" onClick={updateEvent}> <UpdateIcon /></IconButton>
        </form>
      )}
      <FullCalendar
        timeZone="UTC"
        locale="tr"
        editable
        selectable
        dayMaxEvents
        eventDisplay="block"
        events={events}
        eventColor="#74481c"
        eventBorderColor= "black"
        eventTextColor="white"
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        
        eventResizeStart={handleEventResizeStart}
        eventResizeStop={handleEventResizeStop}
        //eventResize={handleEventResize}
        eventResize={handleEventResize}
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

        buttonText={{
          today:"today",
          month: "month",
          week: "week",
          day: "day",
        }}

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
