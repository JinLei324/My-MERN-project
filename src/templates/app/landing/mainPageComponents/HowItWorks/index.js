import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Button from '../../../../common/Button';

class HowItWorks extends Component {
	state = {
	}

	render() {
		return (
			<div className='how-it-works section'>
				<p className='title'>Join and make a difference</p>
				<p className='sub-title'>How OneGivv works</p>
				<div className='main'>
					<hr className='decorator'></hr>
					<div className='each'>
						<img alt='user' src='/images/ui-icon/landing/user.svg' />
						<p className='title'>Sign Up</p>
						<p className='desc'>Create your giving profile by signing up!</p>
						<Button label="Sign Up" onClick={this.props.onSignUpClick} />
					</div>
					<div className='each'>
						<img alt='discover' src='/images/ui-icon/landing/discover.svg' />
						<p className='title'>Discover</p>
						<p className='desc'>Search & connect with the causes you care about.</p>
						<NavLink exact to="/discovery">
							<Button label="Discover" inverse />
						</NavLink>
					</div>
					<div className='each'>
						<img alt='support' src='/images/ui-icon/landing/support.svg' />
						<p className='title'>Support</p>
						<p className='desc'>Donate, volunteer, or request PickUps to the nonprofits you support.</p>
					</div>
					<div className='each'>
						<img alt='impact' src='/images/ui-icon/landing/impact.svg' />
						<p className='title'>Impact</p>
						<p className='desc'>Stay up-to-date on the impact of the organizations and projects you give to!</p>
					</div>
				</div>
			</div>
		)
	}
}

export default HowItWorks