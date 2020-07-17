import React from 'react';
import LineChart from 'react-linechart';
import {StockProfileAbout} from './StockProfile';
import './Portfolio.css';

class Portfolio extends React.Component{
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
		document.getElementById("portfolio-graph-length-bar-point-hover").style.visibility="visible";

		const date = text.x.split("-");
		document.getElementById("portfolio-graph-length-bar-point-hover-date").innerHTML="Date: "+date[1]+"-"+date[2]+"-"+date[0];
		document.getElementById("portfolio-graph-length-bar-point-hover-value").innerHTML="Net Worth: $"+text.y.toFixed(2);
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
						<StockProfileAbout netWorth={100000} availableFunds={20000} portfolioValue={80000} gainLoss={1000}/>
						<div className="portfolio-graph-container">
							<div className="portfolio-graph-title"> Net Worth </div>
							<div className="portfolio-graph" onMouseOut={()=>document.getElementById("portfolio-graph-length-bar-point-hover").style.visibility="hidden"}>
								<LineChart 
			                        width={650}
			                        height={370}
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
					</div>
				</div>
			</div>
		);
	}
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

export default Portfolio;