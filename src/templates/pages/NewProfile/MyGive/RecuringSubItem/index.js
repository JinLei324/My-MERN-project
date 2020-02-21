import React, {Component} from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserAvatar from '../../../../common/userComponents/userAvatar';

export default class RecuringSubItem extends Component {

    state = {
        showToggle: false
    }
  
    toggleSubmenu = e => {
        e.stopPropagation();
        this.setState({
            showToggle: true
        });
    }
    
    leaveMouseoutOfMenu = e => {
		if (e) {
			e.stopPropagation()
		}
		this.setState({showToggle: false})
    }

    render() {
        let { showToggle } = this.state;
        const { nonprofit, donate, project, onClickCancelMenu, onClickEditMenu } = this.props;

        if (!nonprofit) {
            return (null);
        }

        let fullName = ""
        if (nonprofit) {
            fullName = nonprofit.companyName || nonprofit.firstName + " " + nonprofit.lastName
        }

        let donationType = '';
        if (donate.generalDonation === 0) {
            if (project) {
                donationType = project.title;
            } else {
                donationType = "Project Donation";
            }
        } else if (donate.generalDonation === 1) {
            if (donate.donationType === 0) {
                donationType = 'General Donation';
            } else if (donate.donationType === 1) {
                if (donate.frequency === 0) {
                    donationType = 'Recurring Monthly';
                } else if (donate.frequency === 1) {
                    donationType = 'Recurring Weekly';
                } else if (donate.frequency === 2) {
                    donationType = 'Recurring Two Weekly';
                }
            }
        }

        return (
            <section className="recurring-card">
                { nonprofit ?
                    <UserAvatar
                        imgUser={nonprofit.avatar}
                        imgUserType={nonprofit.role}
                    /> : 
                    <UserAvatar
                    />
                }
                <div className="separator-h-10" />
                <div className="_info">
                    <span className="_name">{fullName}</span>
                    <span className="_frequency">{donationType}</span>
                    <span className="_frequency">{moment(donate.createdAt).format("MMMM DD, YYYY")}</span>
                </div>
                <div className="_amount">${donate.amount}</div>
                <div className="card-action">
                    <span className="action" onClick={this.toggleSubmenu}>
                        <FontAwesomeIcon icon="ellipsis-v"/>
                    </span>
                    { donate.generalDonation === 1 && donate.donationType !== 0 && 
                        <div className={`action-menu ${showToggle ? 'open' : ''}`} onMouseLeave={this.leaveMouseoutOfMenu}>
                            <div className="submenu edit" onClick={onClickEditMenu(donate._id)}>
                                <FontAwesomeIcon icon="edit" /> 
                                <span className="_label">Edit</span>
                            </div>
                            <div className="submenu cancel" onClick={onClickCancelMenu(donate._id)}>
                                <FontAwesomeIcon icon="trash" /> 
                                <span className="_label">Cancel</span>
                            </div>
                        </div>
                    }
                </div>
            </section>
        )
    }
}