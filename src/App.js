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
    constructor(ID, UID, name, school, grade, pictureLink, netWorth, pastNetWorth, availableFunds, portfolioValue, portfolioStocks, stockValue, pastStockValue){
        this.ID = ID;
        this.UID = UID;
        this.name = name;
        this.school = school;
        this.grade = grade;
        this.pictureLink = pictureLink;

        this.netWorth = netWorth; //need
        this.pastNetWorth = pastNetWorth; //need + net Worth history
        this.netWorthGraphPoints = [{x: "2020-06-30", y: 100000}, {x: "2020-07-01", y: 70000}, {x: "2020-07-02", y: 20000}, {x: "2020-07-03", y: 60000}, {x: "2020-07-04", y: 70000}, {x: "2020-07-05", y: 90000}, {x: "2020-07-06", y: 100000}, {x: "2020-07-07", y: 110000}, {x: "2020-07-08", y: 140000}, {x: "2020-07-09", y: 90000}, {x: "2020-07-10", y: 74000}, {x: "2020-07-11", y: 105000}, {x: "2020-07-12", y: 93000}, {x: "2020-07-13", y:120000}]; 
        this.availableFunds = availableFunds;
        this.portfolioValue = portfolioValue; //need
        this.portfolioStocks = portfolioStocks;

        this.stockValue = stockValue;
        this.pastStockValue = pastStockValue; //need
        this.stockValueGraphPoints = [{x: "2020-06-30", y: 1000}, {x: "2020-07-01", y: 700}, {x: "2020-07-02", y: 200}, {x: "2020-07-03", y: 600}, {x: "2020-07-04", y: 700}, {x: "2020-07-05", y: 900}, {x: "2020-07-06", y: 1000}, {x: "2020-07-07", y: 1100}, {x: "2020-07-08", y: 1400}, {x: "2020-07-09", y: 900}, {x: "2020-07-10", y: 740}, {x: "2020-07-11", y: 1050}, {x: "2020-07-12", y: 930}, {x: "2020-07-13", y:1200}];
        this.schedule = ["AP Physics 1", "AP Chemisty", "AP English 3", "Physical Education", "AP Computer Science 2", "AP Calculus BC", "United States History"]; //need

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

        const users = [
            new User(0, "uid", "Student Name", "Student School", "Student Grade", "https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png", 120000, 140000, 40000, 80000, [{UID:"damian2", quantity:15, initPrice:1000},{UID:"damian3", quantity:15, initPrice:1000}], 100, 80),
        ];
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
        var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            //console.log("Server Response:"+xhr.responseText); //status
            if(xhr.status===200){
                const response = JSON.parse(xhr.responseText);
                const users = [];
                for(var i=0; i<response.length; i++){
                    if(response[i]["initialized"]){
                        users.push(new User(response[i]["id"], response[i]["username"], response[i]["name"], response[i]["schoolName"], response[i]["grade"], "https://cdn.discordapp.com/attachments/770520394721525760/778126032682352660/unknown.png", 10000, 10000, response[i]["availableFunds"], 0, response[i]["investments"], response[i]["stockPrice"], 80))
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

    getSelf(){
        var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            //console.log("Server Response:" + xhr.responseText)//status
            if(xhr.status===200){
                const response = JSON.parse(xhr.responseText);

                this.setState({
                    selfUID: response["username"],
                    selfUser: new User(response["id"], response["username"], response["name"], response["schoolName"], response["grade"], "https://cdn.discordapp.com/attachments/770520394721525760/778126032682352660/unknown.png", 10000, 10000, response["availableFunds"], 0, response["investments"], response["stockPrice"], 80)
                })
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
            <Route exact path='/faq' render={() => <FAQ/>} />
            <Route exact path='/login' render={() => <Login updateToken={props.updateToken} getUsers={props.getUsers} getSelf={props.getSelf}/>} />
            <Route exact path='/signup' render={() => <Signup updateToken={props.updateToken} getUsers={props.getUsers} getSelf={props.getSelf}/>} />
        </Switch>
    );
}

export default App;