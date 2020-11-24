import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './FAQ.css';

function FAQ(props) {
	const listText = [
		"What is The GPA Game?", "The GPA Game is a stock simulation game where the stocks are actual students and the stock values are based on their actual grades.", 
		"How does it work?", "The GPA Game is a simplified version of a stock market. After signing up, you will be given $10,000 in virtual money and can begin investing in your classmates by buying and selling shares of their stock. As new grades roll in each day, stock values will be adjusted accordingly.",
		"How are the stock values calculated?", "Currently, stock values are calculated by averaging all the daily and major grades from the current school year with equal weighting and then scaling them. This allows for a degree of volatility in stock values and skill expression from getting good grades while maintaining a level of privacy for players.",
		"Who is included in the stock market?", "Anyone who makes a GPA Game account will have their stock added to the GPA Game market (the list of stocks you can buy shares of). Participation in the market is automatic and mandatory when an account is created to maintain competitive integrity.",
		"Who can make an account?", "At the moment, any student in Fort Bend ISD can make a GPA Game account.",
		"What data do you store?", "We store basic student information, such as your name, grade, and the school you attend, in addition to the Skyward credentials you initially provide us. We use, but do not store, your assignment grades, which are used to calculate your stock value.",
		"What's the point of The GPA Game?", "Of course this is all virtual, and therefore not real, money so there really is no point. But then again, what's the point of anything?",
		"Is The GPA Game affiliated with Fort Bend ISD in any way?", "No, this is a completely unofficial student project made for fun. :)",
		"What should I do if I find something that isn't working?", "The GPA Game is still in beta testing right now so it helps us a lot if you let us know if something isn't working so we can fix it as soon as possible.",
		"How can we contact you if we have any other questions?", "You can email us at hello@clearhall.dev or find us in the hallway at school, we’re seniors at Clements High School.",
	];


	function createList() {
		var list = [];
		for(var i =0; i<listText.length-1; i+=2)
			list.push(
				<div>
					<li>
						{listText[i]}
						<div className="faq-list-answer-container">
							<i className="fa fa-long-arrow-right" style={{fontSize:"18px", marginRight:"10px"}} aria-hidden="true"/>
							<div>{listText[i+1]}</div>
						</div>
					</li>
					<hr/>
				</div>
			);
		return list;
	}

	var zind; 
	var top;
	if(props.login){
		zind=1;
		top="0px";
	}
	else{
		zind=-1;
		top="67px";
	}

	return (
		<div className="faq" style={{zIndex: zind}}>
			<div className="faq-background" style={{top:top}}>
				<div className="faq-foreground">
					<h2>Frequently Asked Questions</h2>
					<ul>
						{createList()}
					</ul>
				</div>
			</div>
			

		</div>
	);
}

export default FAQ;