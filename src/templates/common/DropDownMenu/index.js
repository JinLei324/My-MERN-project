import React, { Component } from 'react'
import Card from '../Card'

export default class DropDownMenu extends Component {
	state = {
		open: false
	}

	componentWillMount() {
		window.addEventListener('click', this.close)
	}
	componentWillUnmount() {
		window.removeEventListener('click', this.close)
	}

	close = e => this.setState({ open: false })

	open = open => e => {
		e.stopPropagation()
		this.setState({ open })
	}

	render() {
		const { className } = this.props
		const { open } = this.state

		return (
			<section className={`drop-down-menu ${className}`}>
				<button
					className="animation-click-effect btn"
					onClick={this.open(!open)}>
					<img
						className="icon"
						src="/images/ui-icon/point-3.svg"
						alt="icon"
					/>
				</button>
				<Card
					className={`menu ${open && 'visible'}`}
					noBorder
					padding="10px"
					onClick={this.open(false)}>
					{this.props.children}
				</Card>
			</section>
		)
	}
}
