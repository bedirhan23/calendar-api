import React from "react";
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';
//import 'react-big-calendar/lib/css/react.big.calendar.css';

const localizer = momentLocalizer(moment);

const MyCalendar = ({ events }) => {
    return (<div className="calendar-container">
        <h2>Calendar</h2>
        <p>djgmskgnsfpgj</p>
        <Calendar
            localizer={localizer}
            events = {events}
            startAccessor="start"
            endAccessor="end"
        />
    </div>)
};

export default MyCalendar;