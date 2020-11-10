import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import './Login.css';

function Login(props) {
	const history = useHistory();

	function handleLogin(){
		var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', async () => {
          	console.log("Server Response:" + xhr.responseText)//status
          	if(xhr.status === 200){
          		props.updateToken(JSON.parse(xhr.responseText)["access_token"]);
				props.getUsers();
				await props.getSelf()
				history.push("/");
          	}
			else
				alert("Login Failed");
        })
        xhr.open('POST', 'https://ac6d2ac0af5f.ngrok.io/auth/token')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.setRequestHeader('Authorization', 'Basic Y29tLmxvY2FsLnRlc3Q6')
        xhr.send("username="+document.getElementById("login-username").innerHTML+"&password="+document.getElementById("login-password").innerHTML+"&grant_type=password")
	}

	return (
		<div className="login">
			<div className="login-background">
				<div className="login-foreground">
					<div className="login-title">The GPA Game</div>

					<input id="login-username" type="text" placeholder="Username" autoFocus/>
					<input id="login-password"type="password" placeholder="Password"/>

					<button className="login-button" onClick={handleLogin}>Login</button>
					<hr/>
					<NavLink className="login-sign-up-button" to='/signup'>Sign Up</NavLink>
				</div>
			</div>
		</div>
	);
}

export default Login;