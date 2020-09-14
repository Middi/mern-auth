import React, { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
import Facebook from './components/Facebook';

function App() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
      Axios({
        method: "GET",
        withCredentials: true,
        url: "http://localhost:5000/user",
      }).then((res) => {
        setUser(res.data);
        console.log(res.data);
      });
  }, []);


  const register = () => {
    Axios({
      method: "POST",
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: "http://localhost:5000/register",
    })
    .then((res) => {
      console.log("registering...", res);
      setLoginUsername(registerUsername);
      setLoginPassword(registerPassword);
      login();
    });
  };

  const login = () => {
    Axios({
      method: "POST",
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:5000/login",
    })
    .then(
      (res) => {
        setUser(res.data.user);
        setMessage(res.data.message);
      }
    )
  };


  const logOut = () => {
    Axios({
      method: "GET",
      url: "http://localhost:5000/logout",
    }).then((res) => {

      setUser(null);
      console.log('removed', res);
    });
  };

  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input
          placeholder="username"
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Submit</button>
      </div>

      <div>
        <h1>Login</h1>
        <input
          placeholder="username"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>

      <div>
        <h1>Get User</h1>
        {user ? <h1>{message} {user.username}</h1> : null} 
        {/* <button onClick={facebook}>facebook</button> */}
        {/* <a href="http://localhost:3000/auth/facebook">ddddd</a> */}
        <button onClick={logOut}>Logout</button>
        <Facebook/>
      </div>
    </div>
  );
}

export default App;
