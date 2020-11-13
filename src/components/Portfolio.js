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
			changeAmountText="$"+numberWithCommas(this.props.changeAmount.toFixed(2));
		}
		else if(this.props.changeAmount < 0){
			changeColor="red";
			changeAmountText="-$"+numberWithCommas(this.props.changeAmount.toFixed(2)).slice(1);
		}
		else
			changeAmountText="$"+numberWithCommas(this.props.changeAmount.toFixed(2));

		return(
			<tr>
				<td>
					<img src={this.props.student.pictureLink} alt="StudentPicture" style={{width:"28px", height:"28px"}}/>
				</td>
				<td>{this.props.student.name}</td>
				<td>{makeSchoolAcronym(this.props.student.school)}</td>
				<td>{this.props.student.grade+"th"}</td>
				<td>{this.props.studentStockInfo["shareCount"]}</td>
				<td>{"$"+numberWithCommas(this.props.studentStockInfo["stockPriceWhenBought"].toFixed(2))}</td>
				<td>{"$"+numberWithCommas(this.props.initialTotal)}</td>
				<td>{"$"+numberWithCommas(this.props.student.stockValue.toFixed(2))}</td>
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

		const netWorthHistory = new Array();

		var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', () => {
            console.log("Server Response:"+xhr.responseText); //status
            if(xhr.status===200){
            	const response = JSON.parse(xhr.responseText)
            	for(var i=0; i<response.length; i++)
            		netWorthHistory.push({x:response[i]["time"].slice(0,10),y:response[i]["stockPrice"]})

            	this.setState({netWorthHistory: netWorthHistory})
            }
        })
        xhr.open('GET', 'https://api.gpa.clearhall.dev/history')
        xhr.setRequestHeader('Authorization', 'Bearer '+this.props.authToken)
        xhr.send()

		this.state={
        	activeGraphLengthButton:"week",
        	netWorthHistory: netWorthHistory,
		}
	}

	handlePointHover(text){
		//console.log(text.x);
		document.getElementById("portfolio-graph-length-bar-point-hover").style.visibility="visible";

		const date = text.x.split("-");
		document.getElementById("portfolio-graph-length-bar-point-hover-date").innerHTML="Date: "+date[1]+"-"+date[2]+"-"+date[0];
		document.getElementById("portfolio-graph-length-bar-point-hover-value").innerHTML="Net Worth: $"+numberWithCommas(text.y.toFixed(2));
	}

	createStockList(){ //TODO: OPTIMIZE
		let list = []; 
		var totalChangeAmount = 0;
		for(var i=0; i<this.props.selfUser.portfolioStocks.length; i++){
			const ID = this.props.selfUser.portfolioStocks[i]["targetUser"]["id"];
			for(var j=0; j<this.props.users.length; j++){ //search users list to find pointer to correct user using uid
				
				if(this.props.users[j].ID === ID){
					const user = this.props.users[j];

					const initialTotal = (this.props.selfUser.portfolioStocks[i]["stockPriceWhenBought"] * this.props.selfUser.portfolioStocks[i]["shareCount"]).toFixed(2);
					const currentTotal = (user.stockValue * this.props.selfUser.portfolioStocks[i]["shareCount"]).toFixed(2);
					const changeAmount = currentTotal - initialTotal;

					totalChangeAmount = totalChangeAmount + changeAmount;

					list.push(<StockListItem studentStockInfo={this.props.selfUser.portfolioStocks[i]} student={user} initialTotal={initialTotal} currentTotal={currentTotal} changeAmount={changeAmount}/>);
					break;
				}
			}
		}

		var totalChangeAmountColor = "black";
		var totalChangeAmountText = "";
		if(totalChangeAmount > 0){
			totalChangeAmountColor="green";
			totalChangeAmountText="$"+numberWithCommas(totalChangeAmount.toFixed(2));
		}
		else if(totalChangeAmount < 0){
			totalChangeAmountColor="red";
			totalChangeAmountText="-$"+numberWithCommas(totalChangeAmount.toFixed(2)).slice(1);
		}
		else{
			totalChangeAmountText="$"+numberWithCommas(totalChangeAmount.toFixed(2));
		}

		this.totalChangeAmountText = totalChangeAmountText;
		this.totalChangeAmountColor = totalChangeAmountColor;
		/*document.getElementById("portfolio-total-change-amount").innerText = totalChangeAmountText;
		document.getElementById("portfolio-total-change-amount").style.color = totalChangeAmountColor;*/

		return list;
	}

	render() {
		const stockGraphData = [{
			color: "black",
			points: this.state.netWorthHistory
		}]

		var graphData=copy(stockGraphData);
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
						<StockProfileAbout user={this.props.selfUser}/>
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
								<td>{"$"+numberWithCommas(this.props.selfUser.portfolioValue.toFixed(2))}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		);
	}
}

export default Portfolio;