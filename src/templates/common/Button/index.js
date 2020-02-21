import React, { Component } from 'react';

export default class Button extends Component {

	onClick = e => {
		this.props.onClick && this.props.onClick(e);
	}

	render() {
		let { label, className, inverse, padding, disabled, fontSize, solid, noBorder } = this.props;

		if (!padding) {
			padding = '8px 16px';
		}

		if (!fontSize) {
			fontSize = '12px';
		}

		return (
			<button
				disabled={disabled}
				className={`${className ||
					''} button-main-class main-font ${inverse && 'inverse'} ${solid && 'solid'} ${!noBorder && 'border'}`}
				style={{ padding }}
				onClick={this.onClick}>
				<span className="_label" style={{fontSize}}>{label}</span>
			</button>
		)
	}

}