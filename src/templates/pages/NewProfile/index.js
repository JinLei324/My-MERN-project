import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

// import { Hints } from 'intro.js-react';
import numeral from 'numeral';

import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Geocode from 'react-geocode';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import queryString from 'query-string';

import { history } from '../../../store';

import Modal from '../../common/Modal';
import Card from '../../common/Card';
import Button from '../../common/Button';
import UserAvatar from '../../common/userComponents/userAvatar';

import { getUserProfile, unfollowThisUser, followThisUser } from '../../../actions/followsAction';
import { uploadProfilePicture, deleteProfilePicture, setIsClaimed } from '../../../actions/user';

import { NONPROFIT, DONOR, COMMUNITY } from '../../../helpers/userRoles';
import { DONATION, PICKUP, VOLUNTEER } from '../../../helpers/projectTypes';
import { ACCEPT, PENDING } from '../../../helpers/followStatus';

import { signIn } from '../../../templates/common/authModals/modalTypes';

// import MySharedPostList from './MySharedPostList';
import MissionForm from './MissionForm';
import MediaList from './MediaList';
import PostList from '../Post/PostList';
import UserDetailInfo from './UserDetailInfo';
import FinancialInfo from './FinancialInfo';
import MobileInfo from './MobileInfo';

import DonateForm from './DonateForm';
import PickupForm from './PickupForm';
import VolunteerForm from './VolunteerForm';
import ClaimModal from './ClaimModal';
import MyGive from './MyGive';
import AboutMe from './AboutMe';

import PostForm from '../Post/PostForm';

Geocode.setApiKey(process.env.GEOCODE_API_KEY);

class NewProfile extends Component {

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
        ],
        donorAddressCity: '',
        donorAddressState: ''
	}

	constructor(props) {
		super(props)
		this.previewRef = React.createRef()
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
						if (state.user.role === NONPROFIT) {
							e.hint = "Change your organization's background image here!";
						} else if (state.user.role !== NONPROFIT) {
							e.hint = "Change your donor's background image here!";
						}
					}
					if (state.user.role === NONPROFIT && e.id === 3)
						return false
					if (state.user.role !== NONPROFIT && e.id === 4)
						return false
					if (state.user.role !== NONPROFIT && e.id === 1)
						return false
					if (!state.user.hints.includes(e.id))
						return e;

					return false;
				})
			}
		}
		state.curUserId = currUsId;
		return state;
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
        
		this._mounted = true;
        this.props.dispatch(getUserProfile(this.props.match.params.id));
        
        if (!this.props.user)
            return;

        let address = this.props.user.donorAddress;
        
        geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
                Geocode.fromLatLng(lat, lng).then(
                    response => {
                        const address_components = response.results[0].address_components;
                        for (let i = 0; i < address_components.length; i++) {
                            const each_address = address_components[i];
                            for (const key in each_address) {
                                if (key === 'types') {
                                    if (each_address[key].includes('locality') && each_address[key].includes('political')) {
                                        this.setState({ donorAddressCity: each_address.long_name });
                                    } else if (each_address[key].includes('administrative_area_level_1') && each_address[key].includes('political')) {
                                        this.setState({ donorAddressState: each_address.long_name });
                                    }
                                }
                            }
                        }
                    },
                    error => {
                      console.log('geocode error!'); console.error(error);
                    }
                );
            });
            
        const searchParams = queryString.parse(this.props.location.search);
		if (searchParams.immediateDonation) {
            setTimeout(() => {
                this.setState({
                    showHelpMenu: false,
                    showGiveForm: DONATION
                });
            }, 700);
		}
    }

    componentWillUnmount() {
		this._mounted = false
	}

    openSelectFile = isOther => e => {
		if (!isOther && this.props.isAuth)
			this.previewRef.current.click();
    }

    toggleSubmenu = e => {
		if (e)
			e.stopPropagation();

        this.setState({showToggle: true})
    }

    leaveMouseoutOfMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showToggle: false});
    }

    deleteProfilePicture = e => {
		this.props.dispatch(deleteProfilePicture());
	}

    toggleHelMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showHelpMenu: true});
	}

	closeHelpMenu = e => {
		if (e)
			e.stopPropagation();

		this.setState({showHelpMenu: false});
    }

    onClickGive = type => e => {
		this.setState({showHelpMenu: false, showGiveForm: type});
    }

    onClickMessage = e => {
		if (this.state.user.followingStatus === ACCEPT) {
			this.props.history.push(`/${this.props.userId}/chats?other=${this.state.user._id}`);
		} else {
			this.setState({showFollowMessage: true});
		}
	}

    changeFile = e => {
		if (e && e.target && e.target.files && e.target.files.length === 0)
			return;

        if (e.target.files[0].type !== 'image/jpeg' &&
            e.target.files[0].type !== 'image/png'
		) {
			this.props.toggleNotification({
				isOpen: true,
				resend: false,
				firstTitle: 'Error',
				secondTitle: 'You can only upload image files',
				buttonText: 'Ok'
			});
		} else {
			if (e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.props.dispatch(uploadProfilePicture({file: e.target.files[0]}));
				this.previewRef.current.value = "";
				this.setState({showToggle: false});
			} else {
				this.props.toggleNotification({
                    isOpen: true,
                    resend: false,
                    firstTitle: 'Error',
                    secondTitle: 'Photo should be up to 10mb',
                    buttonText: 'Ok'
                });
			}
		}
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

    toggleDonorStats = e => {
		const { user } = this.state;
		if (!user.isLocked) {
			if (e)
				e.stopPropagation();

            this.setState({showDonorStats: !this.state.showDonorStats});
            
            var myGivingBodys = document.getElementsByClassName("myGivingSection");
            if (myGivingBodys && myGivingBodys.length > 0) {
                var myGivingBody = myGivingBodys[0];

                window.scrollTo({
                    top: myGivingBody.offsetTop,
                    behavior: 'smooth'
                });
            }
		}
    }

    unfollowUser = userId => {
		this.props.dispatch(unfollowThisUser(userId))
	}

	followUser = userId => {
		this.props.dispatch(followThisUser(userId))
    }

    showAddPost = e => {
		this.setState({showAddPostModal : true});
	}

	closeAddPost = e => {
		this.setState({showAddPostModal: false});
	}

    selectTab = tab => {
		let { user } = this.state;
		if (!user.isLocked)
			this.setState({
				showDonorStats: false,
				selTab: tab
			});
    }

    claim = e => {
		e.preventDefault();
		this.setState({showClaimModal: true})
	}

	closeClaimModal = e => {
		this.setState({showClaimModal: false})
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

    onSupport = e => {
		this.setState({showClaimModal: false}, () => {
			window.Intercom('showNewMessage');
		})
    }

    onClickBack = () => {
		history.goBack();
	}

    render() {
        let {
			curUserId,
			user,
			isOther,
			// showNeedVerifyModal,
			showAddPostModal,
			selTab,
			showToggle,
			showHelpMenu,
			showDonorStats,
			showGiveForm,
			showFollowMessage,
			// hints,
			// showHints,
            showClaimModal,
            donorAddressCity,
            donorAddressState,
			// showClaimResult,
			// claimResult
        } = this.state;
        
        const { isAuth } = this.props;

        return (
            <div className={`newProfileWrapper`}>
                <section className="profileBody">
                    { isOther &&
						<img className='btn-go-back' src='/images/ui-icon/arrow-left.svg' alt='btn-back' onClick={this.onClickBack} />
					}
                    {/* <Hints
						enabled={showHints}
						hints={hints}
						onClose={this.onCloseHint}
						ref={hints => this.hintRef = hints} /> */}
					<Modal
                        className="zeroBorderRadius"
						showModal={showFollowMessage}
						closeModal={() => this.setState({showFollowMessage: false})}
						title="You must be following this user to message them" />
                    <Card className="myProfilePage" padding="0px">
                        <div className="profileInfo">
                            <div className="headerPicture hintProfileImage">
                                { !user.profilePicture &&
                                    <div className="noPicture" onClick={this.openSelectFile(isOther)}>
                                        <img src="/images/ui-icon/profile/nonprofit-cover-image.svg" alt="" />
                                        <div className="mainPicture">
                                            {/* { isAuth && !isOther &&
                                                <div className="content">
                                                    <img src="/images/ui-icon/icon-image.svg" alt="" />
                                                    <span>Choose photo for background</span>
                                                </div>
                                            } */}
                                        </div>
                                        <div className="gradientOverlay" />
                                    </div>
                                }
                                { user.profilePicture &&
                                    <div className="realPicture">
                                        <img src={user.profilePicture} alt="" />
                                        <div className="gradientOverlay" />
                                        { !isOther &&
                                            <div>
                                                <span className="actionPicture" onClick={this.toggleSubmenu}>
                                                    <FontAwesomeIcon icon="ellipsis-h" />
                                                </span>
                                                <div className={`editMenu ${showToggle ? 'open' : ''}`}>
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
                                            </div>
                                        }
                                    </div>
                                }
                                <input
                                    type="file"
                                    ref={this.previewRef}
                                    onChange={this.changeFile}
                                    accept="image/*" />
                            </div>
                            <div className="userInfo">
                                <div className="userWrapper">
                                    <UserAvatar
                                        imgUser={user.avatar}
                                        userId={user._id}
                                        size={100}
                                        imgUserType={0} />
                                    <div className="userTitleBody">
                                        <p className="userName">
                                            { user.companyName
                                                ? user.companyName
                                                : user.firstName
                                                    ? user.firstName +
                                                    ' ' +
                                                    user.lastName
                                                    : ''
                                            }
                                        </p>
                                        <p className='address'>
                                            <img className='geoLocationIcon' src='/images/ui-icon/profile/icon-geo-location.svg' alt='icon-location' />
                                            { ( user.role !== DONOR && user.address && user.address.city && user.address.state )
                                                ? user.address.city + ', ' + user.address.state
                                                : ''
                                            }
                                            { ( user.role === DONOR && (donorAddressCity || donorAddressState) )
                                                ? donorAddressCity + ', ' + donorAddressState
                                                : ''
                                            }
                                        </p>
                                    </div>
                                    { user.isApproved && user.role === NONPROFIT &&
                                        <img alt='' src='/images/ui-icon/check_mark.svg' className='checkMark' />
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="userDetailInfo">
                            <div className="infoBody">
                                <div className="eachInfo">
                                    { user.role === NONPROFIT ? (
                                        <NavLink
                                            to={`/${user._id}/projects/current-user?future=true&createdBy=true`}
                                            className="hint-my-project column">
                                            <p className="number">
                                                { user.projectsCount
                                                    ? this.setPrettyNumbers(user.projectsCount)
                                                    : 0 }
                                            </p>
                                            <p className="label">Projects</p>
                                        </NavLink>
                                    ) : (
                                        <div>
                                            <span className="column" onClick={this.toggleDonorStats}>
                                                <p className="number">
                                                    <img src="/images/ui-icon/profile/my-giving-icon.svg" alt="" />
                                                </p>
                                                <p className={`${!isOther ? 'hint-my-giving' : ''} label`}>
                                                    My giving
                                                </p>
                                            </span>
                                            <div className={`blueUnderline ${showDonorStats ? 'show' : ''}`}></div>
                                        </div>
                                    ) }
                                </div>
                                <div className="eachInfo">
                                    { !user.isLocked &&
                                        <NavLink
                                            to={`/${user._id}/connects/followers`}
                                            className="column">
                                            <p className="number">
                                                { user.followersCount
                                                    ? this.setPrettyNumbers(
                                                            user.followersCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Followers</p>
                                        </NavLink>
                                    }
                                    { user.isLocked &&
                                        <div className="column">
                                            <p className="number">
                                                { user.followersCount
                                                    ? this.setPrettyNumbers(
                                                            user.followersCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Followers</p>
                                        </div>
                                    }
                                </div>
                                <div className="eachInfo">
                                    { !user.isLocked &&
                                        <NavLink
                                            to={`/${user._id}/connects/following`}
                                            className="column">
                                            <p className="number">
                                                { user.followingCount
                                                    ? this.setPrettyNumbers(
                                                            user.followingCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Following</p>
                                        </NavLink>
                                    }
                                    { user.isLocked &&
                                        <div className="column">
                                            <p className="number">
                                                { user.followingCount
                                                    ? this.setPrettyNumbers(
                                                            user.followingCount
                                                    )
                                                    : 0}
                                            </p>
                                            <p className="label">Following</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="middleBody"></div>
                            <div className="actionBody">
                                <div className="buttonGroups">
                                    { isOther &&
                                        <div className="twoButtons">
                                            { user.followingStatus < PENDING && isAuth &&
                                                <button onClick={() => this.followUser(user._id)}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Follow</span>
                                                </button>
                                            }
                                            { user.followingStatus === PENDING && isAuth &&
                                                <button onClick={() => this.unfollowUser(user._id)}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Requested</span>
                                                </button>
                                            }
                                            { user.followingStatus === ACCEPT && isAuth &&
                                                <button onClick={() => this.unfollowUser(user._id)}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Unfollow</span>
                                                </button>
                                            }
                                            { !isAuth &&
                                                <button onClick={() => {history.push(`?modal=${signIn}`)}}>
                                                    <img className="desktop" src="/images/ui-icon/profile/follow_icon.svg" alt="follow-icon" />
                                                    <img className="mobile" src="/images/ui-icon/profile/follow_icon_inverse.svg" alt="follow-icon" />
                                                    <span>Follow</span>
                                                </button>
                                            }
                                            <button onClick={this.onClickMessage}>
                                                <img className="desktop" src="/images/ui-icon/profile/message_icon.svg" alt="message-icon" />
                                                <img className="mobile" src="/images/ui-icon/profile/message_icon_inverse.svg" alt="follow-icon" />
                                                <span>Message</span>
                                            </button>
                                        </div>
                                    }
                                    { isAuth && !isOther && (
                                        <div className="buttons postBtnBody">
                                            <Button
                                                label="Post"
                                                padding="4px 15px"
                                                fontSize="18px"
                                                inverse
                                                onClick={this.showAddPost} />
                                        </div>
                                    ) }
                                    { isOther && user.isApproved && user.role === NONPROFIT &&
                                        <div className="buttons">
                                            <button onClick={this.toggleHelMenu}>
                                                <img src="/images/ui-icon/profile/ellipsis_icon.svg" alt="ellipsis-icon" />
                                                <span>Give</span>
                                            </button>
                                            <div className={`helpMenu ${showHelpMenu ? 'open' : ''}`}>
                                                <div className="header text-right" onClick={this.closeHelpMenu}>
                                                    <FontAwesomeIcon icon="times"/>
                                                </div>
                                                <div className="submenu" onClick={this.onClickGive(DONATION)}>
                                                    <img src="/images/ui-icon/profile/give_donate_icon.svg" alt="" />
                                                    <span className="_label">Donate</span>
                                                </div>
                                                <div className="submenu"  onClick={this.onClickGive(PICKUP)}>
                                                    <img src="/images/ui-icon/profile/give_pickup_icon.svg" alt="" />
                                                    <span className="_label">Request PickUp</span>
                                                </div>
                                                <div className="submenu"  onClick={this.onClickGive(VOLUNTEER)}>
                                                    <img src="/images/ui-icon/profile/give_volunteer_icon.svg" alt="" />
                                                    <span className="_label">Volunteer</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>
                <section className="tabSection">
                    <div className="tabBody">
                        <ul className="tabs">
                            <li className={`tabs__tab tab ${selTab === 0 ? "active" : ""}`} onClick={() => {this.selectTab(0)}}>Activity</li>
                            <li className={`tabs__tab tab ${selTab === 1 ? "active" : ""}`} onClick={() => {this.selectTab(1)}}>Media</li>
                            <li
                                className={`${user && user.role === NONPROFIT && "hint-about-me"} tabs__tab tab ${selTab === 2 ? "active" : ""}`}
                                onClick={() => {this.selectTab(2)}}>
                                { user && user.role === NONPROFIT ? "Info" : "About Me" }
                            </li>
                            <li className="tabs__presentation-slider" role="presentation"></li>
                        </ul>
                    </div>
                </section>

                <section className="myGivingSection">
                    { isAuth && showDonorStats && user.role !== NONPROFIT && <MyGive userInfo={user} /> }
                </section>

                <section className="listSection">
                    <div className="listBody desktop">
                        {/* { curUserId && selTab === 0 && (
                            <MySharedPostList selectedUserId={curUserId} />
                        ) } */}

                        { curUserId && selTab === 0 && (
                            <PostList match={{ params: {} }} selectedUserId={curUserId} getAll />
                        ) }
                    </div>
                    <div className="infoBody desktop">
                        { curUserId && selTab === 0 && user.role === NONPROFIT &&
                            <div>
                                <MissionForm user={user} />
                                <Card className="donateFormCard">
                                    <DonateForm selectedUser={user} />
                                </Card>
                            </div>
                        }
                        { curUserId && selTab === 0 && user.role === DONOR &&
                            <AboutMe user={user} isDetail={false} />
                        }
                        { curUserId && selTab === 0 && user.role === COMMUNITY &&
                            <Card className="nonprofit-about-us" padding="9px 12px">
                                <div className="section-title">Community Page:</div>
                                <div className="section-description">{user.aboutUs}</div>
                            </Card>
                        }
                    </div>

                    <div className="infoBody mobile">
                        { curUserId && selTab === 0 && user.role === NONPROFIT &&
                            <MissionForm user={user} />
                        }
                        { curUserId && selTab === 0 && user.role === DONOR &&
                            <AboutMe user={user} />
                        }
                    </div>
                    <div className="listBody mobile">
                        {/* { curUserId && selTab === 0 && (
                            <MySharedPostList selectedUserId={curUserId} />
                        ) } */}

                        { curUserId && selTab === 0 && (
                            <PostList match={{ params: {} }} selectedUserId={curUserId} getAll />
                        ) }
                    </div>
                </section>

                <section className="mediaSection">
                    { curUserId && selTab === 1 && (
						<MediaList selectedUserId={curUserId} />
					) }
                </section>

                { curUserId && selTab === 2 && user.role === NONPROFIT &&
                    <section className={`infoSection desktop`}>
                        <div className="detailInfoBody">
                            <UserDetailInfo user={user} />
                        </div>
                        <div className="finacialsBody">
                            <FinancialInfo user={user} />
                        </div>
                    </section>
                }

                { curUserId && selTab === 2 && user.role === DONOR &&
                    <section className={`infoSection desktop`}>
                        <AboutMe user={user} isDetail={true} />
                    </section>
                }

                { curUserId && selTab === 2 && user.role === NONPROFIT &&
                    <section className={`infoSection mobile`}>
                        <MobileInfo user={user} />
                    </section>
                }

                { curUserId && selTab === 2 && user.role === DONOR &&
                    <section className={`infoSection donor mobile`}>
                        <AboutMe user={user} isDetail={true} />
                    </section>
                }

                <section className="modalSection">
                    { showGiveForm === DONATION &&
						<Modal
                            className="donateFormModal"
							showModal={showGiveForm === DONATION}
							closeModal={()=> {this.setState({showGiveForm: -1})}}>
							<DonateForm
								selectedUser={user}
								closeModal={()=> {this.setState({showGiveForm: -1})}} />
						</Modal>
					}

					{ showGiveForm === PICKUP &&
						<Modal
                            className="pickupFormModal"
							showModal={showGiveForm === PICKUP}
							closeModal={()=> {this.setState({showGiveForm: -1})}}>
							<PickupForm
								selectedUser={user}
								closeModal={()=> {this.setState({showGiveForm: -1})}} />
						</Modal>
					}

					{ showGiveForm === VOLUNTEER &&
						<Modal
                            className="volunteerFormModal"
							showModal={showGiveForm === VOLUNTEER}
							closeModal={()=> {this.setState({showGiveForm: -1})}}>
							<VolunteerForm
								selectedUser={user}
								closeModal={()=> {this.setState({showGiveForm: -1})}} />
						</Modal>
                    }

                    <ClaimModal
						onClaim={this.onClaim}
						onSupport={this.onSupport}
						showModal={showClaimModal}
						closeModal={this.closeClaimModal} />

                    { curUserId && selTab === 0 && user.role === NONPROFIT && (!user.isClaimed) && !user.isApproved &&
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
									<Button className="m-r-5" label="Discover" onClick={this.discover} solid noBorder />
								</div>
								<div>
									<Button className="m-r-5" label="Claim" onClick={this.claim} solid noBorder />
								</div>
							</div>
						</div>
					}

                    { showAddPostModal && (
						<div className={`modal ${showAddPostModal ? 'open' : ''}`} onClick={this.closeAddPost}>
							<div className="modal-content" onClick={(e) => {e.stopPropagation()}}>
								<PostForm match={{params: {} }} hideDialog={this.closeAddPost} />
							</div>
						</div>
                    )}
                </section>
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
)(NewProfile)
