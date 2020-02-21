import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import UserAvatar from '../../../common/userComponents/userAvatar';

import Card from '../../../common/Card';
import Button from '../../../common/Button';
import ConfirmModal from '../../../common/Modal/ConfirmModal';
import { setDonorAvatar, getDonorGiveInfo } from '../../../../actions/user';
import { cancelReceipt, updateReceipt } from '../../../../actions/donate';
import {
    getRecurringList,
    clearRecurringList,
    getReceiptList,
    clearReceiptList,
    getMyAchivementList,
    clearMyAchivementList 
} from '../../../../actions/give';
import RecuringItem from './RecuringItem';
import RecuringSubItem from './RecuringSubItem';
import MyAchivementItem from './MyAchivementItem';

class MyGive extends Component {

    state = {
        selectedAvatar: 0,
        tabIndex: 0,
        skip: 0,
        limit: 10,
        isCurUserpage: false,
        showCancelReceiptModal: false,
        showUpdateReceiptModal: false,
        selectedDonateId: '',
        nonprofitId: '',
        nonprofitName: ''
    }

    static getDerivedStateFromProps(props, state) {
        if (!props.userInfo || !props.user) {
            return state;
        }
        if (props.userInfo._id === props.user._id) {
            state.isCurUserpage = true;
        }
        return state;
    }

    onSelectAvatar = e => {
        const {selectedAvatar} = this.state;
        if (selectedAvatar === 0) {
            return;
        } else {
            this.props.setDonorAvatar({ _id: this.props.user._id, donorAvatar: selectedAvatar });
        }
    }

    onClickAvatar = idx => e => {
        this.setState({ selectedAvatar: idx });
    }

    onClickOtherPage = (tI, nonprofitId = '', nonprofitName = '') => e => {
        this.setState({
            tabIndex: tI,
            nonprofitId: nonprofitId,
            nonprofitName: nonprofitName
        }, () => {
            if (tI === 1) {
                this.props.clearReceiptList();
                this.getReceipt();
            } else if (tI === 2) {
                this.props.clearMyAchivementList();
                this.getMyAchivement();
            } else if (tI === 3) {
                this.props.clearRecurringList();
                this.getRecurring(nonprofitId);
            }
        })
    }

    getRecurring = nonprofitId => {
        let { skip, limit } = this.state
        this.props.getRecurringList({
            skip, limit, nonprofitId: nonprofitId
        })
    }

    getReceipt = () => {
        let { skip, limit, isCurUserpage } = this.state;
        if (isCurUserpage) {
            this.props.getReceiptList({
                skip, limit, sortBy: 'giveAt', sortDirection: -1
            })
        } else {
            this.props.getReceiptList({
                skip, limit, userId: this.props.userInfo._id, sortBy: 'giveAt', sortDirection: -1
            })
        }
    }

    getMyAchivement = () => {
        let { skip, limit } = this.state;
        const { user } = this.props;

        if (!user)
            return;

        this.props.getMyAchivementList({
            skip, limit, _id: user._id, userId: this.props.userInfo._id, sortBy: 'giveAt', sortDirection: -1
        })
    }

    componentDidMount() {
        this.props.user &&
            this.props.getDonorGiveInfo({
                _id: this.props.user._id,
                userId: this.props.userInfo._id
            });
    }

    onClickCancelReceipt = (e) => {
        let { selectedDonateId } = this.state;
        if (selectedDonateId === '') {
            return;
        }

        this.props.cancelReceipt({
            _id: selectedDonateId
        });

        this.setState({showCancelReceiptModal: false});

        e.stopPropagation();
    }

    onClickShowCancelReceiptModal = donateId => e => {
        this.setState({selectedDonateId: donateId, showCancelReceiptModal: true});
    }
    
    onClickCloseCancelReceiptModal = e => {
        this.setState({showCancelReceiptModal: false});
    }

    onClickShowUpdateReceiptModal = donateId => e => {
        this.setState({selectedDonateId: donateId, showUpdateReceiptModal: true});
    }
    
    onClickCloseUpdateReceiptModal = e => {
        this.setState({showUpdateReceiptModal: false});
    }

    render() {
        const { selectedAvatar, tabIndex, isCurUserpage, nonprofitName, showCancelReceiptModal } = this.state;
        const { userInfo, user, recurringList, receiptList, donorGiveInfo, myAchivementList } = this.props; // user: logged in user, userInfo : current profile user        

        return (
            <Card className="donor-stats" padding="15px 18px">
                { isCurUserpage && !user.donorAvatar && 
                    <div className="select-avatar">
                        <div className="title">Select an Avatar</div>
                        <div className="separator-20" />
                        <div className="avatar-wrap">
                            <img className={`avatar ${selectedAvatar === 1 ? 'active' : ''}`} src="/images/ui-icon/profile/avatar-1.png" alt="avatar1" onClick={this.onClickAvatar(1)} />
                            <div className="separator-h-15" />
                            <img className={`avatar ${selectedAvatar === 2 ? 'active' : ''}`} src="/images/ui-icon/profile/avatar-2.png" alt="avatar2" onClick={this.onClickAvatar(2)} />
                        </div>
                        <div className="avatar-wrap">
                            <img className={`avatar ${selectedAvatar === 3 ? 'active' : ''}`} src="/images/ui-icon/profile/avatar-3.png" alt="avatar3" onClick={this.onClickAvatar(3)} />
                            <div className="separator-h-15" />
                            <img className={`avatar ${selectedAvatar === 4 ? 'active' : ''}`} src="/images/ui-icon/profile/avatar-4.png" alt="avatar4" onClick={this.onClickAvatar(4)} />
                        </div>
                        <div className="separator-20" />
                        <div className="_description">
                            This avatar will represent your giving legacy! Click on it whenever you’re on My Giving to see your impact!
                        </div>
                        <div className="separator-20" />
                        <Button
                            label="Next"
                            padding="5px 42px"
                            fontSize="14px"
                            onClick={this.onSelectAvatar}
                        />
                    </div>
                }
                { userInfo.donorAvatar >= 1 && userInfo.donorAvatar <= 4 && tabIndex === 0 && 
                    <div className="stat-wrapper">
                        <div className="avatar-wrap center">
                            <img className="avatar" src={`/images/ui-icon/profile/avatar-${userInfo.donorAvatar}.png`} alt="avatar" />
                            <span className="donor-level">Royalty Giver</span>
                            <div className="separator-15"/>
                        </div>
                        <div className="row">
                            <span className="label">My Rank</span>
                            <span className="value">{ donorGiveInfo.ranking }</span>
                        </div>
                        <div className="row">
                            <span className="label">My Points</span>
                            <span className="value">{ donorGiveInfo.point }</span>
                        </div>
                        <div className="separator-10" />
                        <div className="center total-label">
                            <span className="label">My Giving Totals</span>
                        </div>
                        <div className="separator-10" />
                        <div className="row bot-border">
                            { isCurUserpage && <div className="col">
                                <span className="value number">${ donorGiveInfo.donate }</span>
                                <span className="label gray text-center">Donation</span>
                            </div> }
                            { !isCurUserpage && <div className="col">
                                <span className="value number">{ donorGiveInfo.projectCount }</span>
                                <span className="label gray text-center">Projects Supported</span>
                            </div> }
                            <div className="col">
                                <span className="value number">{ donorGiveInfo.volunteer }</span>
                                <span className="label gray text-center">Volunteer Hours</span>
                            </div>
                            <div className="col">
                                <span className="value number">{ donorGiveInfo.pickup }</span>
                                <span className="label gray text-center">Given Items</span>
                            </div>
                        </div>
                        { isCurUserpage && <div className="row">
                            <div className="stat-btn" onClick={this.onClickOtherPage(1)}>View Receipts</div>
                            <div className="stat-btn" onClick={this.onClickOtherPage(2)}>My Achievement</div>
                        </div> }
                        {/* {!isCurUserpage && <div className="center">
                            <div className="stat-btn" onClick={this.onClickOtherPage(1)}>View Recipts</div>
                        </div>} */}
                    </div>
                }
                {/* { donateList.length !== 0 && donateList.map((e, i) => {
                    return (
                        <Fragment key={e._id}>
                            <DonateItem donation={e} />
                        </Fragment>
                    )
                }) } */}
                { userInfo.donorAvatar >= 1 && userInfo.donorAvatar <= 4 && tabIndex === 1 &&  
                    <div className="stat-wrapper">
                        <div className="center back-title">
                            <img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickOtherPage(0)}/>
                            <div className="title">View Receipts</div>
                            <img className="btn-camera" src="/images/ui-icon/profile/camera-icon.svg" alt=""/>
                        </div>
                        { receiptList && receiptList.length !== 0 && receiptList.map((e, i) => {
                            return (
                                <Fragment key={e.nonprofit._id}>
                                    <RecuringItem
                                        nonprofit={e.nonprofit}
                                        lastDonationAt={e.lastDonationAt}
                                        amount={e.amount}
                                        onClickReceipts={this.onClickOtherPage(3, e.nonprofit._id, e.nonprofit.companyName || e.nonprofit.firstName + " " + e.nonprofit.lastName)}
                                    />
                                </Fragment>
                            )
                        }) }
                    </div>
                }
                { userInfo.donorAvatar >= 1 && userInfo.donorAvatar <= 4 && tabIndex === 2 &&
                    <div className="stat-wrapper">
                        <div className="center back-title">
                            <img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickOtherPage(0)}/>
                            <div className="title">My Achivement</div>
                        </div>
                        { myAchivementList && myAchivementList.length !== 0 && myAchivementList.map((e, i) => {
                            return (
                                <Fragment key={e._id}>
                                    <MyAchivementItem
                                        {...e}
                                    />
                                </Fragment>
                            )
                        })}
                    </div>
                }
                { userInfo.donorAvatar >= 1 && userInfo.donorAvatar <= 4 && tabIndex === 3 &&
                    <div className="stat-wrapper">
                        <div className="center back-title subRecurring" style={{ marginBottom: 15                                                 }}>
                            <img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickOtherPage(1)}/>
                            { (recurringList && recurringList.length === 1 && 
                                recurringList[0].nonprofit) ?
                                <UserAvatar
                                    imgUser={recurringList[0].nonprofit.avatar}
                                    imgUserType={recurringList[0].nonprofit.role}
                                /> : 
                                <UserAvatar
                                />
                            }
                            <div className="title nonprofitName" style={{ marginLeft: 10 }}>{nonprofitName}</div>
                        </div>

                        <div className="center total-label">
                            <span className="label">My Totals</span>
                        </div>
                        <div className="separator-10" />
                        <div className="row bot-border">
                            { isCurUserpage && <div className="col">
                                <span className="value number">${ donorGiveInfo.donate }</span>
                                <span className="label gray text-center">Donation</span>
                            </div> }
                            { !isCurUserpage && <div className="col">
                                <span className="value number">{ donorGiveInfo.projectCount }</span>
                                <span className="label gray text-center">Projects Supported</span>
                            </div> }
                            <div className="col">
                                <span className="value number">{ donorGiveInfo.volunteer }</span>
                                <span className="label gray text-center">Volunteer Hours</span>
                            </div>
                            <div className="col">
                                <span className="value number">{ donorGiveInfo.pickup }</span>
                                <span className="label gray text-center">Given Items</span>
                            </div>
                        </div>
                        <ConfirmModal title="Are you sure you want to cancel this receipt?" showModal={showCancelReceiptModal} closeModal={this.onClickCloseCancelReceiptModal} onClickYes={this.onClickCancelReceipt} onClickNo={this.onClickCloseCancelReceiptModal}/>
                        { recurringList && recurringList.length === 1 && 
                            recurringList[0].donates && 
                            recurringList[0].donates.length !== 0 && 
                            recurringList[0].donates.map((e, i) => {
                                return (
                                    <Fragment key={e._id}>
                                        <RecuringSubItem
                                            nonprofit={recurringList[0].nonprofit}
                                            donate={e}
                                            project={recurringList[0].projects[i]}
                                            onClickEditMenu={this.onClickShowUpdateReceiptModal}
                                            onClickCancelMenu={this.onClickShowCancelReceiptModal}
                                        />
                                    </Fragment>
                                )
                        }) }
                    </div>
                }
            </Card>
        )
    }
}
const mapStateToProps = ({ authentication, give, user }) => ({
    user: authentication.user,
    recurringList: give.recurringList,
    receiptList: give.receiptList,
    donorGiveInfo: user.donorGiveInfo,
    myAchivementList: give.myAchivementList
})

const mapDispatchToProps = {
    setDonorAvatar,
    getRecurringList,
    clearRecurringList,
    getReceiptList,
    clearReceiptList,
    getMyAchivementList,
    clearMyAchivementList,
    getDonorGiveInfo,
    cancelReceipt,
    updateReceipt
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyGive)