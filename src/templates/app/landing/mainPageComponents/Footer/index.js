import React from 'react';
import { NavLink } from 'react-router-dom';

import { history } from '../../../../../store';
import { signIn } from '../../../../common/authModals/modalTypes';

const Footer = () => (
	<footer className="container">
		<div className="links">
			<ul className="horizMenu">
				<li>
					<ul className="vertMenu">
						<li>Learn More</li>
						<li>
							<NavLink
								to={`/about`}
								style={{textDecoration: 'none'}}>
								About Us
							</NavLink>
						</li>
						<li onClick={e => window.Intercom('showNewMessage')}>Contact</li>
					</ul>
				</li>
				<li>
					<ul className="vertMenu">
						<li>Company</li>
						<li>How it works</li>
						<li onClick={e => history.push(`?modal=${signIn}`)}>Login</li>
					</ul>
				</li>
				<li>
					<ul className="vertMenu">
						<li>Legal</li>
						<li>
							<a className="privacyLink" href="https://s3.amazonaws.com/onegivv-common/Privacy+Policy+(OneGivv).pdf" target="_blank" rel="noopener noreferrer">
								Privacy
							</a>
						</li>
						<li>
							<a className="termsLink" href="https://s3.amazonaws.com/onegivv-common/User+Agreement+(Donors)+-+OneGivv.pdf" target="_blank" rel="noopener noreferrer">
								Terms
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<div className="copyright">
			<NavLink
				exact
				to="/"
				className="textGradientBlue">
				<img src="/images/ui-icon/icon-mark.svg" alt="icon-mark" />
			</NavLink>																																																				
			<p>©Copyright2019 OneGivv</p>
		</div>
	</footer>
)

export default Footer