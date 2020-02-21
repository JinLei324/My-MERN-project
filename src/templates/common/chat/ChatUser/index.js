import React, { Component } from 'react';

import NotificationBadge from 'react-notification-badge';
import moment from 'moment';

import UserAvatar from '../../userComponents/userAvatar';

class ChatUser extends Component {

    onClick = e => {
        this.props.onClick && this.props.onClick()
    }

    onClickMessageIcon = e => {
        this.props.onClickMessageIcon && this.props.onClickMessageIcon()
    }

    date_diff_indays = (date1, date2) => {
        const dt1 = new Date(date1);
        const dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

	render() {
        const { user, last_msg, border, last_time, className, status, un_read_count } = this.props
		return (
			<section className={`ChatUser ${className} ${border ? 'border' : ''}`} onClick={this.onClick}>
                <UserAvatar
                    imgUser = { user.avatar }
                    userId = { user._id }
                    size = { 32 }
                />
				
                <div className="_label main-font">
                    <div className="line-text">
                        { (user.companyName || user.firstName) && <span className="name">{user.companyName || user.firstName + " " + user.lastName}</span>}
                        { last_msg && (
                            <span className="chat main-font">{ last_msg }</span>
                        ) }
                    </div>
                    { last_msg !== '' ? 
                        <div className="user-status">
                            <span className={`point ${status}`} />
                            { last_time && <span className="last-time">{ this.date_diff_indays(last_time, Date.now()) > 0 ? moment(last_time).format('M/D/YYYY') : moment(last_time).fromNow() }</span> }
                            <NotificationBadge count={ un_read_count } effect={ [null, null, {top:'3px'}, {top:'3px'}] } style={{ backgroundColor: '#1aaaff', fontSize: '15px', padding: '3px 5px', width: '10px', height: '13px', borderRadius: '50%', top: '-5px', left: '22px', bottom: '', right: '' }} />
                        </div> : 
                        <div className="message-icon">
                            <img src="/images/ui-icon/chat/icon_message.svg" alt="message" onClick={this.onClickMessageIcon} />
                        </div> }
                </div> 
			</section>
		)
	}
}

export default ChatUser
