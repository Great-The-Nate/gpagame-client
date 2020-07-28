import React from 'react';
import { NavLink } from 'react-router-dom';
import './Login.css';

class Login extends React.Component{
	render() {
		return (
			<div className="login">
				<div className="login-background">
					<div className="login-foreground">
						<div className="login-title">The GPA Game</div>

						<input type="text" placeholder="Username" autoFocus/>
						<input type="password" placeholder="Password"/>

						<NavLink className="login-button" to='/'>Login</NavLink>
						<hr/>
						<NavLink className="login-sign-up-button" to='/signup'>Sign Up</NavLink>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;