import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import shortid from 'shortid';

import { signUp } from '../../common/authModals/modalTypes';

import { store, history } from '../../../store';
import { NONPROFIT } from '../../../helpers/userRoles';

import ModalDetail from './mainPageComponents/modalDetail';
import ModalSearch from './mainPageComponents/ModalSearch';
import HomeMain from './mainPageComponents/HomeMain';
import TopThree from './mainPageComponents/TopThree';
import MainDiscover from './mainPageComponents/MainDiscover';
import NewHowItWorks from './mainPageComponents/NewHowItWorks';
import ProjectsPeopleComponent from './mainPageComponents/ProjectsPeopleComponent';
import NewFooter from './mainPageComponents/NewFooter';

import './style.styl';

class HomePage extends Component {
	
	state = {
		showDetailModal: false,
		modalType: "",
		showSearchModal: false,
		search: "",
		animation1: '',
		animation2: ''
	}

	constructor(props) {
		super(props);

		const state = store.getState();
		if (state.authentication && state.authentication.isAuth) {
			if (state.authentication.user && state.authentication.user.role) {
				const userId = state.authentication.userId;
				const role = state.authentication.user.role;
				if (role === NONPROFIT) {
					history.push(`/${userId}/dashboard`);
				} else {
					history.push(`/${userId}`);
				}
			}
		}
	}

	openDetailModal = type => e => {
		this.setState({ showDetailModal: true, modalType: type })
	}

	closeDetailModal = type => e => {
		if (
			e.target.className.includes('modal open') ||
			e.target.className.includes('closeBtn') ||
			e.target.className.includes('closeX')
		) {
			this.setState({ showDetailModal: false }, () => {
				if (type === 'learn') {
					this.props.history.push(`learn`)
				}
				else if (type === 'discover') {
					this.props.history.push('discovery')
				}
			})
		}
	}

	openSearchModal = e => {
		this.setState({ showSearchModal: true })
	}

	closeSearchModal = e => {
		this.setState({ showSearchModal: false })
	}

	onClickSearch = e => {
		this.props.history.push('/m-search');
	}

	inputHelper = key => e => this.setState({ [key]: e.target.value })

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		window.addEventListener('resize', this.resizeWindows.bind(this))

		// document.querySelector('html').scrollTop = 0;
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
		window.removeEventListener('resize', this.resizeWindows.bind(this))
	}

	resizeWindows() {
	}

	handleScroll = () => {
		const scrollY = window.scrollY;
		if (scrollY > 380 && scrollY < 400) {
			const id = shortid.generate()
			this.setState({ animation1: id })
		}

		if (scrollY > 200 && scrollY < 220) {
			const id = shortid.generate()
			this.setState({ animation2: id })
		}
	}

	onSignUpClick = e => {
		e.preventDefault();
		e.stopPropagation();

		history.push(`?modal=${signUp}`);
	}

	render() {
		const {
			showDetailModal,
			modalType,
			showSearchModal,
			search
		} = this.state

		return (
			<div>
				<ModalDetail showModal={showDetailModal} closeModal={this.closeDetailModal} modalType={modalType} />
				{ showSearchModal && <ModalSearch showModal={showSearchModal} closeModal={this.closeSearchModal} width="90%" search={search} /> }
				<HomeMain />
				<TopThree />
				<MainDiscover />
				<NewHowItWorks />
				<ProjectsPeopleComponent />
				<NewFooter />
			</div>
		)
	}
}

export default withRouter(
	connect(
		null,
		null,
		null,
		{
			pure: false
		}
	)(HomePage)
)