import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import NewFooter from '../mainPageComponents/NewFooter';

class NewAboutPage extends Component {
	
	componentDidMount() {
        // document.querySelector('html').scrollTop = 0;
        
		window.renderParallaxWindow();
	}

	render() {
		return (
			<div className="page-about">
				<div className="header-description parallax-window" style={{backgroundImage: `url("/images/ui-icon/back/about.jpg")`}}>
                    <div className="cn" data-depth="0.2">
                        <div className="header-description__content">
                            <h1 className="header-description__title">About OneGivv</h1>
                        </div>
                    </div>
                </div>
                <div className="b-indent page-about-section">
                    <div className="cn">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <h2>OneGivv <small>began </small>
                                    <span>with a passion to</span>
                                    <span className="t-medium">&nbsp;help those</span> <span>in need!</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="cn">
                        <div className="b-indent-left"></div>
                        <div className="b-indent-right page-about__content">
                            <p>Founded in the fall of 2017 by James Koroma and Lena Bryant, two Virginia Commonwealth University students. <br />The company was created after they received a news notification in which millions of dollars went missing between Red Cross and an organization in Sierra Leone. James, being from Sierra Leone, felt the need to help those who suffered from the financial losses and to hold nonprofits accountable for the missing funds.</p>
                            <p>In order to combat these scandals and reach those in need, the giving space called for a new kind of platform: an all-in-one, social, giving platform that could inspire and bring a higher level of transparency and efficiency to the giving space!</p>
                        </div>
                    </div>
                </div>
				<NewFooter />
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
	)(NewAboutPage)
)