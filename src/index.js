import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
//import './App.css';
import reportWebVitals from './reportWebVitals';
import  {Login}  from './Login';
import  {MyCalendar}  from './Calendar';
import  {Register}  from './Registerv2';

const root = ReactDOM.createRoot(document.getElementById('root')); //ReactDOM.render yaparak düzelt
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path='/' element = {<Login />}/>
        <Route exact path='/login' element = {<Login />}/>
        <Route exact path='/calendar' element = {<MyCalendar />}/>
        <Route exact path='/register' element = {<Register />}/>


      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
