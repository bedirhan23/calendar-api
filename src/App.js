import React, { useState } from 'react';
import logo from './logo.svg';
import styles from './index.css';
import { Login } from './Login';
import { Register} from './Registerv2';
import MyCalendar from './Calendar';
import { Route } from 'react-router-dom';


function App() {
  const [currentForm, setCurrentForm] = useState('login');

  console.log("test23", styles);
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
    <div className={styles.app}>
      {
        //</Login onFormSwitch={toggleForm} />
        currentForm === "login" 
        
      }
      
    </div>
  );
}

export default App;

