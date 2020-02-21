import React, { Component } from 'react';

import { history } from '../../../../../store';

class DiscoverIdentity extends Component {

    constructor(props) {
		super(props);

		this.onClickDonate = this.onClickDonate.bind(this);
		this.onClickVolunteer = this.onClickVolunteer.bind(this);
		this.onClickPickup = this.onClickPickup.bind(this);
    }
    
    onClickDonate = e => {
        e.stopPropagation();

        history.push('/discovery?type=1');
    }

    onClickVolunteer = e => {
        e.stopPropagation();

        history.push('/discovery?type=0');
    }

    onClickPickup = e => {
        e.stopPropagation();
        
        history.push('/discovery?type=2');
    }

    render() {
        return (
            <div className="discoverIdentity">
                <p className="title">Discover your philanthropic identity</p>
                <p className="description">Explore The Many Ways to Give on OneGivv</p>
                <div className="box">
                    <ul>
                        <li>
                            <div className="hideDesktop">
                                <img className="iconBtn" src="/images/ui-icon/landing/identity/donate-btn.svg" alt="donate-btn" onClick={this.onClickDonate} />
                                <span>Donate</span>
                            </div>
                            <img src="/images/ui-icon/landing/identity/donate.svg" alt="donate" />
                            <p className="subDesc">
                                Donate monetarily to projects and causes in your community and beyond, all while keeping track of your donations and impact!
                            </p>
                            <div className="showDesktop">
                                <img className="iconBtn" src="/images/ui-icon/landing/identity/donate-btn.svg" alt="donate-btn" onClick={this.onClickDonate} />
                                <span>Donate</span>
                            </div>
                        </li>
                        <li>
                            <div className="hideDesktop">
                                <img className="iconBtn" src="/images/ui-icon/landing/identity/volunteer-btn.svg" alt="volunteer-btn" onClick={this.onClickVolunteer} />
                                <span>Volunteer</span>
                            </div>
                            <img src="/images/ui-icon/landing/identity/volunteer.svg" alt="volunteer" />
                            <p className="subDesc">
                                Give your time to local and global projects and causes. We connect you to amazing nonprofits to do amazing things!
                            </p>
                            <div className="showDesktop">
                                <img className="iconBtn" src="/images/ui-icon/landing/identity/volunteer-btn.svg" alt="volunteer-btn" onClick={this.onClickVolunteer} />
                                <span>Volunteer</span>
                            </div>
                        </li>
                        <li>
                            <div className="hideDesktop">
                                <img className="iconBtn" src="/images/ui-icon/landing/identity/pickup-btn.svg" alt="pickup-btn" onClick={this.onClickPickup} />
                                <span>Pickup</span>
                            </div>
                            <img src="/images/ui-icon/landing/identity/pickup.svg" alt="pickup" />
                            <p className="subDesc">
                                Don't wait around for nonprofits to call you for donation items! Request pick-ups from your local nonprofits for items you'd like to donate.
                            </p>
                            <div className="showDesktop">
                                <img className="iconBtn" src="/images/ui-icon/landing/identity/pickup-btn.svg" alt="pickup-btn" onClick={this.onClickPickup} />
                                <span>Pickup</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }

}

export default DiscoverIdentity;