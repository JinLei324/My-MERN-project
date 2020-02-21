import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import DashIconButton from '../../../common/DashIconButton'
import IconButton from '../../../common/IconButton'

class ContactHeader extends Component {

  state = {
    showMenu: false
  };

  onClickOpenMenu = e => {
    this.setState({ showMenu: true });
  }

  leaveMouseoutOfMenu = e => {
    this.setState({ showMenu: false })
  }

  render() {
    const {showMenu} = this.state
    const { userId, onClickAdd, onClickImport } = this.props

    return (
      <div className="contact-header">
        <div className="_title">
          <span>Contacts</span>
          <div className="nav-link DashNavLink">
            <IconButton className='AddProject' icon="/images/ui-icon/icon-add.svg" size="18px" onClick={this.onClickOpenMenu} />
          </div>
          <div className={`contact-menu ${showMenu ? 'open' : ''}`} onMouseLeave={this.leaveMouseoutOfMenu}>
            <div className="contact-menu-item" onClick={onClickAdd}>
              <img alt='create_contact' src='/images/ui-icon/contact/create_contact.svg' className='create-contact-img' />
              <span>Create Contact</span>
            </div>
            <div className="contact-menu-item" onClick={onClickImport}>
              <img alt='import_contacts' src='/images/ui-icon/contact/import_contacts.svg' className='import-contacts-img' />
              <span>Import Contacts</span>
            </div>
          </div>
        </div>
        <div className='DashNavContainer'>
          <NavLink to={`/${userId}/dashboard`} className="nav-link DashNavLink">
            <DashIconButton label="Back" icon="/images/ui-icon/dashboard-back.svg" size="36px" fontSize="15px" color="#1AAAFF" />
          </NavLink>
          <NavLink to={`/${userId}/campaigns/donations`} className="nav-link DashNavLink">
            <DashIconButton label="Donations" icon="/images/ui-icon/campaign-donations.svg" size="36px" fontSize="15px" />
          </NavLink>
          <NavLink to={`/${userId}/campaigns/volunteer`} className="nav-link DashNavLink">
            <DashIconButton label="Volunteer" icon="/images/ui-icon/campaign-volunteer.svg" size="36px" fontSize="15px" />
          </NavLink>
          <NavLink to={`/${userId}/campaigns/pickup`} className="nav-link DashNavLink">
            <DashIconButton label="Pickup" icon="/images/ui-icon/campaign-pickup.svg" size="36px" fontSize="15px" />
          </NavLink>
        </div>
      </div>
      
    )
  }
}
export default ContactHeader;