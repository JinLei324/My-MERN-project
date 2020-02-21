import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import Footer from './mainPageComponents/footer';
import ModalNonProfit from './mainPageComponents/modalNonprofit';
// import Slider from 'react-slick'
import './style.css';
import './nonProfit.css';
import { signUp } from '../../common/authModals/modalTypes';
import OfferNonprofits from './mainPageComponents/offerNonprofits';
// import { store } from '../../../store';

class NonProfit extends Component {
	state = {
		showModal: false,
		modalType: ""
	}

	openModal = type => e => {
		this.setState({ showModal: true, modalType: type })
	}

	closeModal = type => e => {
		if (
			e.target.className.includes('modal open') ||
			e.target.className.includes('closeBtn') ||
			e.target.className.includes('closeX')
		) {
			this.setState({ showModal: false }, () => {
				if (type === 'learn') {
					this.props.history.push(`learn`)
				}
				else if (type === 'discover') {
					this.props.history.push('discovery')
				}
			})
		}
	}

	onClickDemo = e => {
		window.Intercom('showNewMessage')
	}

	onClickContactUs = e => {
		window.Intercom('showNewMessage');
		// if (store.getState().authentication.isAuth) {
		// 	const userId = store.getState().authentication.userId;
		// 	this.props.history.push(userId + '/chats');
		// }
	}

	render() {
		const {
			showModal,
			modalType
		} = this.state

		// var settings = {
		// 	dots: false,
		// 	infinite: false,
		// 	speed: 500,
		// 	slidesToShow: 4,
		// 	slidesToScroll: 4,
		// 	initialSlide: 0,
		// 	responsive: [
		// 		{
		// 			breakpoint: 1024,
		// 			settings: {
		// 				slidesToShow: 3,
		// 				slidesToScroll: 3,
		// 				infinite: true,
		// 				dots: true
		// 			}
		// 		},
		// 		{
		// 			breakpoint: 600,
		// 			settings: {
		// 				slidesToShow: 2,
		// 				slidesToScroll: 2,
		// 				initialSlide: 2
		// 			}
		// 		},
		// 		{
		// 			breakpoint: 480,
		// 			settings: {
		// 				slidesToShow: 1,
		// 				slidesToScroll: 1
		// 			}
		// 		}
		// 	]
		// };
		const {
			history
		} = this.props

		return (
			<div className="LandingPage">
				{/* <ModalDetail showModal={showModal} closeModal={this.closeDetailModal} modalType={modalType} /> */}
				<ModalNonProfit showModal={showModal} closeModal={this.closeModal} modalType={modalType} />

				<div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', maxWidth: '1140px', margin: '50px auto' }}>
					<div>
						<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Nonprofits</span>
						<div style={{ marginTop: '20px' }}>
							<img src="/images/ui-icon/landing/non-profit-img1.svg" style={{ width: '1000px' }} alt="" />
						</div>
					</div>
				</div>
				<div style={{ marginTop: '50px', textAlign: 'center' }}>
					<span className="hide-mobile" style={{ fontSize: '24px', color: '#1AAAFF', fontWeight: 'bold' }}>
						Save Time and Money Manage all Aspects of your <br></br>
						Nonprofit Organization from one place.
					</span>
					<span className="show-mobile" style={{ fontSize: '24px', color: '#1AAAFF', fontWeight: 'bold', lineHeight: '32px' }}>
						Manage all Aspects of your <br></br>
						Nonprofit Organization from One place.
					</span>
					<div style={{ marginTop: '20px' }}>
						<span style={{ fontSize: '18px', lineHeight: '32px' }}>
							OneGivv is the Nonprofit Social, Marketing, CRM and Donation Platform helping charities
						<br></br>
							grow their giving as well as building better relationships with donors.
						</span>
					</div>
				</div>
				<div className='nonprofit-givig-panel'>
					<div>
						<div style={{ display: 'flex' }}>
							<img src="/images/ui-icon/landing/nonprofit-icon-giving.svg" alt="" />
							<div style={{ marginTop: '10px', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
								<span style={{ fontSize: '16px', color: '#1AAAFF', fontWeight: 'bold' }}>GIVING</span>
								<span style={{ fontSize: '16px', color: '#324148', marginTop: '5px' }}>
									Streamline the giving process! Post opportunities for givers to volunteer, donate, and request pick ups for items they want to donate.
								</span>
								<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('giving')}>LEARN MORE</span>
							</div>
						</div>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<img src="/images/ui-icon/landing/nonprofit-icon-social.svg" alt="" />
							<div style={{ marginTop: '10px', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
								<span style={{ fontSize: '16px', color: '#1AAAFF', fontWeight: 'bold' }}>SOCIAL</span>
								<span style={{ fontSize: '16px', color: '#324148', marginTop: '5px' }}>
									Be a part of something greater! Utilize the social feature to grow your donor reach, and engage with your network easily.
								</span>
								<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('social')}>LEARN MORE</span>
							</div>
						</div>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<img src="/images/ui-icon/landing/nonprofit-icon-crm.svg" alt="" />
							<div style={{ marginTop: '10px', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
								<span style={{ fontSize: '16px', color: '#1AAAFF', fontWeight: 'bold' }}>CRM</span>
								<span style={{ fontSize: '16px', color: '#324148', marginTop: '5px' }}>
									OneGivv CRM makes donor management easy. It works seamlessly with our social and giving features providing a single, data-rich view of donors.
								</span>
								<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('crm')}>LEARN MORE</span>
							</div>
						</div>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<img src="/images/ui-icon/landing/nonprofit-icon-report.svg" alt="" />
							<div style={{ marginTop: '10px', marginLeft: '10px', display: 'flex', flexDirection: 'column' }}>
								<span style={{ fontSize: '16px', color: '#1AAAFF', fontWeight: 'bold' }}>Impact Report</span>
								<span style={{ fontSize: '16px', color: '#324148', marginTop: '5px' }}>
									Share your impact! Update each successful project you run on OneGivv. Increase your productivity. Let OneGivv do the heavy lifting.
								</span>
								<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('report')}>LEARN MORE</span>
							</div>
						</div>
					</div>
					<div style={{ marginLeft: '30px' }}>
						<img src="/images/ui-icon/landing/nonprofit-img2.svg" style={{ width: '400px' }} alt="" />
					</div>
				</div>

				<div className="nonprofit-mobile-giving-panel">
					<div style={{ display: 'flex', width: '145px' }}>
						<img src="/images/ui-icon/landing/nonprofit-icon-giving.svg" style={{ width: '75px', height: '75px' }} alt="" />
						<span style={{ color: '#1AAAFF', fontSize: '16px', fontWeight: 'bold', alignSelf: 'center', marginLeft: '16px' }}>GIVING</span>
					</div>
					<div style={{ width: '286px' }}>
						<span style={{ fontSize: '16px', color: '#324148', marginTop: '11px', lineHeight: '19px' }}>
							Streamline the giving process! Post opportunities for givers to volunteer, donate, and request pick ups for items they want to donate.
						</span>
					</div>

					<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('giving')}>
						LEARN MORE
					</span>

					<div style={{ display: 'flex', width: '145px', marginTop: '39px' }}>
						<img src="/images/ui-icon/landing/nonprofit-icon-social.svg" style={{ width: '75px', height: '75px' }} alt="" />
						<span style={{ color: '#1AAAFF', fontSize: '16px', fontWeight: 'bold', alignSelf: 'center', marginLeft: '16px' }}>SOCIAL</span>
					</div>
					<div style={{ width: '286px' }}>
						<span style={{ fontSize: '16px', color: '#324148', marginTop: '11px', lineHeight: '19px' }}>
							Be a part of something greater! Utilize the social feature to grow your donor reach, and engage with your network easily.
						</span>
					</div>

					<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('social')}>
						LEARN MORE
					</span>

					<div style={{ display: 'flex', width: '145px', marginTop: '39px' }}>
						<img src="/images/ui-icon/landing/nonprofit-icon-crm.svg" style={{ width: '75px', height: '75px' }} alt="" />
						<span style={{ color: '#1AAAFF', fontSize: '16px', fontWeight: 'bold', alignSelf: 'center', marginLeft: '16px' }}>CRM</span>
					</div>
					<div style={{ width: '286px' }}>
						<span style={{ fontSize: '16px', color: '#324148', marginTop: '11px', lineHeight: '19px' }}>
							OneGivv CRM makes donor management easy. It works seamlessly with our social and giving features providing a single, data-rich view of donors.
						</span>
					</div>

					<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('crm')}>
						LEARN MORE
					</span>

					<div style={{ display: 'flex', width: '145px', marginTop: '39px' }}>
						<img src="/images/ui-icon/landing/nonprofit-icon-report.svg" style={{ width: '75px', height: '75px' }} alt="" />
						<span style={{ color: '#1AAAFF', fontSize: '16px', fontWeight: 'bold', alignSelf: 'center', marginLeft: '16px' }}>Impact Report</span>
					</div>
					<div style={{ width: '286px' }}>
						<span style={{ fontSize: '16px', color: '#324148', marginTop: '11px', lineHeight: '19px' }}>
							Share your impact! Update each successful project you run on OneGivv. Increase your productivity! Let OneGivv do the heavy lifting.
						</span>
					</div>

					<span style={{ fontSize: '14px', color: '#979797', marginTop: '5px', cursor: 'pointer' }} onClick={this.openModal('crm')}>
						LEARN MORE
					</span>

				</div>

				<div className="show-mobile" style={{ marginTop: '43px' }}>
					<img src="/images/ui-icon/landing/mobile_view.svg" alt="" />
				</div>

				<div className="nonprofit-help-panel">
					<div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
						<span style={{ color: '#1AAAFF', fontSize: '24px', fontWeight: '900' }}>How Do We Help Your Donors?</span>
						<span style={{ fontSize: '16px', marginTop: '40px' }}>
							We provide your donors with multiple ways to give to your organization, such as through donations, volunteering for projects or being able to request PickUps for items they want to donate. They are also able to keep track of all their giving history and view donation receipts all from their profile!
						</span>
						<span style={{ fontSize: '16px', marginTop: '25px' }}>
							With our social feature, we allow donors to post, share comment and connect with their friends and family. They are able to see all your updates and projects as well as share your posts with their network!
						</span>
					</div>
					<img src='/images/ui-icon/nonprofit/nonprofit_help_your_donors.svg' className='help_your_donors' alt='nonprofit_help_your_donors' />
				</div>

				<div className="nonprofit-mobile-help-panel" >
					<img src="/images/ui-icon/nonprofit/nonprofit_help_your_donors.svg" className='help_your_donors' alt='nonprofit_help_your_donors_mobile' />
					<span style={{ color: '#1AAAFF', fontSize: '24px', lineHeight: '28px', fontWeight: '900' }}>
						How Do We Help Your Donors?
					</span>
					<div style={{ width: '311px', marginTop: '34px' }}>
						<span style={{ color: '#324148', fontSize: '16px', lineHeight: '24px' }}>
							We provide your donors with multiple ways to give to your organization, such as through donations, volunteering for projects or being able to request PickUps for items they want to donate. They are also able to keep track of all their giving history and view donation receipts all from their profile!
							<br /><br />
							With our social feature, we allow donors to post, share comment and connect with their friends and family. They are able to see all your updates and projects as well as share your posts with their network!
						</span>
					</div>
				</div>

				<OfferNonprofits />

				{/* <Slider {...slickSettings}>
					<div style={{width: '262px', height: '474px', background: 'blue'}}></div>
				</Slider> */}
				{/* <div className="nonprofit-slider">
					<Slider {...settings}>
						<div>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<div style={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: 'rgb(133, 207, 251)', borderWidth: '15px 0px 0px 0px', borderStyle: 'solid', width: '262px', height: '395px', marginTop: '53px', marginRight: '10px' }}>
									<span style={{ color: '#707070', fontSize: '34px', fontWeight: '200', lineHeight: '40px', marginTop: '15px' }}>Basic</span>
									<span style={{ color: '#000', fontSize: '36px', fontWeight: 'normal', lineHeight: '42px', marginLeft: '30px', marginRight: '30px', marginTop: '9px' }}>Free Forever</span>
									<span style={{ color: '#333333', fontSize: '14px', fontWeight: '500', marginTop: '28px', lineHeight: '17px' }}>Giving Platform</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Basic Donation Analytics</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Volunteer Management</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Social Media Feature</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Import up-to 2,500 Contacts</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>3Connected Users</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Deduction Email Receipts</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Email Support</span>

									<div style={{ position: 'relative', top: '20px', marginTop: '22px' }}>
										<button className="white-rnd-btn cursor-btn">Get Started</button>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<div style={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: '#1AAAFF', borderWidth: '35px 0px 0px 0px', borderStyle: 'solid', width: '262px', marginTop: '20px', height: '439px', marginRight: '10px' }}>
									<span style={{ color: '#fff', fontWeight: 'bold', marginTop: '-22px', lineHeight: '14px' }}>MOST POPULAR</span>
									<span style={{ color: '#707070', fontSize: '34px', fontWeight: '200', lineHeight: '40px', marginTop: '33px' }}>Standard</span>
									<span style={{ color: '#666', fontSize: '36px', fontWeight: 'normal', lineHeight: '42px', marginLeft: '30px', marginRight: '30px', marginTop: '9px' }}>Contact Us</span>
									<span style={{ color: '#333333', fontSize: '14px', fontWeight: '500', marginTop: '21px', lineHeight: '17px' }}>Everything from the <span style={{ color: '#1AAAFF' }}>Basic plan</span></span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Donor Insight + Analytics</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Event Creation(RSVP)</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Import up-to 7,500 Contacts</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>5Connected Users</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Email & Phone Support</span>

									<div style={{ position: 'relative', top: '120px' }}>
										<button className="sky-rnd-btn cursor-btn">Contact Us</button>
									</div>
								</div>
							</div>
						</div>
						<div>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<div style={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: 'rgb(133, 207, 251)', borderWidth: '15px 0px 0px 0px', borderStyle: 'solid', width: '262px', height: '395px', marginTop: '53px' }}>
									<span style={{ color: '#707070', fontSize: '34px', fontWeight: '200', lineHeight: '40px', marginTop: '15px' }}>Pro</span>
									<span style={{ color: '#666', fontSize: '36px', fontWeight: 'normal', lineHeight: '42px', marginLeft: '30px', marginRight: '30px', marginTop: '9px' }}>Contact Us</span>
									<span style={{ color: '#333333', fontSize: '14px', fontWeight: '500', marginTop: '28px', lineHeight: '17px', marginLeft: '37px', marginRight: '37px' }}>
										Everything from the <span style={{ color: '#1AAAFF' }}>Basic</span> & <span style={{ color: '#1AAAFF' }}>Standard plan</span>
									</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>AI Donor Insight + Analytics</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Import up-to 25,000 Contacts</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>10Connected Users</span>
									<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Dedicated Support Coach</span>
									<div style={{ position: 'relative', top: '62px', marginTop: '22px' }}>
										<button className="white-rnd-btn cursor-btn">Contact Us</button>
									</div>
								</div>
							</div>
						</div>
					</Slider>
				</div> */}

				{/* <div className="nonprofit-plan-panel">
					<div style={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: 'rgb(133, 207, 251)', borderWidth: '15px 0px 0px 0px', borderStyle: 'solid', width: '262px', marginRight: '10px', height: '395px', marginTop: '53px' }}>
						<span style={{ color: '#707070', fontSize: '34px', fontWeight: '200', lineHeight: '40px', marginTop: '15px' }}>Basic</span>
						<span style={{ color: '#000', fontSize: '36px', fontWeight: 'normal', lineHeight: '42px', marginLeft: '30px', marginRight: '30px', marginTop: '9px' }}>Free Forever</span>
						<span style={{ color: '#333333', fontSize: '14px', fontWeight: '500', marginTop: '28px', lineHeight: '17px' }}>Giving Platform</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Basic Donation Analytics</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Volunteer Management</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Social Media Feature</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Import up-to 2,500 Contacts</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>3 Connected Users</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Deduction Email Receipts</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Email Support</span>

						<div style={{ position: 'relative', top: '20px', marginTop: '22px' }}>
							<button className="white-rnd-btn cursor-btn" onClick={e => history.push(`?modal=${signUp}`)}>
								Get Started
							</button>
						</div>
					</div>

					<div style={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: '#1AAAFF', borderWidth: '35px 0px 0px 0px', borderStyle: 'solid', width: '262px', marginLeft: '10px', marginRight: '10px', marginTop: '20px', height: '439px' }}>
						<span style={{ color: '#fff', fontWeight: 'bold', marginTop: '-22px', lineHeight: '14px' }}>MOST POPULAR</span>
						<span style={{ color: '#707070', fontSize: '34px', fontWeight: '200', lineHeight: '40px', marginTop: '33px' }}>Standard</span>
						<span style={{ color: '#666', fontSize: '36px', fontWeight: 'normal', lineHeight: '42px', marginLeft: '30px', marginRight: '30px', marginTop: '9px' }}>Contact Us</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '21px', lineHeight: '17px' }}>Everything from the <span style={{ color: '#1AAAFF' }}>Basic plan</span></span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Donor Insight + Analytics</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Event Creation(RSVP)</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Import up-to 7,500 Contacts</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>5 Connected Users</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Email & Phone Support</span>

						<div style={{ position: 'relative', top: '140px' }}>
							<button className="sky-rnd-btn cursor-btn" onClick={this.onClickContactUs}>
								Contact Us
							</button>
						</div>
					</div>

					<div style={{ textAlign: 'center', backgroundColor: '#fff', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', borderRadius: '10px', borderColor: 'rgb(133, 207, 251)', borderWidth: '15px 0px 0px 0px', borderStyle: 'solid', width: '262px', marginLeft: '10px', height: '395px', marginTop: '53px' }}>
						<span style={{ color: '#707070', fontSize: '34px', fontWeight: '200', lineHeight: '40px', marginTop: '15px' }}>Pro</span>
						<span style={{ color: '#666', fontSize: '36px', fontWeight: 'normal', lineHeight: '42px', marginLeft: '30px', marginRight: '30px', marginTop: '9px' }}>Contact Us</span>
						<span style={{ color: '#333333', fontSize: '14px', fontWeight: '500', marginTop: '28px', lineHeight: '17px', marginLeft: '37px', marginRight: '37px' }}>
							Everything from the <span style={{ color: '#1AAAFF' }}>Basic</span> & <span style={{ color: '#1AAAFF' }}>Standard plan</span>
						</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>AI Donor Insight + Analytics</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Import up-to 25,000 Contacts</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>10 Connected Users</span>
						<span style={{ color: '#333', fontSize: '14px', fontWeight: '500', marginTop: '9px', lineHeight: '17px' }}>Dedicated Support Coach</span>

						<div style={{ position: 'relative', top: '62px', marginTop: '45px' }}>
							<button className="white-rnd-btn cursor-btn" onClick={this.onClickContactUs}>
								Contact Us
							</button>
						</div>
					</div>
				</div> */}

				<div className="nonprofit-subscribe-panel">
					<span style={{ fontSize: '24px', color: '#fff' }}>
						Ready to see how OneGivv can help you save time, <br></br>raise more money & do more good?
					</span>
					<div style={{ marginTop: '20px' }}>
						<button className="schedule-btn cursor-btn no-outline-btn" onClick={this.onClickDemo}>
							Schedule a Demo
						</button>
						<button className="signup-free-btn cursor-btn no-outline-btn" onClick={e => history.push(`?modal=${signUp}`)}>
							Signup for Free
						</button>
					</div>
				</div>

				<div className="nonprofit-mobile-subscribe-panel">
					<span style={{ marginTop: '15px', marginLeft: '40px', marginRight: '40px', color: 'white', fontSize: '24px', lineHeight: '24px' }}>Ready to see how OneGivv can help you save time, raise more money & do more good?</span>
					<div style={{ marginTop: '20px', marginBottom: '32px' }}>
						<button className="schedule-btn cursor-btn" onClick={this.onClickDemo}>
							Schedule a Demo
						</button>
						<button className="signup-free-btn cursor-btn" onClick={e => history.push(`?modal=${signUp}`)}>
							Signup for Free
						</button>
					</div>
				</div>

				<Footer />
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
	)(NonProfit)
)