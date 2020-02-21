import React, { Component, Fragment } from 'react'
import Button from '../../../common/Button'
import { VOLUNTEER, PICKUP } from '../../../../helpers/projectTypes';

export default class NeededFrom extends Component {
	state = {
		description: '',
		quantity: '',
		type: (this.props.types && this.props.types) || 0,
		types: this.props.types
	}

	chooseType = type => this.setState({ type })
	inputHelper = key => e => this.setState({ [key]: e.target.value })

	// scrollTo = () => {
	// 	for (let i = 0; i < 130; i += 5) {
	// 		setTimeout(() => {
	// 			window.scrollTo(window.pageXOffset, window.pageYOffset + i)
	// 		}, i * 5)
	// 	}
	// }

	add = e => {
		e.preventDefault()
		if (this.props.action) {
			this.props.action({
				value: this.state.description,
				of: this.state.quantity,
				type: this.state.type
			})

			this.setState(
				{
					description: '',
					quantity: ''
				}
				// this.scrollTo
			)
		}
	}

	static getDerivedStateFromProps(props, state) {
		let type = state.type
		if (props.types.length !== state.types.length) {
			type = (props.types && props.types) || 0
		}
		return {
			types: props.types,
			type
		}
	}

	render() {
		const {type} = this.state
		const { disableButton } = this.props

		return (
			<Fragment>
				<div className="separator-25" />
				<div className="send">
					<Button
						onClick={this.add}
						disabled={disableButton}
						label={`${type === VOLUNTEER ? 'Add activity' : type === PICKUP ? 'Add item' : '' }`}
						inverse
					/>
				</div>
			</Fragment>
		)
	}
}
