import React, {Component} from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import Button from '../../../common/Button';
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
    createGive,
    updateGive
} from '../../../../actions/give'
import { PICKUP } from '../../../../helpers/projectTypes';
import Autocomplete from '../../../common/Autocomplete'

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
        if (this.props._id) {
            this.setState({pickUpList: this.props.pickup.items,
                date: moment.unix(this.props.giveAt),
                time: moment.unix(this.props.pickup.activeTime),
                pickAddress: this.props.pickup.pickupAt});
        } else {
            var pickUpList = [];
            pickUpList.push({
                name: '',
                count: 0
            });
            this.setState({pickUpList});
        }
    }

    updateList = (index, property) => e => {
        let { pickUpList } = this.state;
        pickUpList[index][property] = e.target.value;
        this.setState({pickUpList});
    }

    onClickDelete = (index) => e => {
        let {pickUpList} = this.state
        if (index === 0) {            
            pickUpList[index].name = '';
            pickUpList[index].count = 0;
        } else {
            pickUpList.splice(index, 1);
        }
        this.setState({pickUpList});
    }

    onClickAdd = e => {
        let { pickUpList } = this.state;
        pickUpList.push({
            name: '',
            count: 0
        });
        this.setState({pickUpList});
    }

    onClickNext = e => {
        let { pickUpStep, pickUpList, date, time, pickAddress } = this.state;
        if (pickUpStep === 0) {
            for (var idx in pickUpList) {
                var pick = pickUpList[idx]
                if (!pick.name  || !pick.count ) {
                    return;
                }
            }
            pickUpStep = 1;
            this.setState({pickUpStep});
        } else if (pickUpStep === 1) {
            if (!date || !time || !pickAddress) {
                return;
            }
            this.setState({isRequest: true});
            const tot = pickUpList.reduce((tot, record) => {
                return tot + parseInt(record.count)
            }, 0);
            if (this.props._id) {
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
                    cb: () => {
                        this.setState({pickUpStep: 2, isReuqest: false});
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
                    cb: () => {
                        this.setState({pickUpStep: 2, isReuqest: false})
                    }
                }
                this.props.createGive(data);
            }
        } else if (pickUpStep === 2) {
            this.props.closeModal && this.props.closeModal();
        }
    }

    handlingTime = key => e => {        
		this.setState({ [key]: e });
    }
    
    handleInput = key => e=> {
        this.setState({[key]: e.target.value})
    }

    onClickViewRequest = e => {
        this.props.push(`/${this.props.user._id}/projects?view=request`);
    }

    render() {
        const { pickUpStep, pickUpList, date, time, pickAddress, isReuqest } = this.state;
        const { _id } = this.props;

        return (
            <section className="pickupFormSection">
                { pickUpStep === 0 &&
                    <div className="pickupContent-0">
                        <div className="titleBody">
                            <img src="/images/ui-icon/profile/pickup-icon.svg" alt="pickup-icon" />
                            <p>Enter PickUp Information</p>
                        </div>
                        <div className="descBody">
                            <p>Please name the items and the quality of each item you’re requesting for a donation Pickup</p>
                        </div>
                        <div className="pickupListBody">
                            { pickUpList.map((e, i) => {
                                return (
                                    <div className="pickupItem" key={i}>
                                        <div className="delete" onClick={this.onClickDelete(i)}></div>
                                        <div className="itemBody">
                                            <p>Item</p>
                                            <input className="value" onChange={this.updateList(i, 'name')} value={e.name} placeholder="shoes" />
                                        </div>
                                        <div className="numberBody">
                                            <p>Number</p>
                                            <input className="value" onChange={this.updateList(i, 'count')}  value={e.count} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="row center">
                            <img src="/images/ui-icon/profile/item-plus-btn.svg" alt="item-plus-btn" onClick={this.onClickAdd} />
                        </div>
                        <div className="row center">
                            <Button label="Select date & location" padding="13px 60px" fontSize="18px" noBorder solid onClick={this.onClickNext} />
                        </div>
                    </div>
                }
                { pickUpStep === 1 &&
                    <div className="pickupContent-1">
                        <div className="titleBody">
                            <p>Select date and location</p>
                        </div>
                        <div className="row time">
                            <div className="date">
                                <p className="caption">Date and time of PickUp (from/to):</p>
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
                                <p className="caption">Time:</p>
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
                            <div className="pickAt">
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
                        </div>
                        <div className="modal-row center">
                            <Button label={`${_id ? 'Update' : 'Request'}`} padding="6px 47px" fontSize="14px" disabled={isReuqest} noBorder solid onClick={this.onClickNext}/>
                        </div>
                    </div>
                }
                { pickUpStep === 2 &&
                    <div className="pickup-content-2">
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
                    </div>
                }
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