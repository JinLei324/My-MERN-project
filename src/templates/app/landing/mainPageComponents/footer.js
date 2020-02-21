import React from 'react'
import { NavLink } from 'react-router-dom'

import {history} from '../../../../store'
import {signIn} from '../../../common/authModals/modalTypes'
const Footer = () => (
	<footer className="container">
		<div className="mobile-footer-links" style={{display: 'flex', margin: '100px auto', maxWidth: '800px', justifyContent: 'space-around'}}>
			<div>
				<div>
					<span style={{fontSize: '16px', fontWeight: 'bold'}}>LEARN MORE</span>
				</div>
				<div style={{marginTop: '16px'}}>
					<NavLink
						to={`/about`}
						style={{textDecoration: 'none', color: '#666'}}>
						<span style={{fontSize: '16px', cursor: 'pointer'}}>About Us</span>
					</NavLink>
				</div>
				<div style={{marginTop: '20px', color: '#666'}}>
					<span style={{fontSize: '16px', cursor: 'pointer'}} onClick={e => window.Intercom('showNewMessage')}>Contact</span>
				</div>
			</div>
			<div >
				<div >
					<div>
						<span style={{fontSize: '16px', fontWeight: 'bold'}}>COMPANY</span>
					</div>
					<div style={{marginTop: '20px'}}>
						<span style={{fontSize: '16px', color: '#666', cursor: 'pointer', display:'none'}}>How it works</span>
					</div>
					<div style={{marginTop: '20px'}}>
						<span style={{fontSize: '16px', cursor: 'pointer', color: '#666'}} onClick={e => history.push(`?modal=${signIn}`)}>Login</span>
					</div>
				</div>
			</div>
			<div >
				<div >
					<div>
						<span style={{fontSize: '16px', fontWeight: 'bold'}}>LEGAL</span>
					</div>
					<div style={{marginTop: '20px'}}>																																																																				
						<a style={{fontSize: '16px', color: '#666', cursor: 'pointer', textDecoration:'none'}} href="https://s3.amazonaws.com/onegivv-common/Privacy+Policy+(OneGivv).pdf" target="_blank" rel="noopener noreferrer">Privacy</a>
					</div>
					<div style={{marginTop: '20px'}}>
						<a style={{fontSize: '16px', color: '#666', cursor: 'pointer', textDecoration:'none'}} href="https://s3.amazonaws.com/onegivv-common/User+Agreement+(Donors)+-+OneGivv.pdf" target="_blank" rel="noopener noreferrer">Terms</a>
					</div>
				</div>
			</div>
		</div>
		<div className="hide-mobile" style={{display: 'flex'}}>
			<NavLink
				exact
				to="/"
				className="text-gradient-blue">
				<img src="/images/ui-icon/icon-mark.svg" alt="" />
			</NavLink>																																																				
			<div style={{width: '100%', alignSelf: 'center', textAlign: 'right'}}>
				<span style={{color: '#1AAAFF'}}>©Copyright2019 OneGivv</span>
			</div>
		</div>
		<div className="mobile-footer">
			<NavLink
				exact
				to="/"
				className="text-gradient-blue">
				<img src="/images/ui-icon/icon-mark.svg" alt="" />
			</NavLink>
			<span style={{color: '#1AAAFF', fontSize: '14px', marginTop: '21px'}}>©Copyright2019 OneGivv</span>
		</div>
	</footer>
)

export default Footer
