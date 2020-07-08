import React from 'react';
import './Home.css';
import 'font-awesome/css/font-awesome.min.css';

class Student{
	constructor(name, school, grade, value, changeAmount, changePercent){
		this.name = name;
		this.school = school;
		this.grade = grade;
		this.value = value;
		this.changeAmount = changeAmount;
		this.changePercent = changePercent;
	}
}

class MarketStock extends React.Component{
	render(){
		const width=this.props.width; 
		const changeAmount=this.props.student.changeAmount;
		const changePercent=this.props.student.changePercent;

		var changeColor="black";
		var changeText="";
		if(changeAmount>0){
			changeColor="green";
			changeText="$"+numberWithCommas(changeAmount.toFixed(2))+" ("+numberWithCommas(changePercent.toFixed(2))+"%)";
		}
		else if(changeAmount<0){
			changeColor="red";
			changeText="-$"+numberWithCommas(changeAmount.toFixed(2)).slice(1)+" (-"+numberWithCommas(changePercent.toFixed(2)).slice(1)+"%)";
		}
		else
			changeText="$"+numberWithCommas(changeAmount.toFixed(2))+" ("+numberWithCommas(changePercent.toFixed(2))+"%)";


		return(
			<div className='market-stock' style={{width:String(width)+"px"}}>
				<img src="https://cdn.discordapp.com/attachments/623245857046790159/730165576185413722/unknown.png" alt="StudentPicture" style={{width:"100px", height:"135px", marginLeft:"20px", marginTop:"20px"}}/>
				<div className="stock-info" style={{width:String(width-150)+"px"}}>
					<div className="stock-info-name">{this.props.student.name}</div>
					<div className="stock-info-school">{this.props.student.school}</div>
					<div className="stock-info-grade">{"Gr: "+this.props.student.grade}</div>

					<div className="stock-info-stats">
						<div className="stock-info-stats-value">{"$"+numberWithCommas(this.props.student.value.toFixed())}</div>
						<div className="stock-info-stats-change">
							<div className="stock-info-stats-change-numbers" style={{color:changeColor}}>{changeText}</div>
							<div className="stock-info-stats-change-past-week">past week</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class SortingBarButton extends React.Component{
	render(){
		return(
			<button className="sorting-bar-button" type="button" onClick={this.props.onClick}>{this.props.text}</button>
		);
	}
}

class Dashboard extends React.Component{

	constructor(props){
		super(props);
		this.state={
			numStocks: 3, //students array needs to be initially sorted by decreasing change
			students: [new Student("Arvin Sharma", "Clements High School", "12th", 100, 10, 1), new Student("Henry Nyugen", "Clements High School", "12th", 10, 0, 0), new Student("Arshan Aga", "Clements High School", "12th", 1, -10, -1)],
			activeSortButton: "change",
			sortDirection: "down", //down = decreasing eg (decreasing change -> highest change at top)
			nameFilter: ""
		};
	}

	createMarket(stockWidth){
		let market = [];
		if(this.state.nameFilter===""){
			for(var i=0; i<this.state.numStocks; i++){
				market.push(this.renderStock(stockWidth, this.state.students[i]));
			}
		}
		else{
			for(var i=0; i<this.state.numStocks; i++){
				const name = this.state.students[i].name.split(" ");
				const filter = this.state.nameFilter;
				if(name[0].toUpperCase().startsWith(filter.toUpperCase()) || name[1].toUpperCase().startsWith(filter.toUpperCase())){
					market.push(this.renderStock(stockWidth, this.state.students[i])); //width, name, school, grade, value, change $, change %
				}
			}
		}
		return market;
	}

	renderStock(stockWidth, student){
		return <MarketStock width={stockWidth} student={student}/>
	}

	sortButtonPressed(buttonName) {
		const active = this.state.activeSortButton;
		const direction = this.state.sortDirection;
		if(active === "change"){ //currently sorting by change
			if(buttonName === "change"){ //user clicked change again
				if(direction === "down"){//switch to ascending change sort
					this.state.students.sort((a,b)=> (a.changePercent - b.changePercent));
					this.setState({sortDirection:"up"});
				}
				else {//direction is up so switch to descending change sort
					this.state.students.sort((a,b)=> (b.changePercent - a.changePercent));
					this.setState({sortDirection:"down"});
				}
			}
			else if(buttonName === "price"){ //switch to descending price sort
				this.state.students.sort((a,b)=> (b.value - a.value));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "name"){ //switch to descending name sort
				this.state.students.sort((a,b)=> a.name.localeCompare(b.name));
				this.setState({sortDirection:"down"});
			}
		}
		else if(active === "price"){
			if(buttonName === "change"){
				this.state.students.sort((a,b)=> (b.changePercent - a.changePercent));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "price"){
				if(direction === "down"){//switch to ascending price sort
					this.state.students.sort((a,b)=> (a.value - b.value));
					this.setState({sortDirection:"up"});
				}
				else {
					this.state.students.sort((a,b)=> (b.value - a.value));
					this.setState({sortDirection:"down"});
				}
			}
			else if(buttonName === "name"){
				this.state.students.sort((a,b)=> a.name.localeCompare(b.name));
				this.setState({sortDirection:"down"});
			}
		}
		else if(active === "name"){
			if(buttonName === "change"){
				this.state.students.sort((a,b)=> (b.changePercent - a.changePercent));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "price"){
				this.state.students.sort((a,b)=> (b.value - a.value));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "name"){
				if(direction === "down"){//switch to ascending price sort
					this.state.students.sort((a,b)=> b.name.localeCompare(a.name));
					this.setState({sortDirection:"up"});
				}
				else {
					this.state.students.sort((a,b)=> a.name.localeCompare(b.name));
					this.setState({sortDirection:"down"});
				}
			}
		}
		this.setState({activeSortButton: buttonName})
	}

	render(){
		console.log(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
		const marketWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 196 - 30;
		var stocksPerRow =Math.floor(marketWidth/(390+30)) //minimum size of 390px
		const stockWidth = marketWidth/ stocksPerRow - 30;

		const marketGridStyle = {
			height:Math.ceil(this.state.numStocks/(stocksPerRow)) * 205,
			gridTemplateColumns: "repeat(auto-fit, "+String(stockWidth)+"px)"
		}

		return(
			<div className="dashboard">
				<div className="sorting-bar">
					<div className="sorting-bar-button-row">
						<div className={this.state.activeSortButton === "change" ? 'active' : ''} style={{width:this.state.activeSortButton==="change"? "91.55px":"76.55px", paddingLeft:this.state.activeSortButton==="change"? "0px":"10px", borderTopLeftRadius:"5px", borderBottomLeftRadius:"5px", borderLeft:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0"}}>
							<SortingBarButton text="Change" onClick={() => this.sortButtonPressed("change")}/>
						</div>
						<div className={this.state.activeSortButton === "price" ? 'active' : ''} style={{width:this.state.activeSortButton==="price"? "68.47px":"53.47px", paddingLeft:this.state.activeSortButton==="price"? "0px":"10px", borderLeft:"1px solid #e0e0e0", borderRight:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0"}}>
							<SortingBarButton text="Price" onClick={() => this.sortButtonPressed("price")}/>
						</div>
						<div className={this.state.activeSortButton === "name" ? 'active' : ''} style={{width:this.state.activeSortButton==="name"? "77.16px":"62.16px", paddingLeft:this.state.activeSortButton==="name"? "0px":"10px", borderTopRightRadius:"5px", borderBottomRightRadius:"5px", borderRight:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0"}}>
							<SortingBarButton text="Name" onClick={() => this.sortButtonPressed("name")}/>
						</div>
					</div>
					<i id="sorting-bar-change-arrow" className={"fa fa-angle-"+this.state.sortDirection} style={{left: "95px", visibility:this.state.activeSortButton==="change"?"visible":"hidden"}}/>
					<i id="sorting-bar-price-arrow" className={"fa fa-angle-"+this.state.sortDirection} style={{left: "160px", visibility:this.state.activeSortButton==="price"?"visible":"hidden"}}/>
					<i id="sorting-bar-name-arrow" className={"fa fa-angle-"+this.state.sortDirection} style={{left: "233px", visibility:this.state.activeSortButton==="name"?"visible":"hidden"}}/>
					<input id="sorting-bar-filter" type="text" placeholder="Filter" onInput={() => this.setState({nameFilter:document.getElementById("sorting-bar-filter").value})}/>
				</div>

				<div className="market-grid" style={marketGridStyle}>
					{this.createMarket(stockWidth)}
				</div>
			</div>
		);
	}
}

class SideBarInfo extends React.Component{
	render(){
		var value= this.props.value;
		const title = this.props.title;
		//console.log(value);

		var valueColor = "black";
		if(((title === "Profit/Loss") || (title === "Gain/Loss ($)")) && value < 0){
			valueColor="red";
			value="-$"+numberWithCommas(value.toFixed()).slice(1);
		}
		else if(((title === "Profit/Loss") || (title === "Gain/Loss ($)")) && value > 0){
			valueColor="green";
			value="$"+numberWithCommas(value.toFixed());
		}
		else if(title === "Gain/Loss (%)" && value < 0){
			valueColor="red";
			value=numberWithCommas(value.toFixed(2))+"%";
		}
		else if(title === "Gain/Loss (%)" && value > 0){
			valueColor="green";
			value=numberWithCommas(value.toFixed(2))+"%";
		}
		else{
			value="$"+numberWithCommas(value.toFixed());
		}
		const valueStyle = {
			fontSize:"22px",
			color:valueColor
		}

		return(
			<div className = "side-bar-info" style={{marginLeft:title==="Stock Value" ? "8px":"0px"}}>
				<i className={this.props.icon} style={{fontSize:"28px"}}></i>
				<div style={{marginLeft:title==="Stock Value" ? "18px" : "10px"}}>
					<div style={valueStyle}>{value}</div>
					<div style={{fontSize:"14px"}}>{title}</div>
				</div>
			</div>
		);
	}
}

class SideBar extends React.Component{
	constructor(props){
		super(props);
		this.state={
			studentName: this.props.studentName,
			netWorth: this.props.netWorth,
			portfolioValue: this.props.portfolioValue,
			buyingPower: this.props.buyingPower,
			profitLoss: this.props.profitLoss,

			stockValue: this.props.stockValue,
			stockChangeAmount: this.props.stockChangeAmount,
			stockChangePercent: this.props.stockChangePercent
		};
	}

	render(){
		return (
			<div className = "side-bar">
				<div className = "side-bar-title">GPA Stocks</div>
				<hr></hr>
				<div className = "side-bar-student-name">
					<i className="fa fa-user-circle" style={{fontSize:"26px"}}></i>
					<div style={{marginLeft:"10px"}}>{this.state.studentName}</div>
				</div>
				<hr/>

				<SideBarInfo value={this.state.netWorth} title="Net Worth" icon="fa fa-university"/>
				<SideBarInfo value={this.state.portfolioValue} title="Portfolio Value" icon="fa fa-folder-open-o"/>
				<SideBarInfo value={this.state.buyingPower} title="Available Funds" icon="fa fa-credit-card"/>
				<SideBarInfo value={this.state.profitLoss} title="Profit/Loss" icon="fa fa-line-chart"/>
				<hr/>

				<SideBarInfo value={this.state.stockValue} title="Stock Value" icon="fa fa-usd"/>
				<SideBarInfo value={this.state.stockChangeAmount} title="Gain/Loss ($)" icon="fa fa-bar-chart"/>
				<SideBarInfo value={this.state.stockChangePercent} title="Gain/Loss (%)" icon="fa fa-pie-chart"/>
			</div>
		);
	}
}

class Home extends React.Component{
	render(){
		return (
			<div className = "home">
				<SideBar studentName="John Smith" netWorth={101000} portfolioValue={81000} buyingPower={20000} profitLoss={1000} stockValue={1500} stockChangeAmount={-20} stockChangePercent={-2.0}></SideBar>
				<Dashboard/>
			</div>
		);
	}
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default Home;
//<hr width="1" size="500" border-style="inset"></hr>
//float:left;