import React, { useState } from 'react';
import logo from './logo.svg';
import './index.css';
import { Login } from './Login';
import { Register} from './Registerv2';
import MyCalendar from './Calendar';
import { Route } from 'react-router-dom';

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <div className="App">
      {
        
        currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Register onFormSwitch={toggleForm}/> 
        
      }
      
    </div>
  );
}

export default App;

