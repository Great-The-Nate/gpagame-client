import React from 'react';
import { withRouter } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import './Signup.css';

class Signup extends React.Component {
	constructor(props){
		super(props)

		this.state={
			loading: false,
			loadingPosition: 0,
		}
	}
	student = null;
	
	runWebSocket() {
		const ws = new WebSocket('wss://api.gpa.clearhall.dev/register/status')
        ws.onopen = () => {
        	console.log('connected')
        	ws.send(JSON.stringify({username:this.student["username"]}))
        }
        ws.onmessage = async (evt) => {
        	const message = JSON.parse(evt.data)
        	console.log(message)

        	if(message["status"]==="user_already_initialized"){
        		alert("Skyward Credentials Already in Use")
        		this.setState({loading: false, loadingPosition: 0})
        	}
        	else if(message["status"]==="error_logging_in"){
        		alert("Invalid Skyward Credentials")
        		this.setState({loading: false, loadingPosition: 0})
        	}

        	if(this.state.loadingPosition===4){
        		this.props.getUsers();
  				this.props.getSelf()
        		setInterval(()=>{ this.props.history.push({pathname: '/',}) }, 1000)
        	}
        	this.setState({loadingPosition: this.state.loadingPosition+1})
        }
        ws.onclose = () => {
        	console.log('disconnected')
        }
    }

	//const history = useHistory();
	handleSignUp(){
		if(document.getElementById('sign-up-username').value==="" || document.getElementById('sign-up-password').value==="" || document.getElementById('sign-up-skyward-username').value==="" || document.getElementById('sign-up-skyward-password').value==="")
			alert("Please fill in all fields")
		else if(document.getElementById("sign-up-password").value !== document.getElementById("sign-up-confirm-password").value)
			alert("Passwords don't match")

		else {
			var xhr = new XMLHttpRequest()
			xhr.addEventListener('load', () => {
			  	//console.log("Server Response:" + xhr.responseText)//status
			  	if(xhr.status === 200){
			  		const response = JSON.parse(xhr.responseText)
			  		this.student = response;
			  		this.props.updateToken(response["authorization"]["access_token"]);

			  		this.setState({loading:true, loadingPosition: 0})
			  		this.runWebSocket();
			  	}
				else
					alert("Username Already Exists");
			})
			xhr.open('POST', 'https://api.gpa.clearhall.dev/register')
			xhr.setRequestHeader('Content-Type', 'application/json')
			xhr.setRequestHeader('Authorization', 'Basic ZGV2LmNsZWFyaGFsbC5ncGE6')
			xhr.send(JSON.stringify({username:document.getElementById("sign-up-username").value, password:document.getElementById("sign-up-password").value, skywardUsername:document.getElementById("sign-up-skyward-username").value, skywardPassword:document.getElementById("sign-up-skyward-password").value}))
		}
	}

	makeLoadingList(){
		const listText = ["Creating Account", "Logging into Skyward", "Downloading Student Info", "Accessing Gradebook", "Calculating Stock Value"];
		var listItems = [];

		var i =0;
		while(i < this.state.loadingPosition){
			listItems.push(
				<div className="sign-up-loading-list-item">
					<i className="fa fa-check" style={{fontSize:"20px", marginLeft:"10px"}}/>
					<div className="sign-up-loading-list-item-text">{listText[i]}</div>
				</div>
			)
			i++;
		}
		while(i < 5){
			listItems.push(
				<div className="sign-up-loading-list-item">
					<div className="sign-up-loading-list-item-loader"/>
					<div className="sign-up-loading-list-item-text">{listText[i]}</div>
				</div>
			)
			i++;
		}
		return listItems;
	}

	render(){
		return (
			<div className="sign-up">
				<div className="sign-up-background">
					{!this.state.loading?
						<div className="sign-up-foreground">
							<div className="sign-up-side-bar-title">The GPA Game</div>

							<div>Login Information</div>
							<input id="sign-up-username" type="text" placeholder="Create a Username" autoFocus/>
							<input id="sign-up-password" type="password" placeholder="Create a Password"/>
							<input id="sign-up-confirm-password" type="password" placeholder="Confirm Password"/>
							<hr style={{marginBottom: "50px"}}/>

							<div>Skyward Credentials</div>
							<input id="sign-up-skyward-username" type="text" placeholder="Enter Skyward Username"/>
							<input id="sign-up-skyward-password" type="password" placeholder="Enter Skyward Password" onKeyDown={(event)=>{if(event.keyCode===13)document.getElementById('sign-up-button').click()}} />

							<hr/>
							<button id="sign-up-button" className="sign-up-button" onClick={() => this.handleSignUp()}>Sign Up</button>
						</div>
					:
						<div className="sign-up-loading-foreground">
							<div style={{fontSize:"24px"}}>Registering...</div>
							<hr style={{top:"10px", marginBottom:"20px"}}/>
							{this.makeLoadingList()}
						</div>
					}
				</div>
			</div>
		);
	}
}

export default withRouter(Signup);