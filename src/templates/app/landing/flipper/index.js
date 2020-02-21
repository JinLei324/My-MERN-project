import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Note :
 * If you're using react v 15.4 or less
 * You can directly import PropTypes from react instead.
 * Refer to this : https://reactjs.org/warnings/dont-call-proptypes.html
 */

class Countdown extends Component {
	constructor(props) {
		super(props)

		this.prevState = {}
		this.state = {
			days: '999',
			hours: '99',
			min: '60',
			sec: '60'
		}
	}

	componentDidMount() {
		// update every second
		this.interval = setInterval(() => {
			this.prevState = this.state
			const date = this.calculateCountdown(this.props.date)
			date ? this.setState(date) : this.stop()
		}, 1000)
	}

	componentWillUnmount() {
		this.stop()
	}

	calculateCountdown(endDate) {
		let diff =
			(Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000

		// clear countdown when date is reached
		if (diff <= 0) return false

		const timeLeft = {
			years: 0,
			days: 0,
			hours: 0,
			min: 0,
			sec: 0
		}

		// calculate time difference between now and expected date
		if (diff >= 365.25 * 86400) {
			// 365.25 * 24 * 60 * 60
			timeLeft.years = Math.floor(diff / (365.25 * 86400))
			diff -= timeLeft.years * 365.25 * 86400
		}
		if (diff >= 86400) {
			// 24 * 60 * 60
			timeLeft.days = Math.floor(diff / 86400)
			diff -= timeLeft.days * 86400
		}
		if (diff >= 3600) {
			// 60 * 60
			timeLeft.hours = Math.floor(diff / 3600)
			diff -= timeLeft.hours * 3600
		}
		if (diff >= 60) {
			timeLeft.min = Math.floor(diff / 60)
			diff -= timeLeft.min * 60
		}
		timeLeft.sec = diff

		return timeLeft
	}

	stop() {
		clearInterval(this.interval)
	}

	addLeadingZeros(value) {
		value = String(value)
		while (value.length < 2) {
			value = '0' + value
		}
		return value
	}

	render() {
		const countDown = this.state

		return (
			<div className="Countdown">
				<span className="Countdown-col">
					<h5>Days</h5>
					<span className="Countdown-col-element">
						{this.addLeadingZeros(countDown.days)
							.split('')
							.map((elem, key) => {
								let prevElem = this.addLeadingZeros(
									this.prevState.days
								).split('')[key]
								let flip = false
								if (elem !== prevElem) {
									flip = true
								}
								return (
									<strong key={key}>
										<span className={`next-number`}>
											{elem - 1 === -1 ? 9 : elem - 1}
										</span>
										<span
											className={`current-number${
												flip ? ' flip' : ''
											}`}>
											{elem}
										</span>
									</strong>
								)
							})}
					</span>
				</span>

				<span className="Countdown-col">
					<h5>Hours</h5>
					<span className="Countdown-col-element">
						{this.addLeadingZeros(countDown.hours)
							.split('')
							.map((elem, key) => {
								let prevElem = this.addLeadingZeros(
									this.prevState.hours
								).split('')[key]
								let flip = false
								if (elem !== prevElem) {
									flip = true
								}
								return (
									<strong key={key}>
										<span className={`next-number`}>
											{elem - 1 === -1 ? 9 : elem - 1}
										</span>
										<span
											className={`current-number${
												flip ? ' flip' : ''
											}`}>
											{elem}
										</span>
									</strong>
								)
							})}
					</span>
				</span>

				<span className="Countdown-col">
					<h5>Minutes</h5>
					<span className="Countdown-col-element">
						{this.addLeadingZeros(countDown.min)
							.split('')
							.map((elem, key) => {
								let prevElem = this.addLeadingZeros(
									this.prevState.min
								).split('')[key]
								let flip = false
								if (elem !== prevElem) {
									flip = true
								}
								return (
									<strong key={key}>
										<span className={`next-number`}>
											{elem - 1 === -1 ? 9 : elem - 1}
										</span>
										<span
											className={`current-number${
												flip ? ' flip' : ''
											}`}>
											{elem}
										</span>
									</strong>
								)
							})}
					</span>
				</span>

				<span className="Countdown-col">
					<h5>Seconds</h5>
					<span className="Countdown-col-element">
						{this.addLeadingZeros(countDown.sec)
							.split('')
							.map((elem, key) => {
								let prevElem = this.addLeadingZeros(
									this.prevState.sec
								).split('')[key]

								if (elem !== prevElem) {
									var flip = true
								}

								return (
									<strong key={key}>
										<span
											className={`next-number${
												flip ? ' flip' : ''
											}`}>
											{elem - 1 === -1 ? 9 : elem - 1}
										</span>
										<span
											className={`current-number${
												flip ? ' flip' : ''
											}`}>
											{elem}
										</span>
									</strong>
								)
							})}
					</span>
				</span>
			</div>
		)
	}
}

Countdown.propTypes = {
	date: PropTypes.string.isRequired
}

Countdown.defaultProps = {
	date: new Date()
}

export default Countdown
