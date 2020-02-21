import React, {Component} from 'react'
import Card from '../../../common/Card';
import UserAvatar from '../../../common/userComponents/userAvatar';
import Button from '../../../common/Button';
import { NONPROFIT } from '../../../../helpers/userRoles';
import { VOLUNTEER, PICKUP, DONATION } from '../../../../helpers/projectTypes'
import moment from 'moment'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { PENDING, ACCEPT, REJECT, CANCEL } from '../../../../helpers/participationTypes';
import {
	requestStatus
} from '../../../../actions/give'
import DonationForm from '../../profile/Give/DonationForm';
import PickUpForm from '../../profile/Give/PickUpForm';
import VolunteerForm from '../../profile/Give/VolunteerForm';
import Modal from '../../../common/Modal'
import ConfirmModal from '../../../common/Modal/ConfirmModal';
import {
	confirmOrRejectParticipation
} from '../../../../actions/project';

class RequestForm extends Component {
    state = {
        showGiveForm: -1,
        showTimeAlert: false,
        showDeleteModal: false,
        modalTitle: "",
    }

    selectType = type => {
		switch (type) {
			case 0:
				return 'volunteer.svg'
			case 1:
				return 'money.svg'
			case 2:
				return 'pink-up.svg'
			default:
				return ''
		}
    }
    
    onClickRequest = status => e => {
        if (status === -1) {
            if (this.props.giveAt < moment().add(12, 'h').unix()) {
                this.setState({showTimeAlert: true})
                return;
            }
            if (this.props.projectRequest) {
                this.props.push(`/${this.props.nonprofit._id}/project/${this.props.projectId}`)
            }
            else  {
                this.setState({showGiveForm: this.props.type})
            }

        } else {
            if(status === CANCEL) {
                if(this.props.giveAt < moment().add(12, 'h').unix()) {
                    this.setState({showTimeAlert: true})
                    return;
                }   
                const {type} = this.props
                this.setState({modalTitle: `Are you sure you want to cancel ${type === 2 ? 'this PickUp request?' : type === 0 ? 'your volunteer activity?' : ''}`})
                this.onClickShowDeleteModal(null)
            }
            else {
                if(this.props.projectRequest) {
                    let need = {}
                    need._id = this.props._id
                    need.projectId = this.props.projectId
                    need.status = status
                    need.projectRequest = true

                    this.props.confirmOrRejectParticipation(need)
                } else {
                    var data = {
                        id: this.props._id,
                        status: status
                    }
                    this.props.requestStatus(data)
                }
             }
        }
    }

    onClickDelete = e => {
        if(this.props.projectRequest) {
            let need = {}
            need._id = this.props._id
            need.projectId = this.props.projectId
            need.status = CANCEL
            need.projectRequest = true

            this.props.confirmOrRejectParticipation(need)
        } else {
            var data = {
                id: this.props._id,
                status: CANCEL
            }
            this.props.requestStatus(data)
        }
        this.setState({showDeleteModal: false})
    }

    onClickShowDeleteModal = e => {
        this.setState({showDeleteModal: true})
    }

    onClickCloseDeleteModal = e => {
        this.setState({showDeleteModal: false})
    }

    onClickUserInfo = address => {
        let encodedAddress = encodeURIComponent(address);
        window.open('https://www.google.com/maps?saddr=' + encodedAddress);
    }

    render() {
        const {showGiveForm, showTimeAlert, modalTitle, showDeleteModal} = this.state
        const {_id, type, user, pickup, giveAt, volunteer, status, nonprofit, projectRequest} = this.props;
        let title = '';

        if (type === VOLUNTEER) {
            title = 'This Event starts within 12 hours, please contact support to cancel and notify nonprofits.';
        } else if (type === PICKUP) {
            title = 'This PickUp Request is within 12 hours of pickup, please contact support to cancel and notify nonprofit.';
        }

        let fullAddress = ""

        if (user) {
            if (user.role === NONPROFIT)
                fullAddress = `${user.address.address1}, ${user.address.address2}, ${user.address.city}, ${user.address.country}, ${user.address.state}, ${user.address.zipcode}`
            else
                fullAddress = user.donorAddress
        }
       
        return (
            <Card className="request-form" padding="30px 20px">
                <ConfirmModal title={modalTitle} showModal={showDeleteModal} closeModal={this.onClickCloseDeleteModal} onClickYes={this.onClickDelete} onClickNo={this.onClickCloseDeleteModal}/>
                <div
                    className={`type-project type-${type}`}>
                    <img
                        className="type"
                        src={`/images/ui-icon/${this.selectType(
                            type
                        )}`}
                        alt="type"
                    />
                </div>
                <div className="request-info">
                    <div className="avatar-wrapper">
                        <UserAvatar
                            imgUserType={user.role}
                            imgUser={user.avatar}
                            userId={user._id}
                        />
                        <div className="user-info" onClick={() => this.onClickUserInfo(fullAddress)}>
                            <span className="name">{user.role === NONPROFIT ? user.companyName : user.firstName + ' ' + user.lastName}</span>
                            <span className="location">{fullAddress}</span>
                        </div>                        
                    </div>
                    {type === PICKUP && <div className="detail-info">
                        <span className="type-info">Donation Item:</span> 
                        <div><span className="icon pickup"></span> {pickup.items.length !== 0 && pickup.items.map((p, i) => {
                            return (
                                <span className="pick-item" key={p.name + i}>
                                    {p.count} {p.name}
                                </span>
                            )
                        })}</div>
                        <div> {moment.unix(giveAt).format("dddd, MMMM Do YYYY")} <span className="icon clock"></span> {moment.unix(pickup.activeTime).format('hh:mm A')}</div>
                    </div> }
                    {type === VOLUNTEER && <div className="detail-info">
                        <span className="type-info">Volunteer Activities:</span> {volunteer.skills}
                        <div> {moment.unix(giveAt).format("dddd, MMMM Do YYYY")}</div>
                        <div><span className="icon clock"></span>  {moment.unix(volunteer.startTime).format('hh:mm A')} - {moment.unix(volunteer.endTime).format('hh:mm A')}</div>
                    </div> }
                </div>
                <div className="separator-25" />
                {user.role === NONPROFIT && status===PENDING && <div className="center">
                    <Button label="Change" solid noBorder fontSize="12px" padding="4px 13px"  onClick={this.onClickRequest(-1)}/>
                    <div className="separator-h-15"/>
                    <Button label="Cancel" inverse fontSize="12px" padding="4px 13px" onClick={this.onClickRequest(CANCEL)}/>
                </div>}

                {user.role !== NONPROFIT && status === ACCEPT && <div className="center reply accept">
                    Accepted
                </div>}
                {user.role === NONPROFIT && status === ACCEPT && <div className="center">
                    <span className="reply accept">Accepted</span>
                    <div className="separator-h-15"/>
                    <Button label="Cancel" inverse fontSize="12px" padding="4px 13px" onClick={this.onClickRequest(CANCEL)}/>
                </div>}
                {status === REJECT && <div className="center reply decline">
                    Declined
                </div>}
                {status === CANCEL && <div className="center reply cancel">
                    canceled
                </div>}

                {user.role !== NONPROFIT && status === PENDING &&  <div className="center">
                    <Button label="Accept" solid noBorder fontSize="12px" padding="4px 13px" onClick={this.onClickRequest(ACCEPT)}/>
                    <div className="separator-h-15"/>
                    <Button label="Decline" inverse fontSize="12px" padding="4px 13px"  onClick={this.onClickRequest(REJECT)}/>
                </div>}

                {!projectRequest && showGiveForm===DONATION && <Modal showModal={showGiveForm===DONATION} closeModal={()=> {this.setState({showGiveForm: -1})}}>
					<DonationForm selectedUser={nonprofit} closeModal={()=> {this.setState({showGiveForm: -1})}} />
				</Modal>}

				{!projectRequest &&showGiveForm===PICKUP && <Modal showModal={showGiveForm===PICKUP} closeModal={()=> {this.setState({showGiveForm: -1})}}>
					<PickUpForm _id={_id} pickup={pickup} giveAt={giveAt} selectedUser={nonprofit} closeModal={()=> {this.setState({showGiveForm: -1})}}/>
				</Modal>}

				{!projectRequest &&showGiveForm===VOLUNTEER && <Modal showModal={showGiveForm===VOLUNTEER} closeModal={()=> {this.setState({showGiveForm: -1})}}>
					<VolunteerForm _id={_id} vol={volunteer} giveAt={giveAt} selectedUser={nonprofit} closeModal={()=> {this.setState({showGiveForm: -1})}}/>
                </Modal>}
                
                <Modal title={title} showModal={showTimeAlert} closeModal={() => {this.setState({showTimeAlert: false})}}>
                </Modal>
            </Card>
        )
    }
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = {
    requestStatus,
    confirmOrRejectParticipation,
    push
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RequestForm)