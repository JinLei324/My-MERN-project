import React, {Component} from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Button from '../../../../common/Button';
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
    createGive,
    updateGive
} from '../../../../../actions/give'
import { PICKUP } from '../../../../../helpers/projectTypes';
import Autocomplete from '../../../../common/Autocomplete'

class PickUpForm extends Component {
    state = {
        pickUpStep: 0,
        pickUpList: [],
        date: moment().startOf('day'),
        time: moment(),
        pickAddress: '',
        isRequest : false
    }
    componentDidMount() {
        if(this.props._id) {
            this.setState({pickUpList: this.props.pickup.items,
                date: moment.unix(this.props.giveAt),
                time: moment.unix(this.props.pickup.activeTime),
                pickAddress: this.props.pickup.pickupAt});
        } else {
            var pickUpList = []
            pickUpList.push({
                name: '',
                count: 0
            })    
            this.setState({pickUpList})
        }
    }
    updateList = (index, property) => e => {
        let {pickUpList} = this.state
        pickUpList[index][property] = e.target.value
        this.setState({pickUpList})
    }

    onClickDelete = (index) => e=> {
        let {pickUpList} = this.state
        if(index === 0) {            
            pickUpList[index].name = ''
            pickUpList[index].count = 0
        } else{
            pickUpList.splice(index, 1)
        }
        this.setState({pickUpList})
    }
    onClickAdd = e => {
        let {pickUpList} = this.state
        pickUpList.push({
            name: '',
            count: 0
        })
        this.setState({pickUpList})
    }
    onClickNext = e => {
        let {pickUpStep, pickUpList, date, time, pickAddress} = this.state
        if(pickUpStep === 0) {
            for(var idx in pickUpList) {
                var pick = pickUpList[idx]
                if(!pick.name  || !pick.count ) {
                    return;
                }
            }
            pickUpStep = 1
            this.setState({pickUpStep})
        } else if(pickUpStep === 1){
            if(!date || !time || !pickAddress) {
                return;
            }
            // pickUpStep = 2
            // this.setState({pickUpStep})
            this.setState({isRequest: true})
            const tot = pickUpList.reduce((tot, record) => {
                return tot + parseInt(record.count)
            }, 0)
            if(this.props._id) {
                var data = {
                    _id: this.props._id,
                    giveAt: date.format('X'),
                    type: PICKUP,
                    pickup: {
                        items: pickUpList,
                        activeTime: time.format('X'),
                        pickupAt: pickAddress,
                        itemCount: tot
                    },
                    cb : () => {
                        this.setState({pickUpStep: 2, isReuqest: false})
                    }
                }
                this.props.updateGive(data);
            } else {
                data = {
                    nonprofit: this.props.selectedUser._id,
                    type: PICKUP,
                    giveAt: date.format('X'),
                    pickup: {
                        items: pickUpList,
                        activeTime: time.format('X'),
                        pickupAt: pickAddress,
                        itemCount: tot
                    },
                    cb : () => {
                        this.setState({pickUpStep: 2, isReuqest: false})
                    }
                }
                this.props.createGive(data);
            }
        } else if(pickUpStep === 2) {

            this.props.closeModal && this.props.closeModal()
        }
    }

    handlingTime = key => e => {        
		this.setState({ [key]: e })
    }
    
    handleInput = key => e=> {
        this.setState({[key]: e.target.value})
    }

    onClickViewRequest = e => {
        this.props.push(`/${this.props.user._id}/projects?view=request`)
    }

    render() {
        const {pickUpStep, pickUpList, date, time, pickAddress, isReuqest} = this.state

        const {_id} = this.props
        return (
            <section className="modal-pickup-form">
                {pickUpStep === 0 && <div className="pickup-content-0">
                    <div className="separator-30"/>
                    <div className="modal-title center">Enter PickUp Information</div>
                    <div className="separator-30"/>
                    <div className="modal-row center">
                        <div className="pick-up-description">Please name the items and the quantity of each item you’re requesting for a donation PickUp</div>
                    </div>
                    <div className="separator-20" />
                    <div className="pick-up-list">
                        {pickUpList.map((e, i) => {
                            return (
                                <div className="pick-up-item" key={i}>
                                    <span className="label">Item</span>
                                    <input className="value" onChange={this.updateList(i, 'name')} value={e.name} placeholder="shoes"/>
                                    <div className="separator-h-15" />
                                    <span className="label"  >Number</span>
                                    <input className="value" onChange={this.updateList(i, 'count')}  value={e.count}/>
                                    <div className="separator-h-10" />
                                    <span className="delete" onClick={this.onClickDelete(i)}>X</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="separator-15" />
                    <div className="modal-row center">
                        <button className="btn-add" onClick={this.onClickAdd}>+</button>
                    </div>
                    <div className="separator-25" />
                    <div className="modal-row center">
                        <Button label="Select date & location" padding="5px 15px" fontSize="14px" noBorder solid onClick={this.onClickNext}/>
                    </div>
                </div>}
                {pickUpStep === 1 && <div className="pickup-content-1">
                    <div className="separator-30"/>
                    <div className="modal-title center">Select date and location</div>
                    <div className="separator-20"/>
                    <div className="modal-row time">
                        <div className="date">
                            <span className="label">
                                Date and time of PickUp (from/to):
                            </span>
                            <DatePicker
                                className="control"
                                selected={date}
                                key={date}
                                onChange={this.handlingTime('date')}
                                minDate={moment()}
                                dateFormat="dddd, MMMM Do YYYY"
                                disabledKeyboardNavigation
                            />
                        </div>
                        <div className="select-time">
                            <span className="label">Time:</span>
                            <DatePicker
                                className="control"
                                selected={time}
                                key={time}
                                onChange={this.handlingTime('time')}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                dateFormat="LT"
                                minTime={date > moment() ? moment().startOf('day') : moment()}
                                maxTime={moment().endOf('day')}
                                disabledKeyboardNavigation
                            />
                        </div>
                    </div>
                    <div className="separator-15" />
                    <div className="modal-row pick-at">
                        <Autocomplete
                            update={({ location }) =>
                                this.setState({ pickAddress: location.name })
                            }
                            name="pickAddress"
                            placeholder="PickUp at:"
                            address={pickAddress}
                            className="autocomplete-settings"
                            errorHandler={<div className="errorHandler" />}
                        />
                    </div>
                    <div className="separator-25" />
                    <div className="modal-row center">
                        <Button label={`${_id ? 'Update' : 'Request'}`} padding="6px 47px" fontSize="14px" disabled={isReuqest} noBorder solid onClick={this.onClickNext}/>
                    </div>
                </div>}
                {pickUpStep === 2 && <div className="pickup-content-2">
                    <div className="separator-25" />
                    <div className="donation-result center">Success</div>
                    <div className="separator-15" />
                    <div className="center">
                        <img className="donation-result-img" src="/images/ui-icon/donation/icon-success.svg" alt="success"/>
                    </div>
                    <div className="separator-30" />
                    <div className="center">
                        <div className="donation-result-desc ">
                            All done! You’ve successfully {_id ? 'updated your PickUp request' : 'requested a PickUp'}. The nonprofit will be in touch with you shortly!
                        </div>                        
                    </div>
                    <div className="separator-30"/>
                    <div className="center">
                        <section className="donation-type">
                            <button className={`button receipt `} onClick={this.onClickViewRequest}>View request</button>
                            <button className={`button done active`} onClick={this.onClickNext}>Done</button>
                        </section>                        
                    </div>
                </div>}
            </section>
        )
    }
}

const mapStateToProps = state => ({	
    user: state.authentication.user
})

const mapDispatchToProps = {
    createGive,
    updateGive,
    push
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PickUpForm)