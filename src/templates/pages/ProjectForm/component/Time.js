import React, { Component } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

export default class Time extends Component {
	state = {
		date: moment().startOf('day'),
		startTime: moment().add(2, 'h'),
		endTime: moment()
			.add(2, 'h')
			.add(30, 'm'),
		version: 0
	}

	static getDerivedStateFromProps(props, state) {
		let newState = { ...state }
		// console.log(state)
		if (props.startDate && props.endDate && state.version <= 2) {
			newState.date = moment(props.startDate * 1000)
			newState.startTime = moment(props.startDate * 1000)
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
			let { date, startTime, endTime } = this.state

			if (key === 'date') {
				this.setState({ startTime: moment().add(2, 'h') })
				this.setState({
					endTime: moment()
						.add(2, 'h')
						.add(30, 'm')
				})
			}

			if (startTime > endTime) {
				endTime = moment(startTime).add(30, 'm')
				this.setState({ endTime })
			}

			// console.log('startTime', startTime.format('HH:mm'))
			// console.log('endTime', endTime.format('HH:mm'))

			let startDate = moment(
				`${date.format('YYYY-MM-DD')} ${startTime.format('HH:mm')}`
			).format('X')
			let endDate = moment(
				`${date.format('YYYY-MM-DD')} ${endTime.format('HH:mm')}`
			).format('X')

			// console.log(
			//     'startDate',
			//     moment(
			//         `${date.format('YYYY-MM-DD')} ${startTime.format('HH:mm')}`
			//     )
			// )
			// console.log(
			//     'endDate',
			//     moment(
			//         `${date.format('YYYY-MM-DD')} ${endTime.format('HH:mm')}`
			//     )
			// )
			this.props.update && this.props.update({ startDate, endDate })
		})
	}

	render() {
		const hour = 23 - moment().format('H')
		const { date, startTime, endTime } = this.state
		const { disabled } = this.props

		return (
			<section className="time">
				<div className="field date">
					<span className="label main-font">
						Date of activity (from/to):
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
						className="control width-120"
						selected={startTime}
						key={startTime}
						onChange={this.handling('startTime')}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={15}
						dateFormat="LT"
						disabled={disabled}
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
				</div>
				<div className="field">
					<span className="label main-font fake">to</span>
					<span className="main-font to">to</span>
				</div>
				<div className="field">
					<span className="label main-font fake">T</span>
					<DatePicker
						className="control width-120"
						selected={endTime}
						key={endTime}
						onChange={this.handling('endTime')}
						showTimeSelect
						showTimeSelectOnly
						timeIntervals={15}
						dateFormat="LT"
						minTime={moment(startTime).add(30, 'm')}
						maxTime={moment().endOf('day')}
						disabled={disabled}
						disabledKeyboardNavigation
					/>
				</div>
			</section>
		)
	}
}
