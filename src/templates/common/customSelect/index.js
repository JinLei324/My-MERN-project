import React, { Component } from 'react'

class customSelect extends Component {
	state = {
		showDrop: false
	}

	setInput = name => {
		this.setState({ showDrop: false })
		this.props.changeSelect({
			target: {
				name: this.props.nameElem,
				value: name
			}
		})
	}

	showDropFunc = () => {
		this.setState({ showDrop: true })
	}

	hideDropFunc = () => {
		this.setState({ showDrop: false })
	}

	render() {
		let { fromState, itemList, nameElem } = this.props
		let { showDrop } = this.state

		return (
			<div className={`customSelect ${showDrop ? 'open' : ''}`}>
				<div className="arrowInside" />
				<div className="input-wrapper">
					<input
						type="text"
						className="input-modal-auth"
						autoComplete="disable-autofill"
						value={fromState}
						name={nameElem}
						onChange={() => {}}
						onFocus={this.showDropFunc}
						onBlur={this.hideDropFunc}
					/>
					<span className="placeholder">School</span>
					<span className="globalErrorHandler" />
					<ul className={`dropInput`}>
						{itemList.map((item, i) => (
							<li
								onClick={() => this.setInput(item.name)}
								key={i}>
								{item.name}
							</li>
						))}
					</ul>
				</div>
			</div>
		)
	}
}

export default customSelect
