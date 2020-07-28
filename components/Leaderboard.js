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
			<td>{"$"+numberWithCommas(student.netWorthGraphPoints[student.netWorthGraphPoints.length-1].y.toFixed())}</td>
		</tr>
	);
}

class Leaderboard extends React.Component{
	constructor(props){
		super(props);

		const users=this.props.users;
		users.sort((a,b)=> (a.netWorthGraphPoints[a.netWorthGraphPoints.length-1].y - b.netWorthGraphPoints[b.netWorthGraphPoints.length-1].y));
		for(var i =0; i<users.length; i++){
			users[i].netWorthRank=i+1;
		}

		this.state={
			user: this.props.selfUser,
			users: this.props.users,
			showPortfolio: false,
			showPortfolioStudent: this.props.selfUser,
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
			for(var i=0; i<this.state.users.length; i++){
				const student = this.state.users[i];
				list.push(<LeaderboardItem student={student} onClick={()=>this.leaderboardItemClicked(student)}/>);
			}
		}
		else{
			for(var j=0; j<this.state.users.length; j++){
				const name = this.state.users[j].name.split(" ");
				const filter = this.state.nameFilter;
				const student = this.state.users[j];
				if(name[0].toUpperCase().startsWith(filter.toUpperCase()) || name[1].toUpperCase().startsWith(filter.toUpperCase()))
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
					<Portfolio selfUser={this.state.showPortfolioStudent} users={this.state.users}/>
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