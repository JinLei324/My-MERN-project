import React, {Component} from 'react';
import { connect } from 'react-redux';

import DatePicker from 'react-datepicker';
import moment from 'moment';

import Button from '../../../common/Button';

import { createGive, updateGive } from '../../../../actions/give';
import { VOLUNTEER } from '../../../../helpers/projectTypes';

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
        if (this.props._id) {
            this.setState({
                skills: this.props.vol.skills,
                date: moment.unix( this.props.giveAt),
                startTime: moment.unix(this.props.vol.startTime),
                endTime: moment.unix(this.props.vol.endTime)
            });
        }    
    }

    inputHelper = key => e => {
        this.setState({[key]: e.target.value});
    }

    handlingTime = key => e=> {
        this.setState({ [key]: e });
    }

    onComplete = e => {
        const { skills, date, startTime, endTime } = this.state;
        startTime.set({day: date.get('date'), year: date.get('year'), month: date.get('month')});
        endTime.set({day: date.get('date'), year: date.get('year'), month: date.get('month')});
        this.setState({isRequest: true});
        var duration = moment.duration(this.state.endTime.diff(this.state.startTime));
        
        if (this.props._id) {
            var data = {
                _id: this.props._id,
                type: VOLUNTEER,
                giveAt: date.format('X'),
                volunteer: {
                    skills: skills,                
                    startTime: startTime.format('X'),
                    endTime: endTime.format('X'),
                    activeHours: duration.asHours()
                },
                cb: () => {
                    this.props.closeModal && this.props.closeModal()
                }
            }
            this.props.updateGive(data);
        } else {
            data = {
                nonprofit: this.props.selectedUser._id,
                type: VOLUNTEER,
                giveAt: date.format('X'),
                volunteer: {
                    skills: skills,
                    startTime: startTime.format('X'),
                    endTime: endTime.format('X'),
                    activeHours: duration.asHours()
                },
                cb: () => {
                    this.props.closeModal && this.props.closeModal()
                }
            }
            this.props.createGive(data);
        }    
    }

    render() {
        const hour = 23 - moment().format('H');
        const { skills, date, startTime, endTime, isRequest } = this.state;

        return (
            <section className="volunteerFormSection">
                <div className="titleBody">
                    <img src="/images/ui-icon/profile/volunteer-icon.svg" alt="volunteer-icon" />
                    <p>Enter Volunteer Information</p>
                </div>
                <div className="row">
                    <p className="desc">List your skills that could help this nonprofit</p>
                    <input className="vol-form-input" placeholder="List skills..." value={skills} onChange={this.inputHelper('skills')} />
                </div>
                <div className="row">
                    <p className="title">Avaliability</p>
                    <p className="desc">Sellect the days of the week you’re avaliable to volunteer:</p>
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
                <div className="row flex">
                    <p className="title">Time</p>
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
                    <p className="desc">to</p>
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
                <div className="row center">
                    <Button label="Send" disabled={isRequest} padding="13px 60px" fontSize="18px" noBorder solid onClick={this.onComplete} />
                </div>
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