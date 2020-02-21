import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	Header,
	Projects,
	DonorRequests
} from './component'

import {
	VOLUNTEER,
	DONATION,
	PICKUP
} from '../../../helpers/projectTypes';
import {
	setUnreadProjectsCount
} from '../../../actions/authActions';
import './campaigns.css';

const projectTypes = { volunteer: VOLUNTEER, donations: DONATION, pickup: PICKUP }

class Campaigns extends Component {
	state = {
		activeType: -1,
		selectedProject: "",
		userId: "",
		totalDonation: 0,
		showWithdrawModal: false
	}

	componentDidMount() {
		const { user } = this.props;
		if (!user) {
			this.props.history.push('/')
			return;
		}

		const { campaign, id } = this.props.match.params
		
		if (projectTypes[campaign] !== undefined) {
			this.setState({ activeType: projectTypes[campaign] })
		} else {
			this.props.history.push('/')
		}

		if (id !== undefined) {
			this.setState({userId: id})
		} else {
			this.props.history.push('/')
		}

		this.props.dispatch(
			setUnreadProjectsCount({
				type: campaign
			})
		);

		window.scroll(0, 0);
	}

	onSelectProject = projectId => {
		this.setState({ selectedProject: projectId })
	}

	render() {
		const {
			activeType,
			selectedProject,
			userId,
			totalDonation
		} = this.state;
		
		return (
			<div className="CampaignsPage">
				<Header activeType={activeType} userId={userId} />
				<div className="separator-30" />
				<Projects activeType={activeType} onSelectProject={this.onSelectProject} selectedProject={selectedProject} totalDonation={totalDonation} />
				<div className="separator-50" />
				<DonorRequests activeType={activeType} projectId={selectedProject} />
			</div>
		)
	}
}

const mapStateToProps = ({ authentication }) => ({
	user: authentication.user
})

export default connect(mapStateToProps, null)(Campaigns)