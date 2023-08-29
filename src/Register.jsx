import React, { useState} from "react";
import { Router, useNavigate } from "react-router-dom";
import './App.css';
import './index.css';

export const Register = (props) => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            
            <form className= "registerForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Full name</label>
                <input value={name} name="name" placeholder="Full Name"></input>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email"></input>
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)}type="password"  placeholder="**********" id="password" name="password"></input>
                <button>Login</button>
            </form>
            <button className= "linkBtn" onClick={ () => navigate('/login')}>Already have an account? Login here.</button>
        </div>
    )
}