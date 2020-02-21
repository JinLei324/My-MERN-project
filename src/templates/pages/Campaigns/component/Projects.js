import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Slider from "react-slick";
import MiniCard from './MiniCard';
import Card from '../../../common/Card';
import Button from '../../../common/Button';
import { getProjectByParams, clearProjectsList } from '../../../../actions/project';

import DetailModal from './DetailModal';
import WithdrawModal from '../../Dashboard/WithdrawModal';
import UpdateModal from './UpdateModal';

import { DONATION } from '../../../../helpers/projectTypes';
import HintModal from './HintModal';

const NextArrow = props => {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{ ...style, width: 27, height: 27, backgroundImage: "url(/images/ui-icon/next.svg)" }}
			onClick={onClick}
		/>
	);
}

const PrevArrow = props => {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{ ...style, width: 27, height: 27, backgroundImage: "url(/images/ui-icon/prev.svg)" }}
			onClick={onClick}
		/>
	);
}

class Projects extends Component {

	state = {
		projects: [],
		showDetailModal: false,
		showWithdrawModal: false,
		showUpdateModal: false,
		showHint: false,
		project: {},
		isfirst: true
	}

	componentDidMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activeType !== -1 && this.state.isfirst) {
			this.setState({ isfirst: false }, () => {
				this.getData(nextProps)
			})
		}
	}

	componentWillUnmount() {
		this.props.clearProjectsList()
	}

	getData = (props) => {
		let skip = 0
		let limit = props.user.projectsCount
		if (limit !== 0) {
			let { userId, activeType } = props
			this.props.getProjectByParams({
				skip,
				limit,
				activeType,
				userId
			})
		}
	}

	onDetailView = project => e => {
		e.preventDefault()
		this.setState({
			showDetailModal: true, 
			project: project
		});
	}

	onUpdateModal = project => e => {
		e.preventDefault();
		this.setState({
			showUpdateModal: true, 
			project: project
		});
	}

	closeDetailModal = e => {
		this.setState({
			showDetailModal: false
		});
	}

	closeUpdateModal = e => {
		this.setState({
			showUpdateModal: false
		});
	}

	onUpdateComplete = info => e => {
	}

	onClickWithdraw = () => {
		this.setState({ showWithdrawModal: true });
	}

	onClickPayout = () => {
	}

	onToggleHint = () => {
		this.setState((state) => ({
			showHint: !state.showHint
		}));

		if (!this.state.showHint) {
			window.Intercom('showNewMessage');
		}
	}

	closeWithdrawModal = e => {
		this.setState({
			showWithdrawModal: false
		});
	}

	render() {
		const slickSettings = {
			dots: false,
			arrows: true,
			infinite: false,
			slidesToShow: 4,
			slidesToScroll: 1,
			nextArrow: <NextArrow />,
			prevArrow: <PrevArrow />,
			responsive: [
				{
				breakpoint: 1024,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 3
					}
				},
				{
					breakpoint: 600,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						initialSlide: 2
					}
				},
				{
					breakpoint: 480,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1
					}
				}
			]
		};

		const {
			project,
			showDetailModal,
			showWithdrawModal,
			showUpdateModal,
			showHint
		} = this.state

		const {
			user,
			userId,
			projects,
			activeType,
			onSelectProject,
			selectedProject,
			totalDonation
		} = this.props;

		if (!user) {
			return (null);
		}

		let tempProjectInfo = {
			_id: '',
			userId: '',
			projectId: '',
			cover: '/images/temp_project.jpg',
			title: 'Template Project',
			description: 'This is a template project',
			onDetailView: '',
			isSelected: false,
			isTemplateProject: true
		};

		const projectLen = projects.length;
		for (let i = 0; i < slickSettings.slidesToShow - projectLen; i++) {
			tempProjectInfo._id = 'template_' + (i + 1).toString();
			projects.push(tempProjectInfo);
		}
		
		return (
			<div className="ProjectsWrapper">
				<DetailModal
					activeType={activeType} project={project} 
					showDetailModal={showDetailModal} closeDetailModal={this.closeDetailModal} 
				/>
				<UpdateModal 
					project={project} showUpdateModal={showUpdateModal} closeUpdateModal={this.closeUpdateModal} onUpdateComplete={this.onUpdateComplete}
				/>
				{ (user.isApproved) && <div className='WithdrawModal'><WithdrawModal showModal={showWithdrawModal} closeModal={this.closeWithdrawModal} totalDonation={totalDonation} /></div> }
				<Slider {...slickSettings} className="ProjectsList">
				{ (activeType === DONATION) && (<Card className="withdrawPayoutPanel">
					<div className="panel-body fixed-width withdrawal-card">
						<span className="center action-picture">
							<img alt='question-img' src='/images/ui-icon/icon-help.svg' onClick={this.onToggleHint} />
							<HintModal isShow={showHint} />
						</span>
						<div className="center separator-20" />
						<img className='iconMoneyImg' src="/images/ui-icon/icon-money.svg" alt="Money Icon" onClick={this.onClickGeneralDonation}/>
						<div className="center available-donation-money">${totalDonation}</div>
						<div className="center available-donation">General Donations</div>
						<div className="center available-donation-money">${totalDonation}</div>
						<div className="center available-donation">Available</div>
						<div className="center btnGroup">
							<Button label="Payout" disabled={true} className='payout-btn' onClick={this.onClickPayout} />
						</div>
					</div>
				</Card>) }
				{ projects && projects.map((e, i) => {
					return (
						<Fragment key={e._id}>
							<MiniCard {...e} activeType={activeType} userId={userId} projectId={e._id} 
								onDetailView={this.onDetailView} onClickWithdraw={this.onClickWithdraw} onUpdateModal={this.onUpdateModal}
								onSelectProject={onSelectProject} isSelected={selectedProject === e._id} 
								isTemplateProject={e.isTemplateProject} />
						</Fragment>
					)
				}) }
				</Slider>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	userId: state.authentication.userId,
	user: state.authentication.user,
	projects: state.project.projects
})

const mapDispatchToProps = {
	getProjectByParams,
	clearProjectsList
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Projects)