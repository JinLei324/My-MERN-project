import React, { Component } from 'react'
import HorizontalTab from '../../common/horizontalTab'
import ToggleButton from 'react-toggle-button'

import changeEmail from '../../common/horizontalTab/tabs/changeEmail'
import editStudent from '../../common/horizontalTab/tabs/editStudent'
import editNonprofit from '../../common/horizontalTab/tabs/editNonprofit'
import editDonor from '../../common/horizontalTab/tabs/editDonor'
import changePassword from '../../common/horizontalTab/tabs/changePassword'
import { STUDENT, NONPROFIT, DONOR  } from '../../../helpers/userRoles'
import { connect } from 'react-redux'
import {
	changePrivacySetting
} from '../../../actions/setting'

const tabs = [
	{
		id: 1,
		component: editDonor,
		label: 'Edit profile',
		forRole: DONOR
	},
	{
		id: 2,
		component: editNonprofit,
		label: 'Edit profile',
		forRole: NONPROFIT
	},
	{
		id: 3,
		component: editStudent,
		label: 'Edit profile',
		forRole: STUDENT
	},
	{
		id: 4,
		component: changePassword,
		label: 'Change password',
		forRole: false
	},
	{
		id: 5,
		component: changeEmail,
		label: 'Change email',
		forRole: false
	}
]

class Setting extends Component {
	state = {
		pushToggle: false,
		activeTab: 1,
		isPrivate: false
	}

	componentDidMount() {
		// this.props.user && this.setState({isPrivate: this.props.user.isPrivate});	// original code
		this.props.user && this.setState((state, props) => ({
			isPrivate: props.user.isPrivate
		}));
	}

	toggleActiveTab = id => {
		this.state.activeTab === id
			? this.setState({ activeTab: null })
			: this.setState({ activeTab: id })
	}

	togglePrivacy = isPrivate => e => {
		this.setState({
			isPrivate: isPrivate
		})

		const data = {
			_id: this.props.user._id,
			isPrivate: isPrivate
		}
		this.props.dispatch(changePrivacySetting(data))
	}

	onClickBack = e => {
		this.props.history.goBack()
	}

	render() {
		const { activeTab, pushToggle, isPrivate } = this.state
		const { user } = this.props

		let styles = {
			trackStyle: {
				width: 32,
				height: 16,
				opacity: !pushToggle ? '.3' : '',
				background: pushToggle
					? 'linear-gradient(90deg, #1AAAFF 0%, #5EEDFD 100%)'
					: ''
			},
			thumbStyle: {
				width: 14,
				height: 14,
				boxShadow: 'none'
			}
		}

		let privateStyle = {
			trackStyle: {
				width: 32,
				height: 16,
				opacity: !isPrivate ? '.3' : '',
				background: isPrivate
					? 'linear-gradient(90deg, #1AAAFF 0%, #5EEDFD 100%)'
					: ''
			},
			thumbStyle: {
				width: 14,
				height: 14,
				boxShadow: 'none'
			}
		}

		return (
			<div className="SettingPage">
				<img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickBack}/>
				<h1 className="firstTitle">Settings</h1>
				<h3 className="secondTitle marginAccount">Account</h3>

				{user &&
					tabs.map(
						singleTab =>
							(!singleTab.forRole ||
								singleTab.forRole === user.role) && (
								<HorizontalTab
									key={singleTab.id}
									clickOnTab={() =>
										this.toggleActiveTab(singleTab.id)
									}
									active={activeTab === singleTab.id}
									Comp={singleTab.component}
									label={singleTab.label}
								/>
							)
					)}

				<h3 className="secondTitle marginNotification">
					Notification setting
				</h3>
				<div className="pushNotification">
					<h4>Push Notification</h4>
					<ToggleButton
						inactiveLabel={false}
						trackStyle={styles.trackStyle}
						thumbStyle={styles.thumbStyle}
						thumbAnimateRange={[1, 15]}
						activeLabel={false}
						value={this.state.pushToggle}
						onToggle={pushToggle => {
							this.setState({
								pushToggle: !pushToggle
							})
						}}
					/>
				</div>
				<div className="set_description">Stay up-to-date with your giving by enabling push notifications! When push notifications are enabled, you will receive your notifications via email, so you can be sure to never to miss out on new projects or updates from the communities and causes you support!</div>
				{user && user.role !== NONPROFIT && <section>
					<h3 className="secondTitle marginNotification">
						Privacy
					</h3>
					<div className="pushNotification">
						<h4>Privacy</h4>
						<ToggleButton
							inactiveLabel={false}
							trackStyle={privateStyle.trackStyle}
							thumbStyle={privateStyle.thumbStyle}
							thumbAnimateRange={[1, 15]}
							activeLabel={false}
							value={isPrivate}
							onToggle={this.togglePrivacy(!isPrivate)}
						/>
					</div>
					<div className="set_description">When privacy settings are enabled, only followers you've accepted can access or view your profile and posts! Other users will request to follow you and you must accept their request before they are allowed to view your profile, post, or be able to message you.</div>
				</section>}
			</div>
		)
	}
}

const mapStateToProps = ({ authentication }) => ({
	user: authentication.user
})

export default connect(mapStateToProps)(Setting)
