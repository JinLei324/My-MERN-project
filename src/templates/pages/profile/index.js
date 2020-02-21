import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import numeral from 'numeral';
import UserAvatar from '../../common/userComponents/userAvatar'
import {
	getUserProfile,
	unfollowThisUser,
	followThisUser
} from '../../../actions/followsAction'

import {
	uploadProfilePicture,
	deleteProfilePicture,
	setIsClaimed
} from '../../../actions/user'

import Button from '../../common/Button'
import { history } from '../../../store'
//import Placeholder from '../../common/noContentPlaceholder'
import Modal from '../../common/Modal'
import { signIn } from '../../../templates/common/authModals/modalTypes'
//import ApproveBanner from './ApproveBanner'
import { NONPROFIT, COMMUNITY } from '../../../helpers/userRoles';
import PostForm from '../Post/PostForm'
import PostList from '../Post/PostList'
//import { clearPosts } from '../../../actions/post';
import Card from '../../common/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserInfo from './UserInfo'
import MediaList from './MediaList';
import DonationForm from './Give/DonationForm';
import PickUpForm from './Give/PickUpForm';
import VolunteerForm from './Give/VolunteerForm';
import { DONATION, PICKUP, VOLUNTEER } from '../../../helpers/projectTypes';
import MyGive from './MyGive';
import AboutMe from './AboutMe';
import { ACCEPT, PENDING } from '../../../helpers/followStatus';
// import { Hints } from 'intro.js-react';
import {
	checkHint
} from '../../../helpers/websocket';
import ClaimModal from './ClaimModal';

class Profile extends Component {

	state = {
		isOther: false,
		user: {},
		showNeedVerifyModal: false,
		showAddPostModal: false,
		showClaimModal: false, 
		curUserId: null,
		selTab: 0,
		showToggle: false,
		showHelpMenu: false,
		showDonorStats: false,
		showGiveForm: -1,
		isLocked : false,
		showFollowMessage: false,
		showHints: true,
		claimResult: "",
		showClaimResult: false,
		basicHints : [
			{
				id: 1,
				element: '.hint-about-me',
				hint: 'Info is where information about your nonprofit, its goals, mission, current contributions, and donor reviews of your organization will be.',
				hintPosition: 'middle-right'
			},
			{
				id: 2,
				element: '.hint-profile-image',
				hint: "Change your organization's background image here!",
				hintPosition: 'middle-middle'
			},
			{
				id: 3,
				element: '.hint-my-giving',
				hint: 'My Giving is where you’ll be able to keep track and access all of your giving stats from volunteer hours to your donation history!',
				hintPosition: 'bottom-left'
			},
			{
				id: 4,
				element: '.hint-my-project',
				hint: "Projects is where you're able to manage all your projects as well as create volunteer opportunities, donation projects, and PickUp requests for supplies you need!",
				hintPosition: 'bottom-left'
			},
			{
                id: 12,
                element: '.hint-receipt',
                hint: "View receipts of all the donations you've made and save donation you made offline by adding screenshots so we can confirm",
                hintPosition: 'middle-left'
            },
            {
                id: 13,
                element: '.hint-recurring',
                hint: 'Manage your recurring donations here, update increase or cancel donation',
                hintPosition: 'middle-left'
            }
		],
		hints: [
		]
	}

	constructor(props) {
		super(props)
		this.previewRef = React.createRef()
	}

	setPrettyNumbers = number => {
		let format,
			leng = ('' + number).length

		if (leng === 0) {
			format = '0'
		} else if (leng <= 3 && leng !== 0) {
			format = numeral(number).format('0a')
		} else if (leng === 4) {
			format = numeral(number).format('0.0aa')
		} else if (leng === 5) {
			format = numeral(number).format('0.0a')
		} else if (leng === 6) {
			format = numeral(number).format('0a')
		} else if (leng === 7) {
			format = numeral(number).format('0.0aa')
		} else if (leng >= 8) {
			format = numeral(number).format('0.0a')
		}

		return format.toUpperCase()
	}

	componentDidMount() {
		this._mounted = true;
		this.props.dispatch(getUserProfile(this.props.match.params.id));
		window.scroll(0, 0);
	}
	componentWillUnmount() {
		this._mounted = false
	}
	unfollowUser = userId => {
		this.props.dispatch(unfollowThisUser(userId))
	}

	followUser = userId => {
		this.props.dispatch(followThisUser(userId))
	}

	onCreateProject = () => {
		if (this.state.user.isApproved) {
			this.props.history.push(`/${this.state.user._id}/project/create`)
		} else {
			this.setState({ showNeedVerifyModal: true })
		}
	}

	closeNeedVerifyModal = e => {
		if (e.target.className && ((e.target.className.includes('modal') && e.target.className.includes('open')) ||
			e.target.className.includes('closeBtn'))) {
			this.setState({ showNeedVerifyModal: false })
		}
	}

	discover = e => {
		e.preventDefault();
		this.props.history.push(`/discovery`)
	}

	claim = e => {
		e.preventDefault();
		this.setState({showClaimModal: true})
	}

	closeClaimModal = e => {
		this.setState({showClaimModal: false})
	}

	static getDerivedStateFromProps(props, state) {
		const currUsId = props.match.params.id
		const myID = props.userId
		state.isOther = !(currUsId === myID)

		if (state.isOther) {
			state.user = props.otherUser
		} else {
			state.user = props.user
			if (state.user) {
				state.hints = state.basicHints.filter(e => {
					if (e.id === 2) {
						if(state.user.role === NONPROFIT)
							e.hint = "Change your organization's background image here!";
						else if(state.user.role !== NONPROFIT) {
							e.hint = "Change your donor's background image here!";
						}
					}
					if(state.user.role === NONPROFIT && e.id === 3)
						return false
					if(state.user.role !== NONPROFIT && e.id === 4)
						return false
					if(state.user.role !== NONPROFIT && e.id === 1)
						return false
					if(!state.user.hints.includes(e.id)) {
						return e
					}
					return false
				})
			}
		}
		state.curUserId = currUsId;
		return state
	}

	showAddPost = e => {
		this.setState({showAddPostModal : true})
	}

	closeAddPost = e => {
		this.setState({showAddPostModal: false})
	}

	selectTab = tab => {
		const {user} = this.state
		if (!user.isLocked)
			this.setState({
				showDonorStats: false,
				selTab: tab
			});
	}

	changeFile = e => {
		if(e.target.files.length === 0)
            return;
        if (
			e.target.files[0].type !== 'image/jpeg' &&
            e.target.files[0].type !== 'image/png' 
		) {
			this.props.toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image files',
					buttonText: 'Ok'
				})
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.props.dispatch(uploadProfilePicture({file: e.target.files[0]}))
				this.previewRef.current.value =""
				this.setState({showToggle: false})
			} else {
				this.props.toggleNotification({
                    isOpen: true,
                    resend: false,
                    firstTitle: 'Error',
                    secondTitle: 'Photo should be up to 10mb',
                    buttonText: 'Ok'
                })
			}
		}
    }

    openSelectFile = isOther => e => {
		if (!isOther && this.props.isAuth)
			this.previewRef.current.click()
	}
	
	
    toggleSubmenu = e => {
        e.stopPropagation();
        this.setState({showToggle: true})
    }
    
    leaveMouseoutOfMenu = e => {
		if (e) {
			e.stopPropagation()
		}
		this.setState({showToggle: false})
	}
	
	deleteProfilePicture = e => {
		this.props.dispatch(deleteProfilePicture());
	}

	toggleHelMenu = e => {
		e.stopPropagation();
		this.setState({showHelpMenu: true})
	}

	closeHelpMenu = e => {
		e.stopPropagation();
		this.setState({showHelpMenu: false})
	}

	toggleDonorStats = e => {
		const { user } = this.state;
		if (!user.isLocked) {
			e.stopPropagation();
			this.setState({showDonorStats: !this.state.showDonorStats})
		}
	}

	closeDonorStat = e => {
		e.stopPropagation();
		this.setState({showDonorStats: false})
	}

	onClickGive = type => e => {
		this.setState({showHelpMenu: false, showGiveForm: type})
	}

	onClickMessage = e => {
		if (this.state.user.followingStatus === ACCEPT) {
			this.props.history.push(`/${this.props.userId}/chats?other=${this.state.user._id}`)
		} else {
			this.setState({showFollowMessage: true})
		}
	}

	onCloseHint = idx => {
		if (!this._mounted)
			return;
		const {hints} = this.state
		const hId = hints[idx].id
		checkHint(hId)
	}

	onClaim = passcode => {
		this.props.dispatch(setIsClaimed({
			userId: this.state.user._id,
			isClaimed: true,
			passcode: passcode,
			cb: data => {
				this.closeClaimModal();
				if (data && data.claimed) {
					this.setState(prevState => ({
						showClaimResult: true, 
						claimResult: "Successfully claimed! Please login with passcode!",
						user: {
							...prevState.user,
							isClaimed: true
						}
					}), () => {
						setTimeout(() => {
							history.push(`/`);
						}, 2000);
					});
				} else {
					this.setState({showClaimResult: true, claimResult: "Fail claimed!"});
				}
			}
		}))
	}

	hideClaimResult = () => {
		this.setState({showClaimResult: false})
	}

	onSupport = e => {
		this.setState({showClaimModal: false}, () => {
			window.Intercom('showNewMessage')
		})
	}

	onClickBack = () => {
		history.goBack();
	}

	render() {
		const { curUserId, 
			user, 
			isOther, 
			showNeedVerifyModal, 
			showAddPostModal, 
			selTab, 
			showToggle, 
			showHelpMenu, 
			showDonorStats, 
			showGiveForm, 
			showFollowMessage,
			hints,
			showHints,
			showClaimModal,
			showClaimResult,
			claimResult
		} = this.state;
		const { isAuth } = this.props;
		
		return (
			<div className="myProfileWrapper">
				{ isOther && <img className='btn-go-back' src='/images/ui-icon/arrow-left.svg' alt='btn-back' onClick={this.onClickBack}></img> }
				{/* <Hints 
					enabled={showHints}
					hints={hints}
					onClose={this.onCloseHint}
					ref={hints => this.hintRef = hints}
				/> */}
				<Modal showModal={showFollowMessage} closeModal={() => this.setState({showFollowMessage: false})} title="You must be following this user to message them" />
				<Card className="MyProfilePage" padding="0px">
					{user && (
						<div className="profile-info">
							<div className="header-picture hint-profile-image">
								{!user.profilePicture && (
									<div className="no-picture"  onClick={this.openSelectFile(isOther)}> 
										<div className="main-picture">
											{/* { isAuth && !isOther && <div className="content">
												<img src="/images/ui-icon/icon-image.svg" alt="" />
												<span>Choose photo for background</span>
											</div> } */}
										</div>
										<div className="gradient-overlay" />
									</div>)}
								{user.profilePicture && (
									<div className="real-picture">
										<img src={user.profilePicture} alt="" />
										<div className="gradient-overlay" />
										{!isOther && <div>
											<span className="action-picture" onClick={this.toggleSubmenu}>
												<FontAwesomeIcon icon="ellipsis-h"/>
											</span>
											<div className={`edit-menu ${showToggle ? 'open' : ''}`}>
												<div className="header text-right" onClick={this.leaveMouseoutOfMenu}>
													<FontAwesomeIcon icon="times"/>
												</div>
												<div className="submenu edit"
													onClick={this.openSelectFile(false)}>
													<img src="/images/ui-icon/icon-edit.svg" alt="" />
													<span className="_label">Edit</span>
												</div>
												<div className="submenu trash"
													onClick={this.deleteProfilePicture}>
													<img src="/images/ui-icon/icon-trash.svg" alt="" />
													<span className="_label">Delete</span>
												</div>
											</div>
										</div>}
									</div>
								)}
								<input
									type="file"
									ref={this.previewRef}
									onChange={this.changeFile}
									accept="image/*"
								/>
							</div>
							<div className="user-info">
								<div className="user-wrapper">
									<UserAvatar
										imgUser={user.avatar}
										imgUserType={user.role}
									/>
									<p className="user-name">
										{ user.companyName
											? user.companyName
											: user.firstName
												? user.firstName +
												' ' +
												user.lastName
												: '' }
										<br />
										<span className='address'>
											{ ( user.address && user.address.city && user.address.state ) ? user.address.city + ', ' + user.address.state : '' }
										</span>
									</p>
									{ user.isApproved && user.role === NONPROFIT && <img alt='' src='/images/ui-icon/check_mark.svg' className='check-mark' /> }
								</div>
								<div className="addition-buttons">
									{ isAuth && !isOther && (
										<div className="buttons">
											<Button className="m-r-5" label="Post" onClick={this.showAddPost} padding="4px 15px" fontSize="14px"
												solid
												noBorder></Button>
										</div>
									) }
									{ isOther && user.isApproved && user.role === NONPROFIT && (
										<div className="buttons">
											<Button
												label="Give"
												padding="4px 15px"
												fontSize="14px"
												onClick={this.toggleHelMenu}
												solid
												noBorder
											/>
											<div className={`help-menu ${showHelpMenu ? 'open' : ''}`}>
												<div className="header text-right" onClick={this.closeHelpMenu}>
													<FontAwesomeIcon icon="times"/>
												</div>
												<div className="submenu" onClick={this.onClickGive(DONATION)}>
													<img src="/images/ui-icon/sidemenu/menu_donation.svg" alt="" />
													<span className="_label">Donate</span>
												</div>
												<div className="submenu"  onClick={this.onClickGive(PICKUP)}>
													<img src="/images/ui-icon/sidemenu/menu_pickup.svg" alt="" />
													<span className="_label">Request PickUp</span>
												</div>
												<div className="submenu"  onClick={this.onClickGive(VOLUNTEER)}>
													<img src="/images/ui-icon/sidemenu/menu_volunteer.svg" alt="" />
													<span className="_label">Volunteer</span>
												</div>
											</div>
										</div>
									)}
								</div>
						 	</div>
							<div className="profile-tab">
								<div className="tabs">
									<div className={`tab-button ${selTab === 0 ? 'active' : ''}`} onClick={() => {this.selectTab(0)}}>Activity</div>
									<div className="but-seperator"></div>
									<div className={`tab-button ${selTab === 1 ? 'active' : ''}`} onClick={() => {this.selectTab(1)}}>Media</div>
									<div className="but-seperator"></div>
									<div className={`${user && user.role === NONPROFIT && 'hint-about-me'} tab-button ${selTab === 2 ? 'active' : ''}`} onClick={() => {this.selectTab(2)}}>{user && user.role === NONPROFIT ? 'Info' : 'About Me'}</div>
								</div>
								<div className="hide-mobile">
									{isAuth && !isOther && (
										<div className="buttons">
											<Button className="m-r-5" label="Post" onClick={this.showAddPost} padding="4px 15px" fontSize="14px" solid
												noBorder></Button>
										</div>
									)}
									{ isOther && user.isApproved && user.role === NONPROFIT &&  (
										<div className="buttons">
											<Button
												label="Give"
												padding="4px 15px"
												fontSize="14px"
												solid
												noBorder
												onClick={this.toggleHelMenu}
											/>
											<div className={`help-menu ${showHelpMenu ? 'open' : ''}`}>
												<div className="header text-right" onClick={this.closeHelpMenu}>
													<FontAwesomeIcon icon="times"/>
												</div>
												<div className="submenu"   onClick={this.onClickGive(DONATION)}>
													<img src="/images/ui-icon/sidemenu/menu_donation.svg" alt="" />
													<span className="_label">Donate</span>
												</div>
												<div className="submenu"  onClick={this.onClickGive(PICKUP)}>
													<img src="/images/ui-icon/sidemenu/menu_pickup.svg" alt="" />
													<span className="_label">Request PickUp</span>
												</div>
												<div className="submenu"  onClick={this.onClickGive(VOLUNTEER)}>
													<img src="/images/ui-icon/sidemenu/menu_volunteer.svg" alt="" />
													<span className="_label">Volunteer</span>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
							<div className="user-detail-info">
								<div className="detail-info">
									{user.role === NONPROFIT ? (
										<NavLink
											to={`/${user._id}/projects/current-user?future=true&createdBy=true`}
											className="hint-my-project column">
											<div className="number">
												{user.projectsCount
													? this.setPrettyNumbers(
															user.projectsCount
													)
													: 0}
											</div>
											<div className="label">Projects</div>
										</NavLink>
									) : (
										<span className="column" onClick={this.toggleDonorStats}>
											<div className="number">
												<img src="/images/ui-icon/icon-stats.svg" alt="" />
											</div>
											<div className={`${!isOther ? 'hint-my-giving' : ''} label`}>
												My Giving
											</div>
										</span>
									)}
									<div className="but-seperator" />
									{!user.isLocked && <NavLink
										to={`/${user._id}/connects/followers`}
										className="column">
										<div className="number">
											{user.followersCount
												? this.setPrettyNumbers(
														user.followersCount
												)
												: 0}
										</div>
										<div className="label">Followers</div>
									</NavLink>}
									{user.isLocked && 
										<div className="column">
											<div className="number">
												{user.followersCount
													? this.setPrettyNumbers(
															user.followersCount
													)
													: 0}
											</div>
											<div className="label">Followers</div>
										</div>}
									<div className="but-seperator" />
									{!user.isLocked && <NavLink
										to={`/${user._id}/connects/following`}
										className="column">
										<div className="number">
											{user.followingCount
												? this.setPrettyNumbers(
														user.followingCount
												)
												: 0}
										</div>
										<div className="label">Following</div>
									</NavLink>}
									{user.isLocked && <div className="column">
										<div className="number">
											{user.followingCount
												? this.setPrettyNumbers(
														user.followingCount
												)
												: 0}
										</div>
										<div className="label">Following</div>
									</div>}
								</div>
								<div className="separator-15" />
								{isOther && (<div className="button-groups">
									<Button label="Message" padding="4px 6px" solid noBorder fontSize="14px" onClick={this.onClickMessage}/>
									<div className="separator-h-10" />
									{user.followingStatus < PENDING &&
										isAuth && (
											<Button label="Follow" padding="4px 10px"  solid noBorder fontSize="14px" onClick={() => this.followUser(user._id)}/>
										)}
									{user.followingStatus === PENDING &&
										isAuth && (
											<Button label="Requested" padding="4px 10px" inverse fontSize="14px" onClick={() => this.unfollowUser(user._id)}/>
										)}
									{user.followingStatus === ACCEPT &&
										isAuth && (
											<Button label="Unfollow" padding="4px 10px" inverse fontSize="14px" onClick={() => this.unfollowUser(user._id)}/>
										)}
									{!isAuth && (
										<Button label="Follow" padding="4px 10px" solid noBorder fontSize="14px" onClick={() => {history.push(`?modal=${signIn}`)}}/>												
									)}
								</div>)}	
							</div>
						</div>
					)}
				</Card>
				<Modal title="Please wait until getting fully verified." showModal={showNeedVerifyModal} closeModal={this.closeNeedVerifyModal} />
				<Modal title={claimResult} showModal={showClaimResult} closeModal={this.hideClaimResult} />
				
				{user.role !== NONPROFIT && user.isLocked && <section className="locked">
					<img className="lock-img" src="/images/ui-icon/profile/icon-lock.svg" alt=""/>
					<div className="separator-20" />
					<div className="lock-title">This account's profile is protected.</div>
					<div className="separator-20" />
					<div className="lock-desc">Only confirmed followers have access to @{user.firstName + " " + user.lastName}'s complete profile. Click the "Follow" button to send a follow request.</div>
				</section>}

				{showAddPostModal && (
					<div className={`modal ${showAddPostModal ? 'open' : ''}`} onClick={this.closeAddPost}>
						<div className="modal-content" onClick={(e) => {e.stopPropagation()}}>
							<PostForm match={{params: {} }} hideDialog={this.closeAddPost}/>
						</div>
					</div>
				)}

				{curUserId && isOther && selTab === 0 && user.role === NONPROFIT && <Card className="nonprofit-about-us" padding="9px 12px">
					<div className="section-title">About Us:</div>
					<div className="section-description">{user.aboutUs}</div>
				</Card>}

				{curUserId && selTab === 0 && user.role === COMMUNITY && <Card className="nonprofit-about-us" padding="9px 12px">
					<div className="section-title">Community Page:</div>
					<div className="section-description">{user.aboutUs}</div>
				</Card>}
				
				{ isAuth && showDonorStats && user.role !== NONPROFIT &&  <MyGive userInfo={user} /> }

				{ curUserId && selTab === 0 && (
					<PostList match={{ params: {} }} selectedUserId={curUserId}/>
				) }

				{ curUserId && selTab === 1 && (
					<MediaList selectedUserId={curUserId} />
				) }

				{ curUserId && user.role === NONPROFIT && selTab === 2 && (
					<UserInfo user={user} isOther={isOther} isAuth={isAuth}/>
				) }

				{ curUserId && user.role !== NONPROFIT && selTab === 2 && (
					<AboutMe user={user} />
				) }

				{ showGiveForm===DONATION && <Modal showModal={showGiveForm===DONATION} closeModal={()=> {this.setState({showGiveForm: -1})}}>
					<DonationForm selectedUser={user} closeModal={()=> {this.setState({showGiveForm: -1})}}/>
				</Modal> }

				{ showGiveForm===PICKUP && <Modal showModal={showGiveForm===PICKUP} closeModal={()=> {this.setState({showGiveForm: -1})}}>
					<PickUpForm selectedUser={user} closeModal={()=> {this.setState({showGiveForm: -1})}}/>
				</Modal> }

				{ showGiveForm===VOLUNTEER && <Modal showModal={showGiveForm===VOLUNTEER} closeModal={()=> {this.setState({showGiveForm: -1})}}>
					<VolunteerForm selectedUser={user} closeModal={()=> {this.setState({showGiveForm: -1})}}/>
				</Modal> }
				<ClaimModal onClaim={this.onClaim} onSupport={this.onSupport} showModal={showClaimModal} closeModal={this.closeClaimModal}/>

				{ curUserId && selTab === 0 && user.role === NONPROFIT && (!user.isClaimed) && !user.isApproved && (
					<div className="profileDiscoverClaim">
						<div className="iconRow">
							<div>
								<img src="/images/ui-icon/profile/research.svg" alt="research" />
							</div>
							<div>
								<img src="/images/ui-icon/profile/user.svg" alt="user" />
							</div>
						</div>
						<div className="descriptionRow">
							<div>
								<p>This nonprofit isn't verified yet. Discover more!</p>
							</div>
							<div>
								<p>Is this your nonprofit organzation? <br/>Claim your profile for Free!</p>
							</div>
						</div>
						<div className="buttonRow">
							<div>
								<Button className="m-r-5" label="Discover" onClick={this.discover} solid noBorder></Button>
							</div>
							<div>
								<Button className="m-r-5" label="Claim" onClick={this.claim} solid noBorder></Button>
							</div>
						</div>
					</div>	
				) }

			</div>
		)
	}
}

const mapStateToProps = ({ authentication, follows }) => ({
	user: authentication.user,
	userId: authentication.userId,
	otherUser: follows.userInfo,
	isAuth: authentication.isAuth
})

export default connect(
	mapStateToProps,
	null,
	null,
	{
		pure: false
	}
)(Profile)