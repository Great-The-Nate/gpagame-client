import React from 'react';
import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';

import Home from './components/Home';
import StockProfile from './components/StockProfile'
import Portfolio from './components/Portfolio'
import Leaderboard from './components/Leaderboard'
import Login from './components/Login'
import Signup from './components/Signup'

export class Student{
    constructor(name, school, grade, value, changeAmount, changePercent){
        this.name = name;
        this.school = school;
        this.grade = grade;
        this.value = value;
        this.changeAmount = changeAmount;
        this.changePercent = changePercent;
    }
}

export class User{ //add networthgraphpoints, stockvaluegraphpoints, and schedule to parameters
    constructor(UID, name, school, grade, pictureLink, availableFunds, portfolioValue, portfolioStocks){
        this.UID = UID;
        this.name = name;
        this.school = school;
        this.grade = grade;
        this.pictureLink = pictureLink;

        this.netWorthGraphPoints = [{x: "2020-06-30", y: 100000}, {x: "2020-07-01", y: 70000}, {x: "2020-07-02", y: 20000}, {x: "2020-07-03", y: 60000}, {x: "2020-07-04", y: 70000}, {x: "2020-07-05", y: 90000}, {x: "2020-07-06", y: 100000}, {x: "2020-07-07", y: 110000}, {x: "2020-07-08", y: 140000}, {x: "2020-07-09", y: 90000}, {x: "2020-07-10", y: 74000}, {x: "2020-07-11", y: 105000}, {x: "2020-07-12", y: 93000}, {x: "2020-07-13", y:120000}]; 
        this.availableFunds = availableFunds;
        this.portfolioValue = portfolioValue;
        this.portfolioStocks = portfolioStocks; //UID used to find other user objects

        this.stockValueGraphPoints = [{x: "2020-06-30", y: 1000}, {x: "2020-07-01", y: 700}, {x: "2020-07-02", y: 200}, {x: "2020-07-03", y: 600}, {x: "2020-07-04", y: 700}, {x: "2020-07-05", y: 900}, {x: "2020-07-06", y: 1000}, {x: "2020-07-07", y: 1100}, {x: "2020-07-08", y: 1400}, {x: "2020-07-09", y: 900}, {x: "2020-07-10", y: 740}, {x: "2020-07-11", y: 1050}, {x: "2020-07-12", y: 930}, {x: "2020-07-13", y:1200}];
        this.schedule = ["AP Physics 1", "AP Chemisty", "AP English 3", "Physical Education", "AP Computer Science 2", "AP Calculus BC", "United States History"];

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
            new User("a1", "Andrew Lee", "Elkins High School", "12", "https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png", 40000, 80000, [{UID:"b2", quantity:15, initPrice:1000},{UID:"c3", quantity:15, initPrice:1000}]),
            new User("b2", "Arvin Sharma", "Clements High School", "12", "https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png", 20000, 70000, [{UID:"a1", quantity:10, initPrice:1400},{UID:"d4", quantity:20, initPrice:1000}]),
            new User("c3", "Amogg Venkat", "Clements High School", "12", "https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png", 5000, 45000, [{UID:"b2", quantity:10, initPrice:1000}]),
            new User("d4", "Jason Lee", "Elkins High School", "11", "https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png", 1000, 19000, [{UID:"c3", quantity:15, initPrice:1200}])
        ];
        const selfUID = "a1";
        var selfUser = users[0];
        for(const user in users)
            if(user.UID===selfUID){
                selfUser=user;
                break;
            }

        this.state={
            selfUID: selfUID,
            selfUser: selfUser,
            users: users,
        }
    }

	render(){
		return(
			<div className='app'>
		    	<Navigation />
		    	<Main state = {this.state}/>
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
        </ul>
    </nav>
);

const Main = (props) => (
    <Switch>
        <Route exact path='/' render={() => <Home selfUser={props.state.selfUser} users={props.state.users}/>} />
        <Route exact path='/portfolio' render={() => <Portfolio selfUser={props.state.selfUser} users={props.state.users}/>} />
        <Route exact path='/stock-profile' render={() => <StockProfile selfUser={props.state.selfUser}/>} />
        <Route exact path='/leaderboard' render={() => <Leaderboard selfUser={props.state.selfUser} users={props.state.users}/>} />
        <Route exact path='/login' render={() => <Login/>} />
        <Route exact path='/signup' render={() => <Signup/>} />
    </Switch>
);

export default App;