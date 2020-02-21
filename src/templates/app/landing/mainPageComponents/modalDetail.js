import React, { Component } from 'react'
import Modal from '../../../common/Modal'
import Button from '../../../common/Button'

class ModalDetail extends Component {
	
	render() {
		const { showModal, closeModal, modalType } = this.props

		return (
			<Modal showModal={showModal} closeModal={closeModal('')} className="detailModal" width="600px">
				{modalType === 'pickup' &&
					<div className="modalBody">
						<div className="caption">
							<div className="item-header"><img src="/images/ui-icon/icon-pickup.svg" alt="" />Pickup</div>
							<p className="desc">Rethink the way you've been donating items through our PickUp feature where you're able to view local nonprofits' needs and match those with items you have to <span className="text-blue">give</span>! <br /><br />Don't worry about the struggle of trying to keep up with receipts as we will store them for you throughout the year. <span className="text-blue">Giving</span> offline? Take a picture and we will store those receipts for you as well. Once tax season comes around, you'll be able to access all of your charitable donation deductions on the <span className="text-blue">My Giving</span> section of your profile.</p>
							<div className="button-group">
								<Button padding="8px 24px" label="Discover" className="closeX" onClick={closeModal('discover')}  solid noBorder/>
								<Button padding="8px 24px" label="Learn More" className="closeX" onClick={closeModal('learn')}  solid noBorder/>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-pickup.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'volunteer' &&
					<div className="modalBody">
						<div className="caption">
							<div className="item-header"><img src="/images/ui-icon/icon-volunteer.svg" alt="" />Volunteer</div>
							<p className="desc">Connect with nonprofits and casues you care and support through our volunteer feature! You no longer have to do all the  work and research of trying to find a nonprofit to volunteer to. <br /><br />You're now able to choose your interests, skills, and availability and we'll match you with the charitable organization that fits you! Not sure if your skills and interest match your volunteering goals? Step out of your comfort zone and discover new volunteer opportunity nonprofits have through our "Discover" feature and explore the many new ways you can <span className="text-blue">give</span>!</p>
							<div className="button-group">
								<Button padding="8px 24px" label="Discover" className="closeX" onClick={closeModal('discover')} solid noBorder />
								<Button padding="8px 24px" label="Learn More" className="closeX" onClick={closeModal('learn')}  solid noBorder/>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-volunteer.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'donate' &&
					<div className="modalBody">
						<div className="caption">
							<div className="item-header"><img src="/images/ui-icon/icon-donate.svg" alt="" />Donate</div>
							<p className="desc">OneGivv vets every nonprofit on our platform, making sure they meet our standards before allowing them to receive donations. With OneGivv, you receive your tax receipts immediately. No wait, no mail, and all in one place. <br /><br /><span className="text-blue">Giving</span> offline? Take a picture and we will store those receipts for you as well. Once tax season comes around, you'll be able to access all of your charitable donation deductions on the <span className="text-blue">My Giving</span> section of your profile.</p>
							<div className="button-group">
								<Button padding="8px 24px" label="Discover" className="closeX" onClick={closeModal('discover')}  solid noBorder/>
								<Button padding="8px 24px" label="Learn More" className="closeX" onClick={closeModal('learn')}  solid noBorder/>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-donate.png" alt="" />
						</div>
					</div>
				}
			</Modal>
		)
	}
}

export default ModalDetail