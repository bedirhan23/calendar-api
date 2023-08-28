import React, { useState, useEffect} from "react";

const { dateFnsLocalizer, Calendar } = require("react-big-calendar")


const locales = {

    "tr-TR": require("date-fns/locale/tr-TR")
}

const localizer = dateFnsLocalizer{

    format,
    parse,
    startOfWeek,
    getDay,
    locales
}

const eventsX = [
    {
        title: "Meeting",
        allDay: true, 
        start: new Date(2023, 8, 2),
        end: new Date (2023, 8, 2)
    },
    {
        title: "Vacation",
        allDay: true, 
        start: new Date(2023, 8, 4),
        end: new Date (2023, 8, 3)
    },
    {
        title: "Conference",
        allDay: true, 
        start: new Date(2023, 8, 5),
        end: new Date (2023, 8, 5)
    }

]

function Application(){
    <Calendar localizer={ localizer} events={eventsX} 
    startAccessor="start" endAccessor= "end" style={{height: 500, margin: "50px"}};

    const [newEvent, setNewEvent] = useState({title: "", start: "", end: ""})
    const [allEvents, setAllEvents] = useState(events)
    return (
        <div className="Application">
            <Calendar
                localizer={localizer}
                events={allEvents}
                startAccessor= "start"
                endAccessor= "end"
                style={{height: 500, margin: "50px"}}
        </div>
    )
}