import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Footer from './mainPageComponents/footer'

class AboutPage extends Component {
	
	componentDidMount() {
		window.scroll(0, 0);
	}

	render() {
		return (
			<div className="LandingPage">
				<div className="pageContent aboutContent container">
					<div className="leftSide">
						<img src="/images/ui-icon/landing/about_team.png" alt="About us" />
					</div>
					<div className="rightSide">
						<h4 className="text-gradient-blue text-center caption-title">About OneGivv</h4>
						<h5 className="subtitle m-0">
						OneGivv began with a passion to help those in need! Founded in the fall of 2017 by James Koroma and Lena Bryant, two Virginia Commonwealth University students, the company was created after they received a news notification in which millions of dollars went missing between Red Cross and an organization in Sierra Leone. James, being from Sierra Leone, felt the need to help those who suffered from the financial losses and to hold nonprofits accountable for the missing funds. In order to combat these scandals and reach those in need, the giving space called for a new kind of platform: an all-in-one, social, giving platform that could inspire and bring a higher level of transparency and efficiency to the giving space.
						</h5>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export default withRouter(
	connect(
		null,
		null,
		null,
		{
			pure: false
		}
	)(AboutPage)
)