import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { history } from '../../../store'
import { NONPROFIT } from '../../../helpers/userRoles.js' 

function newKey() {
	return (Math.random() * 100000000).toString(36)
}

class PageShell extends React.Component {
	state = {
		key: newKey(),
		path: window.location.pathname
	}

	static getDerivedStateFromProps(props, state) {
		const { path, user, params } = props

		let forAuth =
			/\/project\/create/gi.test(path) ||
			/\/project\/edit/gi.test(path) ||
			/\/projects$/gi.test(path) ||
			/\/chats/gi.test(path) ||
			/\/setting/gi.test(path) ||
			/\/dashboard/gi.test(path) ||
			/\/campaigns/gi.test(path)

		let forNonprofit =
			/\/project\/create/gi.test(path) ||
			/\/project\/edit/gi.test(path) ||
			/\/dashboard/gi.test(path) ||
			/\/campaigns/gi.test(path)

		// let forNotAuth = /^\/$/gi.test(path)

		if (!user && forAuth) history.push('/')
		else if (!params) history.push('/')
		else if (forAuth && params.id !== user._id) history.push('/')
		else if (user && user.role !== NONPROFIT && forNonprofit) history.push('/')
		// else if (user && forNotAuth) history.push('/discovery')
		return {
			key: window.location.pathname === state.path ? state.key : newKey(),
			path: window.location.pathname
		}
	}

	render() {
		return (
			<ReactCSSTransitionGroup
				key={this.state.key}
				transitionAppear={true}
				transitionAppearTimeout={200}
				transitionEnterTimeout={200}
				transitionLeaveTimeout={50}
				transitionName="SlideIn">
				{this.props.children}
			</ReactCSSTransitionGroup>
		)
	}
}

const mapStateToProps = ({ authentication }) => ({
	user: authentication.user,
	isAuth: authentication.isAuth
})

export default connect(mapStateToProps)(PageShell)
