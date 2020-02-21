import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import DashIconButton from '../DashIconButton';
import {
	unreadProjects
} from '../../../helpers/websocket';

class DashHeader extends Component {

	componentDidMount() {
	}

	render() {
		let { user, type } = this.props; 
		
		switch (type) {
			case 0:
				return (
					<div className="row CompainContainer">
						{/* <span className='DashboardHeader'>Welcome to Back&nbsp;<span className='DashCompanyName'>{user.fullName}</span></span> */}
						<span className='DashboardHeader'>Welcome to Dashboard</span>
						<div className='DashNavContainer' >
							<NavLink to={`/${user ? user._id : ''}/campaigns/donations`} className="nav-link DashNavLink">
								<DashIconButton label="Donations" icon="/images/ui-icon/campaign-donations.svg" size="36px" fontSize="15px" />
								{user.unreadDonations > 0 && (<span className='UnreadBadge'>{user.unreadDonations}</span>)}
							</NavLink>
							<NavLink to={`/${user ? user._id : ''}/campaigns/volunteer`} className="nav-link DashNavLink">
								<DashIconButton label="Volunteer" icon="/images/ui-icon/campaign-volunteer.svg" size="36px" fontSize="15px" />
								{user.unreadVolunteers > 0 && (<span className='UnreadBadge'>{user.unreadVolunteers}</span>)}
							</NavLink>
							<NavLink to={`/${user ? user._id : ''}/campaigns/pickup`} className="nav-link DashNavLink">
								<DashIconButton label="Pickup" icon="/images/ui-icon/campaign-pickup.svg" size="36px" fontSize="15px" />
								{user.unreadPickups > 0 && (<span className='UnreadBadge'>{user.unreadPickups}</span>)}
							</NavLink>
							<NavLink to={`/${user ? user._id : ''}/contacts`} className="nav-link DashNavLink">
								<DashIconButton label="Contacts" icon="/images/ui-icon/dashboard-contacts.svg" size="36px" fontSize="15px" />
							</NavLink>
						</div> 
					</div>
				)
			case 1:
				return (
					<div className="row CompainContainer">
						<h2>Welcome to Back&nbsp;<span className='DashCompanyName'>{user.fullName}</span></h2>						
						<div className='DashNavContainer'>
							<NavLink to={`/${user ? user._id : ''}/campaigns/donations`} className="nav-link DashNavLink">
								<DashIconButton label="Donations" icon="/images/ui-icon/campaign-donations.svg" size="36px" fontSize="15px" />
								{user.unreadDonations > 0 && (<span className='UnreadBadge'>{user.unreadDonations}</span>)}
							</NavLink>
							<NavLink to={`/${user ? user._id : ''}/campaigns/volunteer`} className="nav-link DashNavLink">
								<DashIconButton label="Volunteer" icon="/images/ui-icon/campaign-volunteer.svg" size="36px" fontSize="15px" />
								{user.unreadVolunteers > 0 && (<span className='UnreadBadge'>{user.unreadVolunteers}</span>)}
							</NavLink>
							<NavLink to={`/${user ? user._id : ''}/campaigns/pickup`} className="nav-link DashNavLink">
								<DashIconButton label="Pickup" icon="/images/ui-icon/campaign-pickup.svg" size="36px" fontSize="15px" />
								{user.unreadPickups > 0 && (<span className='UnreadBadge'>{user.unreadPickups}</span>)}
							</NavLink>
							<NavLink to={`/${user ? user._id : ''}/contacts`} className="nav-link DashNavLink">
								<DashIconButton label="Contacts" icon="/images/ui-icon/dashboard-contacts.svg" size="36px" fontSize="15px" />
							</NavLink>
						</div>
					</div>
				)
			default:
				return (
					<div>
                    </div>
				)
		}
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user
})

const mapDispatchToProps = {
	unreadProjects
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DashHeader)