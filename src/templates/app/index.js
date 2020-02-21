import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import queryString from 'query-string';
import routerFcn from './router';

// import Intercom from 'react-intercom';

import NotificationModals from '../common/notificationModals';
import AuthModals from '../common/authModals';
import Welcome from '../common/welcome';

import {
	forgotPassword,
	newPassword,
	signIn,
	signUp,
	newNonprofit,
	newDonor,
	newStudent
} from '../common/authModals/modalTypes';
import { STUDENT, NONPROFIT, DONOR } from '../../helpers/userRoles';

import { toggleNotification } from '../../actions/notificationActions'
import { updateFirstTime } from '../../actions/user'
import MainHeader from '../common/mainHeader'
import SidebarLeft from '../common/sidebarLeft'
import ScrollToTopComponent from './ScrollToTopComponent'
import Cookies from 'universal-cookie';

import {
	getNotificationList
} from '../../actions/global';

import {
	connectSocket,
	logoutSocket
} from '../../helpers/websocket';

import { library } from '@fortawesome/fontawesome-svg-core';
import { 
	faSearch, faEnvelope, faKey, faHeart, faComment, faShareAlt, 
	faSmileWink, faImage, faEllipsisV, faTimes, faEllipsisH, faEdit, faTrash, faStar, faQuestionCircle, faQuestion
} from '@fortawesome/free-solid-svg-icons';

import 'react-datepicker/dist/react-datepicker.css';
import './style.css';

library.add(faSearch, faEnvelope, faKey, faHeart, faComment, 
	faShareAlt, faSmileWink, faImage, faEllipsisV, faTimes, 
	faEllipsisH, faEdit, faTrash, faStar, faQuestionCircle, faQuestion);

class App extends Component {

	state = {
		modalType: null,
		showModal: false,
		showWelcome: false,
		isLanding: true,
		isMobileSearch: false,
		isHome: true,
		isAuth: false,
		isScrollDown: false
	}

	constructor(props) {
		super(props)
		this.router = routerFcn()
	}

	componentDidMount() {
		const { isAuth, user } = this.props;
		if (isAuth) {
			window.Intercom('boot', {
				app_id: 'q4hnc1xx',
				email: user.email,
				user_id: user._id,
				created_at: 1234567890
			});
		} else {
			window.Intercom('boot', {
				app_id: 'q4hnc1xx'
			});
		}

		const path = this.props.history.location.pathname;
		let isHome = false;
		if (path === '/' || path === '/nonProfit') {
			isHome = true
		}
		if (path === '/' || path === '/learn' || path === '/about' || path === '/nonProfit') {
			this.setState({ isLanding: true, isHome: isHome })
		} else if (path === '/m-search') {
			this.setState({ isMobileSearch: true });
		} else {
			this.setState({ isLanding: false, isHome: false })
		}
		this.props.history.listen(location => {
			isHome = false;
			if (location.pathname === '/' || location.pathname === '/nonProfit') {
				isHome = true;
			}
			if (location.pathname === '/' || location.pathname === '/learn' || location.pathname === '/about' || location.pathname === '/nonProfit') {
				this.setState({ isLanding: true, isHome: isHome })
			}
			else {
				this.setState({ isLanding: false, isHome: false })
			}
			const params = queryString.parse(location.search)
			params.modal && this.openModal(+params.modal)
			if (!params.modal && this.state.showModal) {
				this.setState({ showModal: false }, () => {
					if ((this.state.modalType === newNonprofit || this.state.modalType === newDonor || this.state.modalType === newStudent)  && this.props.user && this.props.user.isFirst) {
						this.setState({ showWelcome: true })
						this.props.dispatch(updateFirstTime())
					}
					this.setState({ modalType: null })
				})
			}
		})
		const params = queryString.parse(this.props.location.search)
		params.modal && this.openModal(+params.modal)
		window.addEventListener("beforeunload", this.onUnload)
		window.addEventListener('scroll', this.handleScroll);
	}

	static getDerivedStateFromProps(props, state) {
		const cookies = new Cookies();
		if(!state.isAuth  && props.isAuth) {
			state.isAuth = true
			cookies.set('authorization', props.token, { path: '/' });
			connectSocket();
			props.dispatch(getNotificationList())
		}
		if(state.isAuth && !props.isAuth) {
			cookies.remove('authorization',{ path: '/' });
			state.isAuth = false
			logoutSocket();
		}
		return state;
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	openModal = type =>
		[
			forgotPassword,
			newPassword,
			signIn,
			signUp,
			newNonprofit,
			newDonor,
			newStudent
		].includes(type) && this.setState({ showModal: true, modalType: type })

	handleClose = e => {
		let params = queryString.parse(this.props.location.search)
		let closeForLayout =
			(e.target.className === 'LayoutModal open' &&
				+params.modal !== NONPROFIT &&
				+params.modal !== STUDENT &&
				+params.modal !== DONOR) ||
			e.target.className === 'closeBtn'

		if (closeForLayout) {
			this.setState({ showModal: false })
			delete params.modal
			const stringified = queryString.stringify(params)

			this.props.history.replace({
				pathname: this.props.location.pathname,
				search: stringified
			});

			setTimeout(() => this.setState({ modalType: null }), 300);
		}
	}

	changeTypeId = type => {
		this.props.history.push(`?modal=${type}`);
	}

	closeNotification = () => {
		this.props.dispatch(toggleNotification({ isOpen: false }));
	}

	closeWelcomeModal = () => {
		this.setState({ showWelcome: false });
		this.props.history.push(`/discovery`);
	}

	handleScroll = () => {
		const lastScrollY = window.scrollY;

		if (lastScrollY > 100) {
			this.setState({isScrollDown: true});
		} else {
			this.setState({isScrollDown: false});
		}
  	};

	render() {
		const { isLanding, isHome, isMobileSearch, modalType, showModal, showWelcome, isScrollDown } = this.state;
		const {
			isOpen,
			secondTitle,
			buttonText,
			firstTitle,
			resend,
			isAuth,
			user
		} = this.props;

		// let userInfo = {};
		// if (isAuth) {
		// 	userInfo = {
		// 		user_id: user._id,
		// 	 	email: user.email,
		// 		name: user.companyName || user.firstName + user.lastName
		// 	};
		// 	console.log('user name : ', userInfo.name);
		// }

		return (
			<div className="rootContainer">
				{/* { !isAuth && <Intercom appID="q4hnc1xx" /> }
				{ isAuth && <Intercom appID="q4hnc1xx" { ...userInfo } /> } */}
				<div id="loading" className="hide"><div className="spinner-wrapper"><div className="spinner"><div className="item1"></div><div className="item2"></div></div></div></div>
				<Welcome user={user} showModal={showWelcome} closeModal={this.closeWelcomeModal} />
				<div className={`app ${isLanding && 'landingPageWrapper'} ${isHome && 'homePageWrapper'}`}>
					<main className="main" role="main">
						<MainHeader isHome={isHome} isScrollDown={isScrollDown} />
						{isAuth && !isLanding && <SidebarLeft />}
						<div
							className={`${
								!isLanding ? 'mainAppContainer' : 'landingContainer'
							} ${isAuth ? 'hasSidebar' : ''} ${isMobileSearch ? '' : ''}`}>
							<Switch>
								{this.router}
								<Redirect from="*" to="/" />
							</Switch>
						</div>
					</main>
				</div>

				{!isLanding && <ScrollToTopComponent />}

				<AuthModals
					modalType={modalType}
					showModal={showModal}
					changeTypeId={type => this.changeTypeId(type)}
					handleClose={this.handleClose}
				/>
				<NotificationModals
					showModal={isOpen}
					resend={resend}
					close={this.closeNotification}
					firstTitle={firstTitle}
					buttonText={buttonText}
					secondTitle={secondTitle}
				/>
			</div>
		)
	}
}

const mapStateToProps = ({ notifications, authentication, preloader, chat, globalReducer }) => ({
	isAuth: authentication.isAuth,
	token: authentication.token,
	user: authentication.user,
	isOpen: notifications.isOpen,
	resend: notifications.resend,
	preloader: preloader.show,
	firstTitle: notifications.firstTitle,
	secondTitle: notifications.secondTitle,
	buttonText: notifications.buttonText,
	currentUser: chat.currentUser,
	userHasLoggedIn: chat.userHasLoggedIn,
	request: chat.request,
	notifications: globalReducer.notifications
})

export default withRouter(connect(mapStateToProps)(App))