import React, { useState, useEffect} from "react";

export const Register = (props) => {

    /*const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');*/
    const initialValues = { email: "", password: ""}; //
    const [formValues, setFormValues] = useState(initialValues); //
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
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
        if(!values.email){
            errors.email = "Email is required"
        }
        
        if(!values.password){
            errors.password = "Password is required"
        }
        return errors;
    }

    return (
        <div className="auth-form-container">
            {/*<pre>{ JSON.stringify(formValues, undefined, 2)}</pre>*/}
            <h2>Login</h2>
            
            <form className= "login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">email</label>
                <input type="text" name="email" placeholder="youremail@gmail.com" value={formValues.email} onChange={handleChange}></input>
                <p>{formErrors.email }</p>
                <label htmlFor="password">password</label>
                <input type="text" name="password" placeholder="**********" value={formValues.password} onChange={handleChange}></input>
                <p>{formErrors.password }</p>
                <button>Login</button>
            </form>
            <button className= "link-btn" onClick={() => props.onFormSwitch('login')}>Don't have an account? Register here.</button>
        </div>
    )
}