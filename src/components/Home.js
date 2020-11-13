import React from 'react';
import StockProfile from './StockProfile';
import {numberWithCommas} from '../App';
import './Home.css';
import 'font-awesome/css/font-awesome.min.css';

export class MarketStock extends React.Component{
	render(){
		const width=this.props.width; 
		const student = this.props.student;

		const changeAmount= student.stockValue-student.pastStockValue;
		const changePercent= changeAmount/student.pastStockValue;

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
			<div className='market-stock' style={{width:String(width)+"px"}} onClick={this.props.onClick}>
				<img src={student.pictureLink} alt="StudentPicture" style={{width:"100px", height:"135px", marginLeft:"20px", marginTop:"20px"}}/>
				<div className="stock-info" style={{width:String(width-150)+"px"}}>
					<div className="stock-info-name">{student.name}</div>
					<div className="stock-info-school">{student.school}</div>
					<div className="stock-info-grade">{"Gr: "+student.grade}</div>

					<div className="stock-info-stats">
						<div className="stock-info-stats-value">{"$"+numberWithCommas(student.stockValue.toFixed(2))}</div>
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

		this.props.users.sort((a,b)=> (b.changePercent - a.changePercent));
		this.state={
			activeSortButton: "change",
			sortDirection: "down", //down = decreasing eg (decreasing change -> highest change at top)
			nameFilter: "",

			showStockProfile: false,
			stockProfileStudent: null,
			stockExchangeMode: "buy",
			stockExchangeAmount: "",
		};
	}

	createMarket(stockWidth){ //TODO: add key's to market items
		let market = [];
		const users = this.props.users;
		if(this.state.nameFilter===""){
			for(var i=0; i<users.length; i++)
				if(this.props.selfUser.UID !== users[i].UID)
					market.push(this.renderStock(stockWidth, users[i]));
		}
		else{
			for(var j=0; j<users.length; j++){
				const name = users[j].name.split(" ");
				const filter = this.state.nameFilter;
				if((users[j].name.toUpperCase().startsWith(filter.toUpperCase()) || name[0].toUpperCase().startsWith(filter.toUpperCase()) || name[name.length-1].toUpperCase().startsWith(filter.toUpperCase())) && this.props.selfUser.UID !== users[j].UID)
					market.push(this.renderStock(stockWidth, users[j]));
			}
		}
		return market;
	}

	renderStock(stockWidth, student){
		return <MarketStock width={stockWidth} student={student} onClick={()=>this.stockClicked(student)}/>
	}

	stockClicked(student) {
		this.setState({
			showStockProfile:true,
			stockProfileStudent: student,

			stockExchangeMode: "buy",
			stockExchangeAmount: ""
		});
	}

	getChange(user){
		return user.stockValue - user.pastStockValue;
	}

	handleStockExchangeBuyInput(evt){
		const amount = (evt.target.validity.valid) ? evt.target.value : Math.floor(this.props.selfUser.availableFunds/this.state.stockProfileStudent.stockValue);
		this.setState({stockExchangeAmount:amount});
	}
	handleStockExchangeSellInput(evt){
		const amount = (evt.target.validity.valid) ? evt.target.value : this.portfolioStockQuantity;
		this.setState({stockExchangeAmount:amount});
	}

	handleStockTrade(){
		var xhr = new XMLHttpRequest()
        xhr.addEventListener('load', async () => {
          	console.log("Server Response:" + xhr.responseText)//status
          	this.setState({stockExchangeAmount:""})
          	this.props.getUsers()
          	await this.props.getSelf()
        })
        xhr.open('POST', "https://api.gpa.clearhall.dev/trades/"+this.state.stockProfileStudent.UID+"?action="+this.state.stockExchangeMode+"&amount="+this.state.stockExchangeAmount)
        xhr.setRequestHeader('Authorization', 'Bearer '+this.props.authToken)
        xhr.send()
	}
	
	sortButtonPressed(buttonName) {
		const active = this.state.activeSortButton;
		const direction = this.state.sortDirection;
		if(active === "change"){ //currently sorting by change
			if(buttonName === "change"){ //user clicked change again
				if(direction === "down"){//switch to ascending change sort
					this.props.users.sort((a,b)=> (this.getChange(a) - this.getChange(b)));
					//(a.)
					this.setState({sortDirection:"up"});
				}
				else {//direction is up so switch to descending change sort
					this.props.users.sort((a,b)=> (this.getChange(b) - this.getChange(a)));
					this.setState({sortDirection:"down"});
				}
			}
			else if(buttonName === "price"){ //switch to descending price sort
				this.props.users.sort((a,b)=> (b.stockValue - a.stockValue));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "name"){ //switch to descending name sort
				this.props.users.sort((a,b)=> a.name.localeCompare(b.name));
				this.setState({sortDirection:"down"});
			}
		}
		else if(active === "price"){
			if(buttonName === "change"){
				this.props.users.sort((a,b)=> (this.getChange(b) - this.getChange(a)));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "price"){
				if(direction === "down"){//switch to ascending price sort
					this.props.users.sort((a,b)=> (a.stockValue - b.stockValue));
					this.setState({sortDirection:"up"});
				}
				else {
					this.props.users.sort((a,b)=> (b.stockValue - a.stockValue));
					this.setState({sortDirection:"down"});
				}
			}
			else if(buttonName === "name"){
				this.props.users.sort((a,b)=> a.name.localeCompare(b.name));
				this.setState({sortDirection:"down"});
			}
		}
		else if(active === "name"){
			if(buttonName === "change"){
				this.props.users.sort((a,b)=> (this.getChange(b) - this.getChange(a)));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "price"){
				this.props.users.sort((a,b)=> (b.stockValue - a.stockValue));
				this.setState({sortDirection:"down"});
			}
			else if(buttonName === "name"){
				if(direction === "down"){//switch to ascending price sort
					this.props.users.sort((a,b)=> b.name.localeCompare(a.name));
					this.setState({sortDirection:"up"});
				}
				else {
					this.props.users.sort((a,b)=> a.name.localeCompare(b.name));
					this.setState({sortDirection:"down"});
				}
			}
		}
		this.setState({activeSortButton: buttonName})
	}

	render(){
		//console.log(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
		const marketWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) - 196 - 30;
		var stocksPerRow =Math.floor(marketWidth/(390+30)) //minimum size of 390px
		const stockWidth = marketWidth/ stocksPerRow - 30;

		const marketGridStyle = {
			height:String(Math.ceil((this.props.users.length-1)/(stocksPerRow)) * 205 + 100)+"px",
			gridTemplateColumns: "repeat(auto-fit, "+String(stockWidth)+"px)"
		}
		/*console.log("marketWidth: "+marketWidth)
		console.log("stocks p row: "+stocksPerRow)
		console.log("stock width: "+stockWidth)
		console.log("marketheight: "+Math.ceil((this.props.users.length-1)/(stocksPerRow)) * 205)*/

		this.portfolioStockQuantity = 0;
		if(this.state.stockProfileStudent!= null)
			for(var k=0; k<this.props.selfUser.portfolioStocks.length; k++)
				if(this.props.selfUser.portfolioStocks[k]["targetUser"]["id"] === this.state.stockProfileStudent.ID)
					this.portfolioStockQuantity += this.props.selfUser.portfolioStocks[k]["shareCount"];

		return(
			<div>
			{!this.state.showStockProfile ?
				<div id="dashboard" className="dashboard">
					<div className="sorting-bar">
						<div className="sorting-bar-button-row">
							<div className={this.state.activeSortButton === "change" ? 'active' : ''} style={{width:this.state.activeSortButton==="change"? "91.55px":"76.55px", paddingLeft:this.state.activeSortButton==="change"? "0px":"10px", borderTopLeftRadius:"5px", borderBottomLeftRadius:"5px", borderLeft:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0"}}>
								<SortingBarButton text="Change" onClick={() => this.sortButtonPressed("change")}/>
							</div>
							<div className={this.state.activeSortButton === "price" ? 'active' : ''} style={{width:this.state.activeSortButton==="price"? "70px":"53.47px", paddingLeft:this.state.activeSortButton==="price"? "0px":"10px", borderLeft:"1px solid #e0e0e0", borderRight:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0"}}>
								<SortingBarButton text="Price" onClick={() => this.sortButtonPressed("price")}/>
							</div>
							<div className={this.state.activeSortButton === "name" ? 'active' : ''} style={{width:this.state.activeSortButton==="name"? "80px":"62.16px", paddingLeft:this.state.activeSortButton==="name"? "0px":"10px", borderTopRightRadius:"5px", borderBottomRightRadius:"5px", borderRight:"1px solid #e0e0e0", borderTop:"1px solid #e0e0e0", borderBottom:"1px solid #e0e0e0"}}>
								<SortingBarButton text="Name" onClick={() => this.sortButtonPressed("name")}/>
							</div>
						</div>
						<i id="sorting-bar-change-arrow" className={"fa fa-angle-"+this.state.sortDirection} style={{left: "95px", visibility:this.state.activeSortButton==="change"?"inherit":"hidden"}}/>
						<i id="sorting-bar-price-arrow" className={"fa fa-angle-"+this.state.sortDirection} style={{left: "148px", visibility:this.state.activeSortButton==="price"?"inherit":"hidden"}}/>
						<i id="sorting-bar-name-arrow" className={"fa fa-angle-"+this.state.sortDirection} style={{left: "211px", visibility:this.state.activeSortButton==="name"?"inherit":"hidden"}}/>
						<input id="sorting-bar-filter" type="text" placeholder="Filter" onInput={() => this.setState({nameFilter:document.getElementById("sorting-bar-filter").value})}/>
					</div>

					<div className="market-grid" style={marketGridStyle}>
						{this.createMarket(stockWidth)}
					</div>
				</div>
			:
				<div>
					<StockProfile selfUser={this.state.stockProfileStudent}/>
					<div className="home-stock-profile-close-button" onClick={()=>this.setState({showStockProfile:false})}>
						<i className="fa fa-times"/>
					</div>
					<div className="home-stock-profile-home-button" onClick={()=>this.setState({showStockProfile:false})}/>

					<div className="stock-exchange-panel">
						<div className="stock-exchange-mode-bar">
							<div className={this.state.stockExchangeMode==="buy"?"active":"inactive"} onClick={()=>this.setState({stockExchangeMode:"buy", stockExchangeAmount:""})} style={{borderRight: "1px solid #ddd"}}>Buy</div>
							<div className={this.state.stockExchangeMode==="sell"?"active":"inactive"} onClick={()=>this.setState({stockExchangeMode:"sell", stockExchangeAmount:""})}>Sell</div>
						</div>
						{this.state.stockExchangeMode==="buy"?
							<div style={{width: "100%"}}>
								<div className="stock-exchange-panel-info">
									<div style={{marginLeft: "10px"}}>Available Funds</div>
									<div style={{fontSize:"18px"}}>{"$"+numberWithCommas(this.props.selfUser.availableFunds.toFixed(2))}</div>
								</div>
								<input 	id="stock-exchange-stocks-to-buy" type="number" 
										min="0" max={String(Math.floor(this.props.selfUser.availableFunds/this.state.stockProfileStudent.stockValue))} 
										placeholder="Shares to Buy" onInput={this.handleStockExchangeBuyInput.bind(this)} value={this.state.stockExchangeAmount}
								/>
								<div className="stock-exchange-panel-info">
									<div style={{marginLeft: "10px"}}>Market Price</div>
									<div style={{fontSize:"18px"}}>{"$"+numberWithCommas(this.state.stockProfileStudent.stockValue.toFixed(2))}</div>
								</div>
								<div className="stock-exchange-panel-info">
									<div style={{marginLeft: "10px"}}>Total Cost</div>
									<div style={{fontSize:"18px"}}>{
										this.state.stockExchangeAmount=== "" ?
										"$0.00"
										:
										<div>{"$"+numberWithCommas((this.state.stockProfileStudent.stockValue*this.state.stockExchangeAmount).toFixed(2))}</div>	
									}</div>
								</div>

								<button className="stock-exchange-buy-button" onClick={()=>this.handleStockTrade()}><b>Buy</b></button>
							</div>
						:
							<div style={{width: "100%"}}>
								<div className="stock-exchange-panel-info">
									<div style={{marginLeft: "10px"}}>Shares Owned</div>
									<div style={{fontSize:"18px"}}>{this.portfolioStockQuantity}</div>
								</div>
								<input id="stock-exchange-stocks-to-buy" type="number"
										min="0" max={this.portfolioStockQuantity} 
										placeholder="Shares to Sell" onInput={this.handleStockExchangeSellInput.bind(this)} value={this.state.stockExchangeAmount}
								/>
								<div className="stock-exchange-panel-info">
									<div style={{marginLeft: "10px"}}>Market Price</div>
									<div style={{fontSize:"18px"}}>{"$"+numberWithCommas(this.state.stockProfileStudent.stockValue.toFixed(2))}</div>
								</div>
								<div className="stock-exchange-panel-info">
									<div style={{marginLeft: "10px"}}>Total Value</div>
									<div style={{fontSize:"18px"}}>{
										this.state.stockExchangeAmount==="" ?
										"$0.00"
										:
										<div>{"$"+numberWithCommas((this.state.stockProfileStudent.stockValue*this.state.stockExchangeAmount).toFixed(2))}</div>
									}</div>
								</div>

								<button className="stock-exchange-buy-button" onClick={()=>this.handleStockTrade()}><b>Sell</b></button>
							</div>
						}
					</div>
				</div>
			}
			</div>
		);
	}
}

class SideBarInfo extends React.Component{
	render(){
		var value= this.props.value;
		const title = this.props.title;

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
		else if(title === "Stock Value"){
			value="$"+numberWithCommas(value.toFixed(2));
		}
		else
			value="$"+numberWithCommas(value.toFixed());

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
			showEasterEgg:0
		}
	}

	render(){
		const sideBarHeight = String((window.innerHeight || document.documentElement.clientHeight|| document.body.clientHeight)-67)+"px";

		const profitLoss = this.props.user.netWorth-this.props.user.pastNetWorth
		const stockChangeAmount = this.props.user.stockValue-this.props.user.pastStockValue;
		const stockChangePercent = stockChangeAmount/this.props.user.pastStockValue;

		return (
			<div className = "side-bar" style={{height: sideBarHeight}}>
				<div style={{position:"absolute", top: "0px", left:"0px", width: "195px", height:"80px", "zIndex":"2"}} onClick={()=> {this.setState({showEasterEgg:this.state.showEasterEgg+1})}}/>
				
				<div className = "side-bar-student-name">
					<i className="fa fa-user-circle" style={{fontSize:"26px"}}></i>
					<div style={{marginLeft:"10px"}}>{
						this.state.showEasterEgg>=69?
						"Arvin Gay"
						:
						this.props.user.name
					}</div>
				</div>
				<hr/>

				<SideBarInfo value={this.props.user.netWorth} title="Net Worth" icon="fa fa-university"/>
				<SideBarInfo value={this.props.user.portfolioValue} title="Portfolio Value" icon="fa fa-folder-open-o"/>
				<SideBarInfo value={this.props.user.availableFunds} title="Available Funds" icon="fa fa-credit-card"/>
				<SideBarInfo value={profitLoss} title="Profit/Loss" icon="fa fa-line-chart"/>
				<hr/>

				<SideBarInfo value={this.props.user.stockValue} title="Stock Value" icon="fa fa-usd"/>
				<SideBarInfo value={stockChangeAmount} title="Gain/Loss ($)" icon="fa fa-bar-chart"/>
				<SideBarInfo value={stockChangePercent} title="Gain/Loss (%)" icon="fa fa-pie-chart"/>
			</div>
		);
	}
}

class Home extends React.Component{
	render(){
		return (
			<div className = "home">
				<SideBar user={this.props.selfUser}></SideBar>
				<Dashboard selfUser={this.props.selfUser} users={this.props.users} authToken={this.props.authToken} getUsers={this.props.getUsers} getSelf={this.props.getSelf}/>
			</div>
		);
	}
}

export default Home;