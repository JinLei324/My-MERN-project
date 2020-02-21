import React, { Component } from 'react'

class Tab extends Component {
	render() {
		const { Comp, label, active, clickOnTab } = this.props

		return (
			<div className={`horizontalTab ${active ? 'open' : ''}`}>
				<h2 className="mainSettingTitle" onClick={clickOnTab}>
					{label}
					<div className="arrowBlock" />
					<span className="arrow" />
				</h2>
				<Comp />
			</div>
		)
	}
}

export default Tab
