import React, {Component} from 'react'
import UserAvatar from '../../userComponents/userAvatar';
import Button from '../../Button';
import moment from 'moment'
import { NavLink } from 'react-router-dom'

export default class FollowNoti extends Component {
    render() {
        const {_id, user, onAccept, onDecline, createdAt} = this.props        
        return(
            <section className="follow-noti">
                <NavLink
                    to={`/${user && user._id}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="main-info">
                        <UserAvatar
                            imgUser={user.avatar}
                            imgUserType={user.role}
                        />
                        <div className="separator-h-10"/>
                        <div className="follow-content">
                            <span className="_name">{user.companyName ? user.companyName : user.firstName + " " + user.lastName}</span>
                            <span className="_desc">Wants to be your friend</span>
                            <div className="button-group">
                                <Button className='myBtn' fontSize="14px" label="Accept" padding="6px 8px" noBorder solid onClick={onAccept(_id)}/>
                                <div className="separator-h-10"/>
                                <Button className='myBtn' fontSize="14px" label="Decline" padding="6px 8px" inverse onClick={onDecline(_id)} />
                            </div>
                        </div>
                    </div>                
                    <div className="_time">{moment(createdAt).fromNow()}</div>
                </NavLink>
            </section>
        )
    }
}