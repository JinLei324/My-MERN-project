import React, {Component} from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserAvatar from '../../../../common/userComponents/userAvatar';

export default class RecuringItem extends Component {

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
		this.setState({
            showToggle: false
        });
    }

    render() {
        let { showToggle } = this.state;
        const { nonprofit, lastDonationAt, amount, onClickReceipts } = this.props;

        if (!nonprofit) {
            return (null);
        }

        let fullName = ""
        if (nonprofit) {
            fullName = nonprofit.companyName || nonprofit.firstName + " " + nonprofit.lastName
        }
        
        return (
            <section className="recurring-card" onClick={onClickReceipts}>
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
                    <span className="_frequency">Last Donation:</span>
                    <span className="_frequency">{moment(lastDonationAt).format("MMMM DD, YYYY")}</span>
                </div>
                <div className="_amount">${amount}</div>
                <div className="card-action">
                    <span className="action" onClick={this.toggleSubmenu}>
                        <FontAwesomeIcon icon="ellipsis-v"/>
                    </span>
                    <div className={`action-menu ${showToggle ? 'open' : ''}`} onMouseLeave={this.leaveMouseoutOfMenu}>
                        <div className="submenu invoice" onClick={onClickReceipts}>
                            <img src="/images/ui-icon/profile/icon-invoice.svg" alt="" />
                            <span className="_label">Receipts</span>
                        </div>
                    </div>
                    {/* <div className={`edit-menu ${showToggle ? 'open' : ''}`} onMouseLeave={this.leaveMouseoutOfMenu}>
                        <div className="submenu edit">
                            <FontAwesomeIcon icon="edit"/> 
                            <span className="_label">Edit</span>
                        </div>
                        <div className="submenu trash">
                            <FontAwesomeIcon icon="trash"/> 
                            <span className="_label">Delete</span>
                        </div>
                    </div> */}
                </div>
            </section>
        )
    }
}