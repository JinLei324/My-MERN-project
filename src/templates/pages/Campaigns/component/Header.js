import React, { Component } from 'react'
import GiftModal from './GiftModal'

import {
	VOLUNTEER,
	DONATION,
	PICKUP
} from '../../../../helpers/projectTypes'

import DonationHeader from './Headers/DonationHeader'
import VolunteerHeader from './Headers/VolunteerHeader'
import PickupHeader from './Headers/PickupHeader'

class Header extends Component {
	state = {
		showGiftModal: false
	}

	onNewGift = e => {
		this.setState({ showGiftModal: true })
	}

	closeGiftModal = e => {
		this.setState({ showGiftModal: false })
	}

	render() {

		const {
			showGiftModal
		} = this.state

		const {
			activeType,
			userId
		} = this.props
		
		return (
			<div className="row CompainContainer">
				
				{activeType === VOLUNTEER && <VolunteerHeader userId={userId} />}
				{activeType === DONATION && <DonationHeader userId={userId} />}
				{activeType === PICKUP && <PickupHeader userId={userId} />}

				<GiftModal showModal={showGiftModal} closeModal={this.closeGiftModal} />
			</div>
		)
	}
}

export default Header