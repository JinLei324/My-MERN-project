import React, { Component } from 'react'

export default class Interest extends Component {
	state = { selected: false }

	componentWillReceiveProps(nextProps) {
		this.setState({
			selected: nextProps.selected || false
		})
	}

	select = () => {
		this.setState({selected: !this.state.selected}, () => {
			this.props.selectInterest(this.state.selected, this.props._id)
		})
	}

	render() {
		const {
			image,
			title,
			projectsCount
		} = this.props

		const {
			selected
		} = this.state

		return(
			<div className={`interest ${selected && 'active'}`} onClick={this.select}>
				<div className="icon-wrapper">
					<img
						src={
							image
								? image
								: '/images/ui-icon/mini-images.svg'
						}
						alt="icon"
					/>
				</div>
				<div className="label main-font">{ title }</div>
				<div className="label main-font">({ projectsCount })</div>
			</div>
		)
	}
}