import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { history } from '../../../../../store';

import { signUp } from '../../../../common/authModals/modalTypes';

class NewHowItWorks extends Component {

	state = {
	}

	render() {
		return (
			<div className="b-indent join">
                <div className="cn">
                    <div className="b-indent-left">
                        <div className="t-group">
                            <div className="t-group">
                                <h2>Join <small>and make</small>
                                    <br /> <span>a difference</span></h2>
                                <h3>How OneGivv works!</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cn">
                    <div className="b-indent-left"></div>
                    <div className="b-indent-right join-content">
                        <div className="join__item">

                            <div className="join__count">01.</div>
                            <div className="join-info">
                                <div className="join__title">Sign Up</div>

                                <div className="join__desc">
                                    Create your giving profile by signing up!
                                </div>
                            </div>
                            <p className="btn btn--rounded btn--white btn--sm" onClick={e => history.push(`?modal=${signUp}`)}>Sign up</p>
                        </div>
                        <div className="join__item">

                            <div className="join__count">02.</div>
                            <div className="join-info">
                                <div className="join__title">Discover</div>

                                <div className="join__desc">
                                    Search & connect with the causes you care about.
                                </div>
                            </div>
                            <NavLink className="btn btn--rounded btn--white btn--sm" to={`/discovery`} onClick={e => e.stopPropagation()}>
                                <span>Discover</span>
                            </NavLink>
                        </div>
                        <div className="join__item">
                            <div className="join__count">03.</div>
                            <div className="join-info">
                                <div className="join__title">Support</div>

                                <div className="join__desc">
                                    Donate, volunteer, or request PickUps to the nonprofits you support.
                                </div>
                            </div>
                        </div>

                        <div className="join__item">

                            <div className="join__count">04.</div>
                            <div className="join-info">
                                <div className="join__title">Impact</div>

                                <div className="join__desc">
                                    Stay up-to-date on the impact of the organizations and projects you give to!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="cn join-video">
                    <div className="b-indent-full">
                        <iframe src="https://www.youtube.com/embed/bXHfrdi_fsU" title="joinVideo" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                </div> */}
            </div>
		)
	}

}

export default NewHowItWorks