import React, { Component } from 'react'
import Card from '../../../common/Card'
import { PICKUP, VOLUNTEER } from '../../../../helpers/projectTypes';

export default class NeededFrom extends Component {
	clickedCheckBox = () => {
		let isExactly = false
		if(!this.props.isExactly) {
			isExactly = true
		} 
		this.props.updateNeeded({
			index: this.props.index, 
			key: "isExactly", 
			value: isExactly
		})
	}

	render() {
		const {
			value,
			of,
			updateNeeded,
			index,
			deleteAvailible,
			deleteElem,
			type,
			isExactly
		} = this.props

		return (
			<Card className="needed" key={value} padding="10px">
				<div className="field field-1">
					{deleteAvailible && (
						<div className="delete main-font" onClick={deleteElem}>
							+
						</div>
					)}
					<p className="label main-font"> {type === VOLUNTEER && 'Kind of activity:' } {type === PICKUP && 'What do you need?'}</p>
					<input
						className="main-font control description"
						type="text"
						defaultValue={value}
						id={`projectNeedsTextCreate-${index}`}
						placeholder={`${type === VOLUNTEER ? 'What will volunteers be doing?' : type === PICKUP ? 'What items will you be donating' : '' } `}
						onBlur={e =>
							updateNeeded({
								index,
								key: 'value',
								value: e.target.value
							})
						}
					/>
					<span className="globalErrorHandler" />
				</div>
				<div className="field field-2">
					<p className="label main-font">Number:</p>
					<input
						className="main-font control count"
						type="text"
						placeholder="0"
						id={`projectNeedsCountCreate-${index}`}
						defaultValue={of}
						onBlur={e =>
							updateNeeded({
								index,
								key: 'of',
								value: e.target.value
							})
						}
					/>
					<span className="globalErrorHandler" />
				</div>
				<label className="field field-3 exactly-checkbox-container">
					<p className="label main-font">Exactly:</p>
					<input
						type="checkbox"
						checked={isExactly}
						onChange={this.clickedCheckBox}
					/>
					<span className="checkmark-need"></span>
				</label>
			</Card>
		)
	}
}
