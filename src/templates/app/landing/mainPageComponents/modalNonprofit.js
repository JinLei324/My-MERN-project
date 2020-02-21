import React, { Component } from 'react'
import Modal from '../../../common/Modal'
// import Button from '../../../common/Button'
import { signUp } from '../../../common/authModals/modalTypes'
import { history } from '../../../../store'

class ModalNonProfit extends Component {
  onClickDemo = e => {
		window.Intercom('showNewMessage')
  }

  onClickSignup = e => {
    history.push(`?modal=${signUp}`);
  }
  
	render() {
		const { showModal, closeModal, modalType } = this.props

		return (
			<Modal showModal={showModal} closeModal={closeModal('')} className="detailModal" width="600px">
				{modalType === 'crm' &&
					<div className="modalBody">
						<div className="caption" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
							<div className="item-header"><img src="/images/ui-icon/landing/nonprofit-icon-crm-sm.svg" alt="" />
                <span style={{color: '#!AAAFF', fontWeight: 'bold'}}>CRM</span>
              </div>
							<p className="desc">OneGivv CRM makes donor management easy. It works seamlessly with our giving feature to provide a single, data-rich view of donors. Which donors should you contact and when? When last did you ask for a donation? OneGivv CRM intelligently suggests which donors nonprofits should reach out to based on a multitude of different types of information.</p>
							<div className="button-group">
                <button style={{
                  padding: '8px 24px', 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                  background: '#1AAAFF', 
                  boxSizing: 'border-box',
                  color: '#fff',
                  fontSize: '14px',
                  border: '0'
                }} onClick={this.onClickDemo}>
                  Schedule a Demo
                </button>
                <button style={{
                  marginLeft: '10px',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                  background: '#fff',
                  color: '#1AAAFF',
                  boxSizing: 'border-box',
                  border: '0',
                  fontSize: '14px'
                }} onClick={this.onClickSignup}>
                  Signup for Free
                </button>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-pickup.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'social' &&
					<div className="modalBody">
						<div className="caption" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
							<div className="item-header"><img src="/images/ui-icon/landing/nonprofit-icon-social-sm.svg" alt="" />
                <span style={{color: '#1AAAFF', fontWeight: 'bold'}}>SOCIAL</span>
              </div>
							<p className="desc">Our features allow you to post, update, share and chat with your network about what is going on at your organization-- making discovering new opportunities to work with individuals, business, or other non-profits seamless!</p>
							<div className="button-group">
                <button style={{
                  padding: '8px 24px', 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                  background: '#1AAAFF', 
                  boxSizing: 'border-box',
                  color: '#fff',
                  fontSize: '14px',
                  border: '0'
                }} onClick={this.onClickDemo}>
                  Schedule a Demo
                </button>
                <button style={{
                  marginLeft: '10px',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                  background: '#fff',
                  color: '#1AAAFF',
                  boxSizing: 'border-box',
                  border: '0',
                  fontSize: '14px'
                }} onClick={this.onClickSignup}>
                  Signup for Free
                </button>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-volunteer.png" alt="" />
						</div>
					</div>
				}
				{modalType === 'giving' &&
					<div className="modalBody">
						<div className="caption" style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}}>
							<div className="item-header"><img src="/images/ui-icon/landing/nonprofit-icon-giving-sm.svg" alt="" />
                <span style={{color: '#1AAAFF', fontWeight: 'bold'}}>GIVING</span>
              </div>
							<p className="desc">
                Have more than one program or project going on at a time? Create projects that are specific to each. Not to mention, you can track the progress of all your campaigns in real time on any mobile device or computer!  
              </p>
							<div className="button-group">
                <button style={{
                padding: '8px 24px', 
                borderRadius: '8px', 
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                background: '#1AAAFF', 
                boxSizing: 'border-box',
                color: '#fff',
                fontSize: '14px',
                border: '0'
              }} onClick={this.onClickDemo}> 
                Schedule a Demo
              </button>
              <button style={{
                marginLeft: '10px',
                padding: '8px 24px',
                borderRadius: '8px',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                background: '#fff',
                color: '#1AAAFF',
                boxSizing: 'border-box',
                border: '0',
                fontSize: '14px'
              }} onClick={this.onClickSignup}>
                Signup for Free
              </button>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-donate.png" alt="" />
						</div>
					</div>
        }
        {modalType === 'report' &&
					<div className="modalBody">
						<div className="caption">
							<div className="item-header"><img src="/images/ui-icon/landing/nonprofit-icon-report-sm.svg" alt="" />
                <span style={{color: '#!AAAFF', fontWeight: 'bold'}}>Impact Report</span>
              </div>
							<p className="desc">Give your donors valuable information on how the project went-- this feature keeps your network and donor base in the loop and encourages givvers on the platform to stay connected with the causes that they are passionate about!</p>
							<div className="button-group">
                <button style={{
                  padding: '8px 24px', 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                  background: '#1AAAFF', 
                  boxSizing: 'border-box',
                  color: '#fff',
                  fontSize: '14px',
                  border: '0'
                }} onClick={this.onClickDemo}>
                  Schedule a Demo
                </button>
                <button style={{
                  marginLeft: '10px',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', 
                  background: '#fff',
                  color: '#1AAAFF',
                  boxSizing: 'border-box',
                  border: '0',
                  fontSize: '14px'
                }} onClick={this.onClickSignup}>
                  Signup for Free
                </button>
							</div>
						</div>
						<div className="img-wrapper">
							<img src="/images/ui-icon/landing/iphone-pickup.png" alt="" />
						</div>
					</div>
				}
			</Modal>
		)
	}
}

export default ModalNonProfit