import React, { Component } from 'react';

class Card extends Component {

	render() {
		let { className, padding, bottomShadow, zIndex, noBorder } = this.props
		if (!padding) padding = '25px'

		return (
			<section
				className={`${className} ${bottomShadow &&
					'bottom-shadow'} card-mail-class ${noBorder &&
					'no-border'}`}
				style={{ padding, zIndex }}
				onClick={this.props.onClick}>
				{ this.props.children }
			</section>
		)
	}

}

export default Card
