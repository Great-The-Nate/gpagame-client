import React from 'react';
import Portfolio from './Portfolio';
import {makeSchoolAcronym, numberWithCommas} from '../App';
import './Leaderboard.css';

function LeaderboardItem(props){
	const student = props.student;

	return(
		<tr onClick={props.onClick}>
			<td>{student.netWorthRank}</td>
			<td>{student.name}</td>
			<td>{makeSchoolAcronym(student.school)}</td>
			<td>{student.grade+"th"}</td>
			<td>{"$"+numberWithCommas(student.netWorth.toFixed())}</td>
		</tr>
	);
}

class Leaderboard extends React.Component{
	constructor(props){
		super(props);

		this.props.users.sort((a,b)=> (a.netWorth - b.netWorth));
		for(var i =0; i<this.props.users.length; i++){
			this.props.users[i].netWorthRank=i+1;
		}

		this.state={
			showPortfolio: false,
			showPortfolioStudent: null,
			nameFilter: "",
		}
	}

	leaderboardItemClicked(student){
		console.log(student);
		this.setState({
			showPortfolio:true,
			showPortfolioStudent: student,
		});
	}

	createLeaderboard(){
		let list = [];
		if(this.state.nameFilter===""){
			for(var i=0; i<this.props.users.length; i++){
				const student = this.props.users[i];
				list.push(<LeaderboardItem student={student} onClick={()=>this.leaderboardItemClicked(student)}/>);
			}
		}
		else{
			for(var j=0; j<this.props.users.length; j++){
				const name = this.props.users[j].name.split(" ");
				const filter = this.state.nameFilter;
				const student = this.props.users[j];
				if(this.props.users[j].name.toUpperCase().startsWith(filter.toUpperCase()) || name[0].toUpperCase().startsWith(filter.toUpperCase()) || name[name.length-1].toUpperCase().startsWith(filter.toUpperCase()))
					list.push(<LeaderboardItem student={student} onClick={()=>this.leaderboardItemClicked(student)}/>);
			}
		}

		return list;
	}

	render() {
		return (
			<div className="leaderboard">
			{!this.state.showPortfolio ?	
				<div className="leaderboard-background">
					<div className="leaderboard-foreground">
						<h2>Net Worth Leaderboard</h2>
						<p>This leaderboard shows all players ranked by their Net Worth</p>
						<input id="leaderboard-filter" type="text" placeholder="Filter" onInput={() => this.setState({nameFilter:document.getElementById("leaderboard-filter").value})}/>

						<div className="leaderboard-table-container">
							<table className="leaderboard-table">
								<tr>
									<th>Rank</th>
									<th>Name</th>
									<th>School</th>
									<th>Grade</th>
									<th style={{width: ""}}>Net Worth</th>
								</tr>
								{this.createLeaderboard()}
							</table>
						</div>
					</div>
				</div>
			:
				<div>
					<Portfolio selfUser={this.state.showPortfolioStudent} users={this.props.users} authToken={this.props.authToken}/>
					<div className="leaderboard-portfolio-close-button" onClick={()=>this.setState({showPortfolio:false})}>
						<i className="fa fa-times"/>
					</div>
				</div>		
			}	
			</div>
		);
	}
}

export default Leaderboard;