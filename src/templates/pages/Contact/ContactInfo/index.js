import React, {Component} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import Label from '../../../common/Label';
import UserAvatar from '../../../common/userComponents/userAvatar';

export default class ContactInfo extends Component {

    state = {
        showToggle: false,
        showDetail: false
    }
    
    toggleSubmenu = e => {
        e.stopPropagation();
        this.setState({showToggle: true})
    }
    
    leaveMouseoutOfMenu = e => {
		if (e) {
			e.stopPropagation();
		}
		this.setState({showToggle: false});
    }

    render() {
        const { showToggle } = this.state
        const { contact, contactEdit, contactDelete, border, onClickContact, sendInviteContact, currentTab } = this.props;

        return (
            <div className={`line-contact ${border ? 'border' : ''}`} onClick={onClickContact}>
                <span className="line-contact-info">
                    {/* <NavLink
                        to={`/${contact.contact && contact.contact._id}`}
                        onClick={e => e.stopPropagation()}> */}
                        <div className="info-wrapper">
                            { contact.contact &&
                                <UserAvatar
                                    imgUser={contact.contact.avatar}
                                    userId={contact.contact._id}
                                    size={40}
                                />
                            }
                            {!contact.contact && <div className="empty-avatar" />}
                            <Label
                                name= {contact.fullName}
                                lastview={`${contact.token ? contact.token.createdAt : ''}`}
                            />
                        </div>
                    {/* </NavLink> */}
                </span>
                <span className="line-contact-info birthday">
                    {contact.birthDate ? moment(contact.birthDate * 1000).format("DD, MMMM YYYY") : ""}
                </span>
                <span className="line-contact-info">
                    {contact.email}
                </span>
                <span className="line-contact-info">
                    {contact.address}
                </span>
                <span className="line-contact-info phone">
                    {contact.phone}
                </span>
                <div className="line-contact-info action">
                    <span className="action" onClick={this.toggleSubmenu}>
                        <FontAwesomeIcon icon="ellipsis-h"/>
                    </span>
                    <div className={`edit-menu ${showToggle ? 'open' : ''}`} onMouseLeave = { this.leaveMouseoutOfMenu }>
                        { currentTab === 'invite' && <div className="submenu edit"
                            onClick={ sendInviteContact }>
                            <FontAwesomeIcon icon="edit"/> 
                            <span className="_label">Send Invite</span>
                        </div> }
                        <div className="submenu edit"
                            onClick={contactEdit}>
                            <FontAwesomeIcon icon="edit"/> 
                            <span className="_label">Edit</span>
                        </div>
                        <div className="submenu trash"
                            onClick={contactDelete}>
                            <FontAwesomeIcon icon="trash"/> 
                            <span className="_label">Delete</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}