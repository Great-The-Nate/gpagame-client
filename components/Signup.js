import React from 'react';
import { NavLink } from 'react-router-dom';
import './Signup.css';

class Signup extends React.Component{
	render() {
		return (
			<div className="sign-up">
				<div className="sign-up-background">
					<div className="sign-up-foreground">
						<div className="sign-up-side-bar-title">The GPA Game</div>

						<div>Login Information</div>
						<input id="sign-up-username" type="text" placeholder="Create a Username" autoFocus/>
						<input id="sign-up-password" type="password" placeholder="Create a Password"/>
						<input id="sign-up-confirm-password" type="password" placeholder="Confirm Password"/>
						<hr style={{marginBottom: "50px"}}/>

						<div>Skyward Credentials</div>
						<input id="sign-up-skyward-username" type="text" placeholder="Enter Skyward Username"/>
						<input id="sign-up-skyward-password" type="password" placeholder="Enter Skyward Password"/>

						<hr/>
						<NavLink className="sign-up-button" to='/'>Sign Up</NavLink>
					</div>
				</div>
			</div>
		);
	}
}

export default Signup;