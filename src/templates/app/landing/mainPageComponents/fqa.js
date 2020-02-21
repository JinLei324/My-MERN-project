import React, { Component } from 'react'

const fqas = [
	{question: "Why should I give with OneGivv?", answer: 'At OneGivv we place a huge emphasis on transparency. When you give with us, you can be sure that your donation is being used for good by a trustworthy nonprofit.'},
	{question: "How do I donate?", answer: 'To donate, head to our Discover page and click the tab labeled "Donations". Click on the campaign that you want to donate to and then select “donate” from the available options. You will then be directed to the payment page to complete your donation. You can also donate directly from a nonprofit’s profile by electing “Give” and then "Donate" from the available options!'},
	{question: "How do I search for nonprofits on OneGivv?", answer: 'To search for a nonprofit, go to our Discover page and then click the tab labeled "Filter." A dropdown menu will appear which you can use to search for nonprofits!'},
	{question: "Is my donation tax deductible?", answer: "All donations made through the OneGivv platform are tax deductible! We keep track of your receipts so that you are good to go come tax season."},
	{question: "When do I get my receipt?", answer: "After completing your donation, you will immediately receive a receipt on behalf of your chosen nonprofit in your email inbox and in the “My Giving” section of your profile!"},
	{question: "Why a service fee?", answer: "Great question! The service fees on our platform keep OneGivv up and running and allow us to give nonprofits 100% of your donations to nonprofits!"}
];

class FQA extends Component {
	state = {
		fqaStatus: {}
	}

	toggleFqa = (i) => {
		let fqaStatus = this.state.fqaStatus
		if (fqaStatus[i]) {
			fqaStatus[i] = !fqaStatus[i]
		}
		else {
			fqaStatus[i] = true
		}
		this.setState({ fqaStatus })
	}

	render() {
		const {
			fqaStatus
		} = this.state

		return (
			<div className="fqaWrapper">
				<h4 className="text-gradient-blue text-center caption-title">Frequently Asked Questions</h4>
				<div className="fqas">
					{fqas.map((e, i) => {
						return (
							<div className={`fqa ${fqaStatus[i] === true ? 'open' : ''}`} key={`faq-${i}`}>
								<div className="fqa-content">
									<div className="question" onClick={() => this.toggleFqa(i)}>{e.question}<img src="/images/ui-icon/close_tab_icon.svg" className="tab-close" alt="close tab" /></div>
									<div className="answer">{e.answer}</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		)
	}
}

export default FQA