import React, { Component } from 'react'
import LearnMore from './mainPageComponents/learn-more'
import FQA from './mainPageComponents/fqa'
import Footer from './mainPageComponents/footer'

class LearnMorePage extends Component {
	render() {
		return (
			<div className="LandingPage">
				<div className="container">
					<LearnMore />
					<div className="separator-50" />
					<FQA />
				</div>
				<Footer />
			</div>
		)
	}
}

export default LearnMorePage