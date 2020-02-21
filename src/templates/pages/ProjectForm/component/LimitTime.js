import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

export default class LimitTime extends Component {
	state = {
		date: moment().add(1, 'M').startOf('day'),
		endTime: moment().add(1, 'M'),
		version: 0
	}

	static getDerivedStateFromProps(props, state) {
		let newState = { ...state }
		if (props.endDate && state.version <= 2) {
			newState.date = moment(props.endDate * 1000)
			newState.endTime = moment(props.endDate * 1000)
			newState.version = state.version + 1
		}
		return newState
	}

	componentDidMount() {
		this.handling('version')(1)
	}

	handling = key => e => {
		this.setState({ [key]: e }, () => {
			let { date, endTime } = this.state

			if (key === 'date') {
				this.setState({ endTime: moment().add(2, 'h').add(30, 'm') })
			}

			let startDate = moment().add(2, 'h').format('X')

			let endDate = moment(
				`${date.format('YYYY-MM-DD')} ${endTime.format('HH:mm')}`
			).format('X')

			this.props.update && this.props.update({ startDate, endDate })
		})
	}

	render() {
		const { date, endTime } = this.state
		const { disabled } = this.props

		return (
			<section className="time">
				<div className="field date">
					<span className="label main-font">
						Date of activity:
					</span>
					<DatePicker
						className="control"
						selected={date}
						key={date}
						onChange={this.handling('date')}
						minDate={moment()}
						dateFormat="dddd, MMMM Do YYYY"
						disabled={disabled}
						disabledKeyboardNavigation
					/>
				</div>
				<div className="field">
					<span className="label main-font">Time:</span>
					<DatePicker
						className="control"
						selected={endTime}
						key={endTime}
						onChange={this.handling('endTime')}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={15}
						dateFormat="LT"
						minTime={moment().add(30, 'm')}
						maxTime={moment().endOf('day')}
						disabled={disabled}
						disabledKeyboardNavigation
					/>
				</div>
			</section>
		)
	}
}
