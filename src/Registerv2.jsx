import React, { useState, useEffect} from "react";
import { Router, useNavigate } from "react-router-dom";
//import './App.css';
import './index.css';

export const Register = (props) => {

    /*const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');*/
    const navigate = useNavigate();
    const initialValues = {fullname: "", email: "", password: ""}; //
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
        if (isError){
            navigate('/login')
        } 
    };

    useEffect(() =>{
        console.log(formErrors);
        if(Object.keys(formErrors).length === 0 && isSubmit){
            console.log(formValues);
        }
    }, [formErrors]);

    const validate = (values) =>{
        const errors = {}
        const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if (!values.fullname){
            errors.fullname = "Email is required"
        }
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
            <h2>Register</h2>
            
            <form className= "registerForm" onSubmit={handleSubmit}>
                <label htmlFor="fullName">Full Name</label>
                <div className="input-container">
                {/*<img src={userIcon} alt="User" className="icon" />*/}
                <input
                    type="text"
                    name="fullName"
                    placeholder="Your Name"
                    value={formValues.fullname}
                    onChange={handleChange}
                    className="input"
                />
                </div>
                <p>{formErrors.fullname}</p>

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
                {/*<img src={userIcon} alt="User" className="icon" />*/}
                <input
                    type="text"
                    name="password"
                    placeholder="************"
                    value={formValues.password}
                    onChange={handleChange}
                    className="input"
                />
                </div>
                <p>{formErrors.email}</p>
                <button className="button">Register</button>
            </form>
            <button className= "linkBtn" onClick={() => navigate('/login')}>Already have an account? Login here.</button>
        </div>
    )
}