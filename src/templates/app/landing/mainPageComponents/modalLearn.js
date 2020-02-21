import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../../../common/Modal'
import Button from '../../../common/Button'

class ModalJoin extends Component {
	render() {
		const { isAuth, showModal, closeModal, modalType } = this.props

		return (
			<Modal showModal={showModal} closeModal={closeModal('')} className="detailModal" width="600px">
				{modalType === 'business' &&
					<div className="modalBody">
						<div className="caption">
							<h2 className="text-blue m-0">Business</h2>
							<p className="desc">Through our Connecting the Dots feature, OneGivv allows your business to connect with nonprofits of your choice and <span className="text-blue">give</span> back to your local communities! <br /><br />By using this feature, you can post various items you have available to <span className="text-blue">give</span> and search for nonprofits in need of those items. Our goal is to help your business support the communities that support you! <br /><br />
								<span className="text-blue">Coming This New Year!</span></p>
							<div className="button-group">
								<Button padding="8px 24px" label="Stay Updated" className="closeX" onClick={closeModal('subscribe')} />
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-pickup.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'student' &&
					<div className="modalBody">
						<div className="caption">
							<h2 className="text-blue m-0">Student</h2>
							<p className="desc">Looking for an easy, fun way to complete your community service hours or in search of trying new ways to <span className="text-blue">give</span> back? <br /><br />Sign up for OneGivv and discover our student volunteer feature that connects you to causes and projects you care about. By using your school email and entering your interests and skills, we can match you with a volunteer opportunity that fits you or you may discover your own! When it's time to volunteer, we'll keep track of all the time you have given so you don't have to.</p>
							<div className="button-group">
								<Button padding="8px 24px" label="Discover" className="closeX" onClick={closeModal('discover')} />
								{/* <Button padding="8px 24px" label="Learn More" className="closeX" onClick={closeModal('learn')} /> */}
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-donate.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'nonprofit' &&
					<div className="modalBody">
						<div className="caption">
							<h2 className="text-blue m-0">Nonprofits</h2>
							<p className="desc">Through OneGivv,  you’re able to benefit from the many methods of <span className="text-blue">giving</span> available on our platform to save you time, money, and man power! <br /><br />Through our social media feature, you can communicate directly with your donors and communities to keep them updated and informed on your various causes, volunteer opportunities, and upcoming events! You can benefit from our Games for Good feature where donors play games and depending on the game, different items are donated to nonprofit organizations we have partnered up with.</p>
							<div className="button-group">
								{!isAuth && 
									<Button padding="8px 24px" label="Sign Up" className="closeX" onClick={closeModal('signup')} />
								}
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-pickup.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'donor' &&
					<div className="modalBody">
						<div className="caption">
							<h2 className="text-blue m-0">Donor</h2>
							<p className="desc">Through OneGivv, you’re given the tools to further your <span className="text-blue">giving</span> by being able to donate monetarily, volunteer, and request pickups for items you’d like to give! <br /><br />Furthermore, by using our Games for Good and social media features, you’re able to set up weekly or monthly <span className="text-blue">giving</span> goals, stay up-to-date on your projects of interest, search volunteer opportunities, and be apart of world wide movements! </p>
							<div className="button-group">
								<Button padding="8px 24px" label="Discover" className="closeX" onClick={closeModal('discover')} />
								{/* <Button padding="8px 24px" label="Learn More" className="closeX" onClick={closeModal('learn')} /> */}
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

const mapStateToProps = ({ authentication }) => ({
	isAuth: authentication.isAuth
})

export default connect(
	mapStateToProps
)(ModalJoin)