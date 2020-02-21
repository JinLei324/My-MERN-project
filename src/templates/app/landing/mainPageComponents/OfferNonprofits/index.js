import React, { Component } from 'react';
import { connect } from 'react-redux';
import Card from '../../../../common/Card';

class OfferNonprofits extends Component {
	state = {
	}

	render() {
		return (
			<div className='offer-nonprofits section'>
				<p className='title'>What we offer for nonprofits</p>
				<div className='main'>
					<div className='desktop-view'>
						<div className='each'>
							<Card noBorder className='each-card'>
								<div className='header giving-platform'>
									<div><img alt='giving_platform' src='/images/ui-icon/nonprofit/giving_platform.svg' /></div>
									<p>Giving Platform</p>
								</div>
								<div className='body'>
									<p>Create donation projects, Volunteer projects for your organization and post the items your nonprofit needs.</p>
								</div>
							</Card>
							<Card noBorder className='each-card'>
								<div className='header social-media-features'>
									<div><img alt='social_media_features' src='/images/ui-icon/nonprofit/social_media_features.svg' /></div>
									<p>Social Media Features</p>
								</div>
								<div className='body'>
									<p>Keep your donors updated through post and updates. Others can like, comment, and share your posts!</p>
								</div>
							</Card>
						</div>
						<div className='each'>
							<div>
								<img alt='offer_nonprofits_banner' src='/images/ui-icon/nonprofit/offer_nonprofits_banner.svg' />
							</div>
						</div>
						<div className='each'>
							<Card noBorder className='each-card'>
								<div className='header volunteer-management'>
									<div><img alt='volunteer_management' src='/images/ui-icon/nonprofit/volunteer_management.svg' /></div>
									<p>Volunteer Management</p>
								</div>
								<div className='body'>
									<p>Manage volunteers  for your organization, get confirmation and know who is coming, track volunteer hours and more all in one place!</p>
								</div>
							</Card>
							<Card noBorder className='each-card'>
								<div className='header basic-donor-analytics'>
									<div><img alt='basic_donor_analytics' src='/images/ui-icon/nonprofit/basic_donor_analytics.svg' /></div>
									<p>Basic Donor Analytics</p>
								</div>
								<div className='body'>
									<p>Manage and track all of your donor giving and access their donor analytics.</p>
								</div>
							</Card>
						</div>
					</div>

					<div className='mobile-view'>
						<div>
							<img alt='offer_nonprofits_banner' src='/images/ui-icon/nonprofit/offer_nonprofits_banner.svg' />
						</div>
						<Card noBorder className='each-card'>
							<div className='header giving-platform'>
								<div><img alt='giving_platform' src='/images/ui-icon/nonprofit/giving_platform.svg' /></div>
								<p>Giving Platform</p>
							</div>
							<div className='body'>
								<p>Create donation projects, Volunteer projects for your organization and post the items your nonprofit needs.</p>
							</div>
						</Card>
						<Card noBorder className='each-card'>
							<div className='header social-media-features'>
								<div><img alt='social_media_features' src='/images/ui-icon/nonprofit/social_media_features.svg' /></div>
								<p>Social Media Features</p>
							</div>
							<div className='body'>
								<p>Keep your donors updated through post and updates. Others can like, comment, and share your posts!</p>
							</div>
						</Card>
						<Card noBorder className='each-card'>
							<div className='header volunteer-management'>
								<div><img alt='volunteer_management' src='/images/ui-icon/nonprofit/volunteer_management.svg' /></div>
								<p>Volunteer Management</p>
							</div>
							<div className='body'>
								<p>Manage volunteers  for your organization, get confirmation and know who is coming, track volunteer hours and more all in one place!</p>
							</div>
						</Card>
						<Card noBorder className='each-card'>
							<div className='header basic-donor-analytics'>
								<div><img alt='basic_donor_analytics' src='/images/ui-icon/nonprofit/basic_donor_analytics.svg' /></div>
								<p>Basic Donor Analytics</p>
							</div>
							<div className='body'>
								<p>Manage and track all of your donor giving and access their donor analytics.</p>
							</div>
						</Card>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	userId: state.authentication.userId,
	user: state.authentication.user
})

export default connect(
	mapStateToProps,
	null
)(OfferNonprofits)
