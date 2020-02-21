import React, { Component } from 'react'
import UserAvatar from '../../../../common/userComponents/userAvatar'
import moment from 'moment'
class Message extends Component{
    
    formatAMPM(date) {
        date = new Date(date)
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = moment(date).format("M.DD.YYYY") + ', ' +  hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    date_diff_indays = (date1, date2) => {
        const dt1 = new Date(date1);
        const dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
    }

    render () {
        const {message, selUser, user} = this.props
        var isCurrentUser = false
        if(user) {
           isCurrentUser  = message.sender === user._id
        }
        
        return ( 
            <div className={`message  main-font ${ isCurrentUser ?'current':''}`}>
                <div className="message-avatar">
                    {selUser && <UserAvatar
                        imgUser={selUser.avatar}
                        userId={selUser._id}
                        size={32}
                    />}
                </div>
                <div className="message-body">
                    <div className="message-box">
                        {!isCurrentUser && selUser && <div className="user-name">{selUser.fullName}</div>}
                        <div className="message-text">{message.content}</div>
                    </div>
                    <div className="date-time">
                        { this.date_diff_indays(message.createdAt, Date.now()) > 0 ? 
                            moment(message.createdAt).format('M/D/YYYY hh:mm A') : 
                            moment(message.createdAt).fromNow() }
                    </div>
                </div>
                <div className="message-avatar-right">
                    {user && <UserAvatar
                        imgUser={user.avatar}
                        userId={user._id}
                        size={32}
                    />}
                </div>
            </div>
        );
    }
};
export default Message;