import React from 'react';
import './App.css';
import { NavLink, Switch, Route, useHistory } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';

import Home from './components/Home';
import StockProfile from './components/StockProfile'
import Portfolio from './components/Portfolio'
import Leaderboard from './components/Leaderboard'
import FAQ from './components/FAQ'
import Login from './components/Login'
import Signup from './components/Signup'

export class User{ //add networthgraphpoints, stockvaluegraphpoints, and schedule to parameters
    constructor(ID, UID, name, school, grade, pictureLink, netWorth, pastNetWorth, availableFunds, portfolioValue, portfolioStocks, stockValue, pastStockValue, schedule){
        this.ID = ID;
        this.UID = UID;
        this.name = name;
        this.school = school;
        this.grade = grade;
        this.pictureLink = pictureLink;

        this.netWorth = netWorth; //need
        this.pastNetWorth = pastNetWorth; //need + net Worth history
        this.availableFunds = availableFunds;
        this.portfolioValue = portfolioValue; //need
        this.portfolioStocks = portfolioStocks;

        this.stockValue = stockValue;
        this.pastStockValue = pastStockValue; //need

        this.schedule = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7"];
        if(schedule!=null){
            this.schedule=schedule.split(":::")
            while(this.schedule.length<7)
                this.schedule.push("Off Campus");
        }

        this.netWorthRank = 0;
    }
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function copy(aObject) {
    if (!aObject) {
        return aObject;
    }
    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
        v = aObject[k];
        bObject[k] = (typeof v === "object") ? copy(v) : v;
    }
    return bObject; 
}

export function makeSchoolAcronym(schoolName){
    const school = schoolName.split(" ");
    var str = "";
    for(var i=0; i<school.length; i++)
        str=str+school[i].substring(0,1);
    return str;
}

class App extends React.Component{
    constructor(props){
        super(props);

        const users = [new User(0, "uid", "", "", "", "", 0, 0, 0, 0, [], 0, 0)];
        this.state={
            selfUID: "",
            selfUser: users[0],
            users: users,
            authToken: null,
        }
    }

    updateToken(token){
        this.setState({authToken: token})
    }

    getUsers(){
        var req = new XMLHttpRequest()
        req.addEventListener('load', ()  => {
            //console.log(req.responseText);
            if(req.status===200){
                const netWorths = JSON.parse(req.responseText);

                var xhr = new XMLHttpRequest()
                xhr.addEventListener('load', () => {
                    //console.log("Server Response:"+xhr.responseText); //status
                    if(xhr.status===200){
                        const response = JSON.parse(xhr.responseText);
                        const users = [];
                        for(var i=0; i<response.length; i++){
                            if(response[i]["initialized"]){
                                const netWorth = netWorths[response[i]["username"]];
                                users.push(new User(response[i]["id"], response[i]["username"], response[i]["name"], response[i]["schoolName"], response[i]["grade"], "https://cdn.discordapp.com/attachments/770520394721525760/778126032682352660/unknown.png", netWorth, 10000, response[i]["availableFunds"], (netWorth-response[i]["availableFunds"]), response[i]["investments"], response[i]["stockPrice"], 80, response[i]["schedule"]))
                            }
                        }

                        //this.state.users = users;
                        users.sort((a,b)=> ((b.stockValue-b.pastStockValue)-(a.stockValue-a.pastStockValue)));
                        //console.log(users)
                        this.setState({users:users})
                    }
                })
                xhr.open('GET', 'https://api.gpa.clearhall.dev/users')
                xhr.setRequestHeader('Authorization', 'Bearer '+this.state.authToken)
                xhr.send()
            }
        })
        req.open('GET', 'https://api.gpa.clearhall.dev/worth');
        req.setRequestHeader('Authorization', 'Bearer '+this.state.authToken)
        req.send()
    }

    getSelf(){
        var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            //console.log("Server Response:" + xhr.responseText)//status
            if(xhr.status===200){
                const response = JSON.parse(xhr.responseText);

                var netWorth=10000;
                var req = new XMLHttpRequest()
                req.addEventListener('load', () => {
                    //console.log('self: '+req.responseText);
                    if(req.status===200){
                        netWorth = JSON.parse(req.responseText);

                        this.setState({
                            selfUID: response["username"],
                            selfUser: new User(response["id"], response["username"], response["name"], response["schoolName"], response["grade"], "https://cdn.discordapp.com/attachments/770520394721525760/778126032682352660/unknown.png", netWorth, 10000, response["availableFunds"], (netWorth-response["availableFunds"]), response["investments"], response["stockPrice"], 80, response["schedule"])
                        })
                    }
                })
                req.open('GET', 'https://api.gpa.clearhall.dev/worth/'+response["username"])
                req.setRequestHeader('Authorization', 'Bearer '+this.state.authToken)
                req.send()
            }
        })
        xhr.open('GET', 'https://api.gpa.clearhall.dev/me')
        xhr.setRequestHeader('Authorization', 'Bearer '+this.state.authToken)
        xhr.send()
    }

	render(){
		return(
			<div className='app'>
		    	<Navigation />
		    	<Main state = {this.state} getUsers={()=>this.getUsers()} getSelf={()=>this.getSelf()} updateToken={(token)=>this.updateToken(token)}/>
		   </div>
		);
	}
}

const Navigation = () => (
    <nav>
        <div className="game-title">The GPA Game</div>
        <hr/>
        <ul>
            <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
            <li><NavLink exact activeClassName="current" to='/portfolio'>Portfolio</NavLink></li>
            <li><NavLink exact activeClassName="current" to='/stock-profile'>Stock Profile</NavLink></li>
            <li><NavLink exact activeClassName="current" to='/leaderboard'>Leaderboard</NavLink></li>
            {/*<input type="text" placeholder="Search for users..."/>*/}

            <div className="nav-dropdown">
                <button className="nav-dropdown-button"><i className="fa fa-bars" aria-hidden="true"/></button>
                <div className="nav-dropdown-content">
                    <NavLink className="nav-dropdown-content-item" exact activeClassName="current" to='/faq'>FAQ</NavLink>
                    <div className="nav-dropdown-content-item" onClick={() => {window.location.reload(false);}}>Log Out</div>
                </div>
            </div>
        </ul>
    </nav>
);

function Main(props) {
    const history = useHistory();
    if(props.state.authToken==null)
        history.push("/login");

    return(
        <Switch>
            <Route exact path='/' render={() => <Home selfUser={props.state.selfUser} users={props.state.users} getUsers={props.getUsers} getSelf={props.getSelf} authToken={props.state.authToken}/>} />
            <Route exact path='/portfolio' render={() => <Portfolio selfUser={props.state.selfUser} users={props.state.users} authToken={props.state.authToken}/>} />
            <Route exact path='/stock-profile' render={() => <StockProfile selfUser={props.state.selfUser} authToken={props.state.authToken}/>} />
            <Route exact path='/leaderboard' render={() => <Leaderboard users={props.state.users} authToken={props.state.authToken}/>} />
            <Route exact path='/faq' render={() => <FAQ login={false}/>} />
            <Route exact path='/login' render={() => <Login updateToken={props.updateToken} getUsers={props.getUsers} getSelf={props.getSelf}/>} />
            <Route exact path='/signup' render={() => <Signup updateToken={props.updateToken} getUsers={props.getUsers} getSelf={props.getSelf}/>} />
        </Switch>
    );
}

export default App;