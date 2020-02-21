import React, { Component } from 'react';

import Card from '../../../common/Card';
import UserAvatar from '../../../common/userComponents/userAvatar';
import Label from '../../../common/Label';

export default class Charity extends Component {

    render() {
        const { user, onUserClick } = this.props;
        if (!user || !onUserClick) {
            return (null);
        }
        
        return (
            <Card className="charitySection">
                <div className="headerPicture hint-profile-image" onClick={onUserClick(user._id)}>
                    { !user.profilePicture &&
                        <div className="no-picture">
                            <img src="/images/ui-icon/profile/nonprofit-cover-image.svg" alt="" />
                            <div className="main-picture">
                                {/* <div className="content">
                                    <img src="/images/ui-icon/icon-image.svg" alt="" />
                                </div> */}
                            </div>
                            <div className="gradient-overlay" />
                        </div>
                    }
                    { user.profilePicture &&
                        <div className="real-picture">
                            <img src={user.profilePicture} alt="" />
                            <div className="gradient-overlay" />
                        </div>
                    }
                    <div className="userAvatar">
                        <UserAvatar
                            userId={user._id}
                            imgUser={user.avatar}
                            imgUserType={user.role} />
                    </div>
                </div>
                <div className="profileInfo">
                    <div className="flex-wrapper">
                        <Label
                            name={user.companyName}
                            address={user.address}
                            userId={user._id}
                            isApproved={user.isApproved}
                            role={user.role}
                            showType="charity" />
                    </div>
                    <div className="separator-15"></div>
                    <div className="chairty-desc">
                        <p>{user.aboutUs}</p>
                    </div>
                    <div className="separator-20"></div>
                </div>
                <div className="btn-wrapper" onClick={onUserClick(user._id)}>
                    <button className="btn-support">Support Charity</button>
                </div>
            </Card>
        )
    }
}
