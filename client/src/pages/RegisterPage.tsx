import Navbar from "../components/Layout/Navbar";
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [notification, setNotification] = useState("");
  
  function submitRegister(form: any) {
    form.preventDefault();
  
    if (password !== passwordCheck) {
      setNotification("Passwords do not match");
      return null;
    };

    /// some server request
    /// some way to handle it
    /// some redirect
    
  };

  return (
    <>
      <Navbar />
      <form onSubmit={ submitRegister }>
        <div>
          <label>Email:</label>
          <input 
          type="email" 
          name="email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password:</label>
          <input 
          type="password" 
          name="password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Retype Password:</label>
          <input 
          type="password" 
          name="passwordCheck"
          value = {passwordCheck}
          onChange = {(e) => setPasswordCheck(e.target.value)}
          />
        </div>

        <label>{notification}</label>

        <button type="submit">Register</button>

        <div>
          <label>Already have an account?</label>
          <Link to={"/login"}>Login</Link>
        </div>
      </form>
    </>
  );
};

export default Register;
