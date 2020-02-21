import React, { Component } from 'react'

const defaultPickupDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default class PickupDay extends Component {
	state = {
		pickupDays: []
	}

	static getDerivedStateFromProps(props, state) {
		let newState = { ...state }
		newState.pickupDays = props.pickupDays || []
		return newState
	}

	checkSelected = (index_day) => {
		return this.state.pickupDays.indexOf(index_day) > -1;
	}

	selectPickupDay = (index_day) => {
		let pickupDays = this.state.pickupDays
		if (pickupDays.indexOf(index_day) > -1) {
			pickupDays.splice(pickupDays.indexOf(index_day), 1)
		}
		else {
			pickupDays.push(index_day)
		}
		this.props.update && this.props.update({ pickupDays })
	}

	render() {
		const self = this;
		return (
			<div className="pickupDays">
				{defaultPickupDays.map((p, i) => (
					<span key={`pickup-${i}`} className={`pickupDay ${self.checkSelected(i) ? 'selected' : ''}`} onClick={() => this.selectPickupDay(i)}>{p}</span>
				))}
			</div>
		)
	}
}