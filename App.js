import React from 'react';
import './App.css';
import { NavLink, Switch, Route } from 'react-router-dom';
import Home from './components/Home';

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
    <ul>
      <li><NavLink exact activeClassName="current" to='/'>Home</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/portfolio'>Portfolio</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/stock-profile'>Stock Profile</NavLink></li>
      <li><NavLink exact activeClassName="current" to='/leaderboard'>Leaderboard</NavLink></li>

      <input type="text" placeholder="Search for users..."/>
    </ul>
  </nav>
);

const About = () => (
  <div className='about'>
    <h1>About Me</h1>
    <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
    <p>Ipsum dolor dolorem consectetur est velit fugiat. Dolorem provident corporis fuga saepe distinctio ipsam? Et quos harum excepturi dolorum molestias?</p>
  </div>
);

const Contact = () => (
  <div className='contact'>
    <h1>Contact Me</h1>
    <p>You can reach me via email: <strong>hello@example.com</strong></p>
  </div>
);

const Main = () => (
  <Switch>
    <Route exact path='/' component={Home}></Route>
    <Route exact path='/portfolio' component={About}></Route>
    <Route exact path='/stock-profile' component={Contact}></Route>
    <Route exact path='/leaderboard' component={Contact}></Route>
    <Route exact path='/login' component={Contact}></Route>
  </Switch>
);

export default App;