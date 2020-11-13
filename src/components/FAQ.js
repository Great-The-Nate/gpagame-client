import React from 'react';
import 'font-awesome/css/font-awesome.min.css';
import './FAQ.css';

function FAQ() {
	const listText = [
		"What is The GPA Game?", "The GPA Game is a stock simulation game where the stocks are actual students and the stock values are based on their actual grades.", 
		"How does it work?", "The GPA Game is a simplified version of a stock market. After signing up, you can begin investing in your classmates by buying and selling shares of their stock. As new grades roll in each day, stock values will be adjusted accordingly.",
		"How are the stock values calculated?", "We’re still experimenting with different algorithms to make the game as dynamic and fun as possible while still maintaining skill expression. Some formulas are biased towards recently entered grades while others are no more than glorified averages.",
		"Who is included in the stock market?", "Anyone who makes a GPA Game account will have their stock added to the GPA Game market (the list of stocks you can buy shares of). Participation in the market is automatic and mandatory when an account is created to prevent spam by forcing the linking of a Skyward account.",
		"Who can make an account?", "At the moment, any student in Fort Bend ISD can make a GPA Game account.",
		"What data do you store?", "We store basic student information, such as your name, grade, and the school you attend, in addition to the Skyward credentials you initially provide us. We use, but do not store, your assignment grades, which are used to calculate your stock value.",
		"What's the point of The GPA Game?", "idk man whats the point of life?",
		"Is The GPA Game affiliated with Fort Bend ISD in any way?", "No, this is a completely unofficial student project made for fun. :)",
		"How can we contact you if we have any other questions?", "You can email us at *insert gpa stocks email here* or find us in the hallway at school, we’re seniors at Clements High School.",
		//"What should I do if I find something that isn't working?", "It helps us a lot if you let us know if something isn't working so we can fix it as soon as possible. Things such as: Net Worth, the Net Worth Graph, Portfolio Values, and Schedules have not been implemented yet so we know they don't work, but if you find anything else feel free to let us know."
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

	return (
		<div className="faq">
			<div className="faq-background">
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