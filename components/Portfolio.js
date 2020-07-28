import React from 'react';
import LineChart from 'react-linechart';
import {StockProfileAbout} from './StockProfile';
import {copy, makeSchoolAcronym, numberWithCommas} from '../App';
import './Portfolio.css';

class StockListItem extends React.Component{
	render(){
		const changePercent = this.props.changeAmount / this.props.initialTotal * 100;

		var changeColor = "black";
		var changeAmountText = "";
		const changePercentText=numberWithCommas(changePercent.toFixed(2))+"%";

		if(this.props.changeAmount > 0){
			changeColor="green";
			changeAmountText="$"+numberWithCommas(this.props.changeAmount.toFixed());
		}
		else if(this.props.changeAmount < 0){
			changeColor="red";
			changeAmountText="-$"+numberWithCommas(this.props.changeAmount.toFixed(2)).slice(1);
		}
		else
			changeAmountText="$"+numberWithCommas(this.props.changeAmount.toFixed());

		return(
			<tr>
				<td>
					<img src={this.props.student.pictureLink} alt="StudentPicture" style={{width:"28px", height:"28px"}}/>
				</td>
				<td>{this.props.student.name}</td>
				<td>{makeSchoolAcronym(this.props.student.school)}</td>
				<td>{this.props.student.grade+"th"}</td>
				<td>{this.props.studentStockInfo.quantity}</td>
				<td>{"$"+numberWithCommas(this.props.studentStockInfo.initPrice.toFixed())}</td>
				<td>{"$"+numberWithCommas(this.props.initialTotal)}</td>
				<td>{"$"+numberWithCommas(this.props.student.stockValueGraphPoints[this.props.student.stockValueGraphPoints.length-1].y.toFixed())}</td>
				<td style={{color:changeColor}}>{changePercentText}</td>
				<td style={{color:changeColor}}>{changeAmountText}</td>
				<td>{"$"+numberWithCommas(this.props.currentTotal)}</td>
			</tr>
		);
	}
}

class Portfolio extends React.Component{
	constructor(props){
		super(props);

		this.state={
			user: this.props.selfUser,
			users: this.props.users,
			data : [
            	{									
               		color: "black", 
                	points: this.props.selfUser.netWorthGraphPoints
            	}
        	],
        	activeGraphLengthButton:"week",
        	portfolioStocks: this.props.selfUser.portfolioStocks,
		}
	}

	handlePointHover(text){
		console.log(text.x);
		document.getElementById("portfolio-graph-length-bar-point-hover").style.visibility="visible";

		const date = text.x.split("-");
		document.getElementById("portfolio-graph-length-bar-point-hover-date").innerHTML="Date: "+date[1]+"-"+date[2]+"-"+date[0];
		document.getElementById("portfolio-graph-length-bar-point-hover-value").innerHTML="Net Worth: $"+numberWithCommas(text.y.toFixed(2));
	}

	createStockList(){
		let list = []; 
		var totalChangeAmount = 0;
		for(var i=0; i<this.state.portfolioStocks.length; i++){
			const UID = this.state.portfolioStocks[i].UID;
			for(var j=0; j<this.state.users.length; j++){ //search users list to find pointer to correct user using uid
				const user = this.state.users[j];
				
				if(user.UID === UID){
					const initialTotal = this.state.portfolioStocks[i].initPrice.toFixed() * this.state.portfolioStocks[i].quantity;
					const currentTotal = user.stockValueGraphPoints[user.stockValueGraphPoints.length-1].y.toFixed() * this.state.portfolioStocks[i].quantity;
					const changeAmount = currentTotal - initialTotal;

					totalChangeAmount = totalChangeAmount + changeAmount;

					list.push(<StockListItem studentStockInfo={this.state.portfolioStocks[i]} student={user} initialTotal={initialTotal} currentTotal={currentTotal} changeAmount={changeAmount}/>);
					break;
				}
			}
		}

		var totalChangeAmountColor = "black";
		var totalChangeAmountText = "";
		if(totalChangeAmount > 0){
			totalChangeAmountColor="green";
			totalChangeAmountText="$"+numberWithCommas(totalChangeAmount.toFixed());
		}
		else if(totalChangeAmount < 0){
			totalChangeAmountColor="red";
			totalChangeAmountText="-$"+numberWithCommas(totalChangeAmount.toFixed()).slice(1);
		}
		else{
			totalChangeAmountText="$"+numberWithCommas(totalChangeAmount.toFixed());
		}

		this.totalChangeAmountText = totalChangeAmountText;
		this.totalChangeAmountColor = totalChangeAmountColor;
		/*document.getElementById("portfolio-total-change-amount").innerText = totalChangeAmountText;
		document.getElementById("portfolio-total-change-amount").style.color = totalChangeAmountColor;*/

		return list;
	}

	render() {
		var graphData=copy(this.state.data);
		switch(this.state.activeGraphLengthButton){
			case "week":
				graphData[0].points=graphData[0].points.slice(graphData[0].points.length>=7?-7:0);
				break;
			case "month":
				graphData[0].points=graphData[0].points.slice(graphData[0].points.length>=30?-30:0);
				break;
			case "year":
				graphData[0].points=graphData[0].points.slice(graphData[0].points.length>=365?-365:0);
				break;
			default:
				break;
		}

		return (
			<div className="portfolio">
				<div className="portfolio-background">
					<div className="portfolio-about-graph-container">
						<StockProfileAbout user={this.state.user}/>
						<div className="portfolio-graph-container">
							<div className="portfolio-graph-title"> Net Worth </div>
							<div className="portfolio-graph" onMouseOut={()=>document.getElementById("portfolio-graph-length-bar-point-hover").style.visibility="hidden"}>
								<LineChart 
			                        width={600}
			                        height={320}
			                        hideXAxis={true}
			                        hideYAxis={true}
			                        isDate={true}
			                        onPointHover={(text) => this.handlePointHover(text)}
			                        data={graphData}
			                    />
							</div>
							<div className="portfolio-graph-length-bar">
								<button className={this.state.activeGraphLengthButton==="week" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"week"})}>1W</button>
								<button className={this.state.activeGraphLengthButton==="month" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"month"})}>1M</button>
								<button className={this.state.activeGraphLengthButton==="year" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"year"})}>1Y</button>
								<button className={this.state.activeGraphLengthButton==="all" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"all"})}>All</button>

								<div id="portfolio-graph-length-bar-point-hover" className="portfolio-graph-length-bar-point-hover">
									<div id="portfolio-graph-length-bar-point-hover-date">Date:</div>
									<div id="portfolio-graph-length-bar-point-hover-value">Net Worth:</div>
								</div>
							</div>
						</div>
					</div>
					<div className="portfolio-foreground">
						<table className="portfolio-stock-table">
							<tr>
								<th>Picture</th>
								<th>Name</th>
								<th>School</th>
								<th>Grade</th>
								<th>Quantity</th>
								<th>Initial Price</th>
								<th>Initial Cost</th>
								<th>Current Price</th>
								<th>Total Change (%)</th>
								<th>Total Change ($)</th>
								<th>Current Total Value</th>
							</tr>
							{this.createStockList()}

							<tr>
								<td colSpan={9}>Total</td>
								<td style={{color: this.totalChangeAmountColor}}>{this.totalChangeAmountText}</td>
								<td>{"$"+numberWithCommas(this.state.user.portfolioValue.toFixed())}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default Portfolio;