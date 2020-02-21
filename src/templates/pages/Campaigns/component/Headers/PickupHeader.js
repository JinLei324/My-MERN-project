import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import DashIconButton from '../../../../common/DashIconButton'
import IconButton from '../../../../common/IconButton'
import {
	unreadProjects
} from '../../../../../helpers/websocket';

class PickupHeader extends Component {
  render() {
    const { userId, user } = this.props

    return (
      <div className="campaign-header">
        <div className="_title">
          <span >Pickup management</span>
          <NavLink to={`/${userId}/project/create`} className="nav-link DashNavLink">
            <IconButton className='AddProject' icon="/images/ui-icon/icon-add.svg" size="18px" />
          </NavLink>
        </div>
        <div className='DashNavContainer'>
          <NavLink to={`/${userId}/dashboard`} className="nav-link DashNavLink">
            <DashIconButton label="Back" icon="/images/ui-icon/dashboard-back.svg" size="36px" fontSize="15px" color="#1AAAFF" />
          </NavLink>
          <NavLink to={`/${userId}/campaigns/donations`} className="nav-link DashNavLink">
            <DashIconButton label="Donations" icon="/images/ui-icon/campaign-donations.svg" size="36px" fontSize="15px" />
            {user.unreadDonations > 0 && (<span className='UnreadBadge'>{user.unreadDonations}</span>)}
          </NavLink>
          <NavLink to={`/${userId}/campaigns/volunteer`} className="nav-link DashNavLink">
            <DashIconButton label="Volunteer" icon="/images/ui-icon/campaign-volunteer.svg" size="36px" fontSize="15px" />
            {user.unreadVolunteers > 0 && (<span className='UnreadBadge'>{user.unreadVolunteers}</span>)}
          </NavLink>
          <NavLink to={`/${userId}/contacts`} className="nav-link DashNavLink">
            <DashIconButton label="Contacts" icon="/images/ui-icon/dashboard-contacts.svg" size="36px" fontSize="15px" />
          </NavLink>
        </div>
      </div>
      
    )
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
)(PickupHeader)