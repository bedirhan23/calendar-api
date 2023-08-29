import React, { useState, useEffect} from "react";
//import './App.css';
import './index.css';
import { Router, useNavigate } from "react-router-dom";
//import lockIcon from './lock-icon.svg'; // Kilidi temsil eden simge
//import userIcon from './user-icon.svg';

export const Login = (props) => {


    const navigate = useNavigate();
    const initialValues = { email: "", password: ""}; //
    const [formValues, setFormValues] = useState(initialValues); //
    const [formErrors, setFormErrors] = useState({});
    //const [isSubmit, setIsSubmit] = useState(false);
    const [isError, setIsError] = useState(false);
    /*const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }*/
    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormValues({...formValues, [name]: value});
        console.log(formValues);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);       
        if (Object.keys(errors).length === 0) {
            navigate('/Calendar');
        }
    };

    useEffect(() =>{
        console.log(formErrors);
        if(Object.keys(formErrors).length === 0){
            console.log(formValues);
        }
    }, [formErrors]);

    const validate = (values) =>{
        const errors = {}
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(!values.email){
            errors.email = "Email is required"
            
        }
        
        if(!values.password){
            errors.password = "Password is required"
            
        }
        setIsError(true);
        return errors;
    }

    return (
        <div className="authFormContainer">
          <h2>Login</h2>
    
          <form className="loginForm" onSubmit={handleSubmit}>
            <div className="label"></div>
            <label htmlFor="email">Email</label>
            <div className="input-container">
              {/*<img src={userIcon} alt="User" className="icon" />*/}
              <input
                type="text"
                name="email"
                placeholder="youremail@gmail.com"
                value={formValues.email}
                onChange={handleChange}
                className="input"
              />
            </div>
            <p>{formErrors.email}</p>
            
            <label htmlFor="password">Password</label>
            <div className="input-container">
              {/*<img src={lockIcon} alt="Lock" className="icon" />*/}
              <input
                type="password"
                name="password"
                placeholder="**********"
                value={formValues.password}
                onChange={handleChange}
                className="input"
              />
            </div>
            <p>{formErrors.password}</p>
    
            <button className="button">Login</button>
          </form>
          <button className="linkBtn" onClick={() => navigate('/register')}>           
            Don't have an account? Register here.
          </button>
        </div>
      );
    };