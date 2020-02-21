import React, { Component } from 'react';
import moment from 'moment';

import { history } from '../../../store';

import { NONPROFIT } from '../../../helpers/userRoles';

class Label extends Component {

	onSelectUser = e => {
		if (this.props.userId) {
			history.push(`/${this.props.userId}`);
		}
	}

	render() {
		const {
			sharerName,
			name,
			address,
			date,
			lastview,
			isApproved,
			role,
			isSharer,
			showType
		} = this.props;

		return (
			<section className={`label main-font ${isSharer ? "sharer" : ""}`} onClick={this.onSelectUser}>
				{ isSharer && 
					<div className="line line-text">
						{ sharerName && <span className="label"><span className="name">{sharerName} </span>&nbsp;from</span> }
					</div>
				}
				<div className="line line-text">
					{ name && <span className={`name ${showType === "charity" ? "m-t-15" : ""} ${isSharer ? "blue" : ""}`}>{name}</span> }
					{ isApproved && role === NONPROFIT && <img alt="" src="/images/ui-icon/check_mark.svg" className={`check-mark ${showType === "charity" ? "m-t-15" : ""}`} /> }
				</div>
				<div className="line line-address">
					{ showType === "charity" && address && address.city && address.state && (
						<div>
							<img alt="date-icon" src="/images/ui-icon/location_blue.svg" />
							<span className="date">{address.city}, {address.state}</span>
						</div>
					) }
				</div>
				<div className="line line-date">
					{ showType !== "charity" && address && address.city && address.state && (
						<span className="date">{ address.city }, { address.state }</span>
					) }
					{ date && (
						<span className="date">{moment(date).fromNow()}</span>
					) }
					{ lastview && (
						<span className="last-view">last view {moment(lastview).fromNow()}</span>
					) }
				</div>
			</section>
		)
	}
}

export default Label