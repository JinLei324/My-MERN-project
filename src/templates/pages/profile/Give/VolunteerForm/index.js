import React, {Component} from 'react'
import { connect } from 'react-redux'
import Button from '../../../../common/Button';
import DatePicker from 'react-datepicker'
import moment from 'moment'
import {
    createGive,
    updateGive
} from '../../../../../actions/give'
import { VOLUNTEER } from '../../../../../helpers/projectTypes';


class VolunteerForm extends Component {
    state = {
        skills: '',
        date: moment().startOf('day'),
		startTime: moment().add(2, 'h'),
		endTime: moment()
			.add(2, 'h')
            .add(30, 'm'),
        isRequest: false
    }
    componentDidMount() {
        if(this.props._id) {
            this.setState({skills: this.props.vol.skills,
                date: moment.unix( this.props.giveAt),
                startTime: moment.unix(this.props.vol.startTime),
                endTime: moment.unix(this.props.vol.endTime)})
        }
        
    }
    inputHelper = key => e => {
        this.setState({[key]: e.target.value})
    }
    handlingTime = key => e=> {
        this.setState({ [key]: e });
    }
    onComplete = e => {
        const {skills, date, startTime, endTime} = this.state
        startTime.set({day: date.get('date'), year: date.get('year'), month: date.get('month')})
        endTime.set({day: date.get('date'), year: date.get('year'), month: date.get('month')})
        this.setState({isRequest: true})        
        var duration = moment.duration(this.state.endTime.diff(this.state.startTime));
        
        if(this.props._id) {
            var data = {
                _id: this.props._id,
                type: VOLUNTEER,
                giveAt: date.format('X'), // moment.unix(date),
                volunteer: {
                    skills: skills,                
                    startTime: startTime.format('X'),// moment.unix(startTime),
                    endTime: endTime.format('X'), //moment.unix(endTime),
                    activeHours: duration.asHours()
                },
                cb : () => {
                    this.props.closeModal && this.props.closeModal()
                }
            }
            this.props.updateGive(data);
        } else {
            data = {
                nonprofit: this.props.selectedUser._id,
                type: VOLUNTEER,
                giveAt: date.format('X'), // moment.unix(date),
                volunteer: {
                    skills: skills,                
                    startTime: startTime.format('X'),// moment.unix(startTime),
                    endTime: endTime.format('X'), //moment.unix(endTime),
                    activeHours: duration.asHours()
                },
                cb : () => {
                    this.props.closeModal && this.props.closeModal()
                }
            }
            this.props.createGive(data);
        }
        
    }
    render() {
        const hour = 23 - moment().format('H')
        const{skills, date, startTime, endTime, isRequest} = this.state
        return (
            <section className="modal-volunteer-form center">
                <div className="separator-30" />
                <div className="modal-title">Enter Volunteer Information</div>
                <div className="separator-20" />
                <div className="vol-form-label">List your skills that could help this nonprofit</div>
                <input className="vol-form-input" placeholder="List skills..." value={skills} onChange={this.inputHelper('skills')} />
                <div className="separator-30"/>
                <div className="available-title">Availability</div>
                <div className="separator-20"/>
                <div className="vol-form-label m-230">Select the days of the week you’re available to volunteer:</div>
                
                <section className="time">
                    <div className="field date">
                        <DatePicker
                            className="control width-250"
                            selected={date}
                            key={date}
                            onChange={this.handlingTime('date')}
                            minDate={moment()}
                            dateFormat="dddd, MMMM Do YYYY"
                            disabledKeyboardNavigation
                        />
                    </div>
                    <div className="separator-25"/>
                    <span className="vol-form-label">Time:</span>
                    <div className="field">
                        <DatePicker
                            className="control width-90"
                            selected={startTime}
                            key={startTime}
                            onChange={this.handlingTime('startTime')}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            dateFormat="LT"
                            minTime={
                                !date.isSame(new Date(), 'day')
                                    ? moment().startOf('day')
                                    : moment().add(2, 'h')
                            }
                            maxTime={
                                !date.isSame(new Date(), 'day')
                                    ? moment().endOf('day')
                                    : moment().add(hour, 'h')
                            }
                            disabledKeyboardNavigation
                        />
                        <span className="label">to</span>
                        <DatePicker
                            className="control width-90"
                            selected={endTime}
                            key={endTime}
                            onChange={this.handlingTime('endTime')}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            dateFormat="LT"
                            minTime={moment(startTime).add(30, 'm')}
                            maxTime={moment().endOf('day')}
                            disabledKeyboardNavigation
                        />
                    </div>
                </section>
                <div className="separator-30"/>
                <Button label="Update" disabled={isRequest} padding="3px 30px" fontSize="16px" noBorder solid onClick={this.onComplete}/>
                <div className="separator-15"/>
            </section>
        )
    }
}


const mapStateToProps = state => ({	
    user: state.authentication.user
})

const mapDispatchToProps = {
    createGive,
    updateGive
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VolunteerForm)