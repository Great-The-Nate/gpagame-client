import React from 'react';
import LineChart from 'react-linechart';
import './StockProfile.css';

export class StockProfileAbout extends React.Component{
	render() {
		const gainLoss = this.props.gainLoss;
		var gainLossColor="black";
		var gainLossText="";
		if(gainLoss>0){
			gainLossColor="green";
			gainLossText="$"+numberWithCommas(gainLoss.toFixed());
		}
		else if(gainLoss<0){
			gainLossColor="red";
			gainLossText="-$"+numberWithCommas(gainLoss.toFixed()).slice(1);
		}
		else
			gainLossText="$"+numberWithCommas(gainLoss.toFixed());

		return(
			<div className="stock-profile-about">
				<img src="https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png" alt="StudentPicture" style={{width:"110px", height:"140px"}}/>
				<div className="stock-profile-about-info">
					<div className="stock-profile-about-name">Arvin Sharma</div>
					<div className="stock-profile-about-info-specific">Clements High School</div>
					<div style={{textAlign: "right"}}>School</div>

					<div className="stock-profile-about-info-specific">12th</div>
					<div style={{textAlign: "right"}}>Grade</div>
				</div>
				<div className="stock-profile-about-assets-container">
					<div style={{marginTop:"10px", marginLeft:"10px", fontSize: "22px"}}>Assets</div>
					<div className="stock-profile-about-assets">
						<div className="stock-profile-about-assets-section" style={{borderRight:"1px solid #ddd"}}>
							<div className="stock-profile-about-asset" style={{borderBottom:"1px solid #ddd"}}>
								<i className="fa fa-university"/>						
								<div style={{marginLeft: "15px"}}>
									<div style={{fontSize:"20px"}}>{"$"+numberWithCommas(this.props.netWorth.toFixed())}</div>
									<div>Net Worth</div>
								</div>
							</div>
							<div className="stock-profile-about-asset">
								<i className="fa fa-credit-card"/>
								<div style={{marginLeft: "15px"}}>
									<div style={{fontSize:"20px"}}>{"$"+numberWithCommas(this.props.availableFunds.toFixed())}</div>
									<div>Available Funds</div>
								</div>
							</div>
						</div>
						<div className="stock-profile-about-assets-section">
							<div className="stock-profile-about-asset" style={{borderBottom:"1px solid #ddd"}}>
								<i className="fa fa-folder-open-o"/>
								<div style={{marginLeft: "15px"}}>
									<div style={{fontSize:"20px"}}>{"$"+numberWithCommas(this.props.portfolioValue.toFixed())}</div>
									<div>Portfolio Value</div>
								</div>
							</div>
							<div className="stock-profile-about-asset">
								<i className="fa fa-line-chart"/>
								<div style={{marginLeft: "15px"}}>
									<div style={{fontSize:"20px", color: gainLossColor}}>{gainLossText}</div>
									<div>Gain/Loss ($)</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class StockProfile extends React.Component{
	constructor(props){
		super(props);

		this.state={
			data : [
            	{									
               		color: "black", 
                	points: [{x: "2020-06-30", y: 1000}, {x: "2020-07-01", y: 700}, {x: "2020-07-02", y: 200}, {x: "2020-07-03", y: 600}, {x: "2020-07-04", y: 700}, {x: "2020-07-05", y: 900}, {x: "2020-07-06", y: 1000}, {x: "2020-07-07", y: 1100}, {x: "2020-07-08", y: 1400}, {x: "2020-07-09", y: 900}, {x: "2020-07-10", y: 740}, {x: "2020-07-11", y: 1050}, {x: "2020-07-12", y: 930}, {x: "2020-07-13", y:1200}] 
            	}
        	],
        	activeGraphLengthButton:"week"
		}
	}

	handlePointHover(text){
		console.log(text.x);
		document.getElementById("stock-profile-graph-length-bar-point-hover").style.visibility="visible";

		const date = text.x.split("-");
		document.getElementById("stock-profile-graph-length-bar-point-hover-date").innerHTML="Date: "+date[1]+"-"+date[2]+"-"+date[0];
		document.getElementById("stock-profile-graph-length-bar-point-hover-value").innerHTML="Price: $"+text.y.toFixed(2);
	}

	render() {
		const changeAmount = -10.01;
		const changePercent = -3.40;

		var changeColor = "black";
		var changeText="";
		if(changeAmount > 0){
			changeColor="green";
			changeText="$"+numberWithCommas(changeAmount.toFixed(2))+" ("+numberWithCommas(changePercent.toFixed(2))+"%)";
		}
		else if(changeAmount < 0){
			changeColor="red";
			changeText="-$"+numberWithCommas(changeAmount.toFixed(2)).slice(1)+" ("+numberWithCommas(changePercent.toFixed(2))+"%)";
		}

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
			<div className="stock-profile">
				<div className="stock-profile-background">
					<div className="stock-profile-info">
						<StockProfileAbout netWorth={100000} availableFunds={20000} portfolioValue={80000} gainLoss={1000}/>
						<div className="stock-profile-classes">
							<div style={{marginBottom: "15px"}}>Schedule</div>
							<hr/>
							<ul>
								<li>AP Physics I</li>
								<li>AP Chemisty</li>
								<li>AP English III</li>
								<li>Physical Education</li>
								<li>AP Computer Science 2</li>
								<li>AP Calculus BC</li>
								<li>United States History</li>
							</ul>
						</div>
					</div>

					<div className="stock-profile-foreground">
						<div>
							<div id="stock-profile-value" className="stock-profile-value">$1,000.01</div>
							<div className="stock-profile-change">
								<div className="stock-profile-change-numbers" style={{color:changeColor}}>{changeText}</div>
								<div className="stock-profile-change-past-week">past week</div>
							</div>
						</div>

						<div className="stock-profile-graph" onMouseOut={()=>document.getElementById("stock-profile-graph-length-bar-point-hover").style.visibility="hidden"}>
							<LineChart 
		                        width={730}
		                        height={400}
		                        hideXLabel={true}
		                        hideYLabel={true}
		                        hideXAxis={true}
		                        hideYAxis={true}
		                        isDate={true}
		                        onPointHover={(text) => this.handlePointHover(text)}
		                        data={graphData}
		                    />
						</div>
						<div className="stock-profile-graph-length-bar">
							<button className={this.state.activeGraphLengthButton==="week" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"week"})}>1W</button>
							<button className={this.state.activeGraphLengthButton==="month" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"month"})}>1M</button>
							<button className={this.state.activeGraphLengthButton==="year" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"year"})}>1Y</button>
							<button className={this.state.activeGraphLengthButton==="all" ? "active":"inactive"} onClick={()=>this.setState({activeGraphLengthButton:"all"})}>All</button>

							<div id="stock-profile-graph-length-bar-point-hover" className="stock-profile-graph-length-bar-point-hover">
								<div id="stock-profile-graph-length-bar-point-hover-date">Date:</div>
								<div id="stock-profile-graph-length-bar-point-hover-value">Price:</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function copy(aObject) {
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

export default StockProfile;