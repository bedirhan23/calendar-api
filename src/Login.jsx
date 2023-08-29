import React, { useState, useEffect} from "react";
//import './App.css';
import './index.css';
import { Router, useNavigate } from "react-router-dom";

export const Login = (props) => {


    const navigate = useNavigate();
    const initialValues = { email: "", password: ""}; //
    const [formValues, setFormValues] = useState(initialValues); //
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
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
        setFormErrors(validate(formValues));
        setIsSubmit(true);
        if (isError)
             navigate('/Calendar');
    };

    const handlePasswordChange = (e) => {

    }

    useEffect(() =>{
        console.log(formErrors);
        if(Object.keys(formErrors).length === 0 && isSubmit){
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
            {/*<pre>{ JSON.stringify(formValues, undefined, 2)}</pre>*/}
            <h2>Login</h2>
            
            <form className="loginForm" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input type="text" name="email" placeholder="youremail@gmail.com" value={formValues.email} onChange={handleChange}></input>
                <p>{formErrors.email }</p>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" placeholder="**********" value={formValues.password} onChange={handleChange}></input>
                
                <p>{formErrors.password }</p>
                <button>Login</button> 
                {/* <button onClick={() => navigate('/calendar')}>Go to Calendar</button> */}

            </form>
            <button className="linkBtn" onClick={() => navigate('/register')}>Don't have an account? Register here.</button>
        </div>
    )
}