import React, { useState, useEffect} from "react";
import './App.css';
import './index.css';

import { useNavigate } from "react-router-dom";
export const Login = (props) => {

    //console.log("test2113", styles);

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
            <button className="linkBtn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
        </div>
    )
}









/*import React, { useState} from "react";

export const Login = (props) => {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className= "login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email"></input>
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)}type="password"  placeholder="**********" id="password" name="password"></input>
                <button>Login</button>
            </form>
            <button className= "link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
        </div>
    )
}*/