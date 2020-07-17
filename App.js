import React from 'react';
import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import StockProfile from './components/StockProfile'
import Portfolio from './components/Portfolio'
import Leaderboard from './components/Leaderboard'
import Login from './components/Login'
import Signup from './components/Signup'

class App extends React.Component{
	render(){
		return(
			<div className='app'>
		    	<Navigation />
		    	<Main />
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

      <input type="text" placeholder="Search for users..."/>
    </ul>
  </nav>
);

const Main = () => (
  <Switch>
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/portfolio' component={Portfolio}></Route>
    <Route exact path='/stock-profile' component={StockProfile}></Route>
    <Route exact path='/leaderboard' component={Leaderboard}></Route>
    <Route exact path='/login' component={Login}></Route>
    <Route exact path='/signup' component={Signup}></Route>
  </Switch>
);

export default App;