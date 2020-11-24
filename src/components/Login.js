import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import './Login.css';
import 'font-awesome/css/font-awesome.min.css';
import FAQ from './FAQ';

class Login extends React.Component {
	constructor(props){
		super(props);

		this.state ={
			showFAQ: false,
		}
	}

	handleLogin(){
		var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', async () => {
          	//console.log("Server Response:" + xhr.responseText)//status
          	if(xhr.status === 200){
          		this.props.updateToken(JSON.parse(xhr.responseText)["access_token"]);
				this.props.getUsers();
				await this.props.getSelf()
				this.props.history.push({pathname: '/',})
          	}
			else
				alert("Login Failed");
        })
        xhr.open('POST', 'https://api.gpa.clearhall.dev/auth/token')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.setRequestHeader('Authorization', 'Basic ZGV2LmNsZWFyaGFsbC5ncGE6')
        xhr.send("username="+document.getElementById("login-username").value+"&password="+document.getElementById("login-password").value+"&grant_type=password")
	}

	render(){
		return (
			<div>
			{this.state.showFAQ?
				<div>
					<FAQ login={true}/>
					<div className="login-faq-close-button" onClick={()=>this.setState({showFAQ:false})}>
						<i className="fa fa-times"/>
					</div>
				</div>
			:
				<div className="login">
					<div className="login-background">
						<div className="login-faq-link" onClick={()=>{this.setState({showFAQ:true});}}>
							<i className="fa fa-info-circle"/>
						</div>

						<div className="login-foreground">
							<div className="login-title">The GPA Game</div>
							<div className="login-title-beta">Beta</div>

							<input id="login-username" type="text" placeholder="Username" autoFocus/>
							<input id="login-password"type="password" placeholder="Password" onKeyDown = {(event) => {if(event.keyCode===13)document.getElementById('login-button').click()}} />

							<button id="login-button" className="login-button" onClick={() => this.handleLogin()}>Login</button>
							<hr/>
							<NavLink className="login-sign-up-button" to='/signup'>Sign Up</NavLink>
						</div>
					</div>
				</div>
			}
			</div>
		);
	}
}

export default withRouter(Login);