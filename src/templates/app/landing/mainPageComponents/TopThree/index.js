import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';

class TopThree extends Component {

    render() {
        return (
            <div className="b-mTop">
                <div className="cn">
                    <div className="b-mTop-items b-mTop-items-3">
                        <div className="b-mTop__item">
                            <div className="b-mTop__icon"><span className="icon-donate"></span></div>
                            <div className="b-mTop__title">
                                Donate
                            </div>
                            <div className="b-mTop__desc">
                                Donate monetarily to projects and causes in your community and beyond, all while keeping track of your donations and impact!
                            </div>
                            {/* <NavLink className="b-mTop__link link" to={`/learn`} onClick={e => e.stopPropagation()}>
                                <span>Learn more...</span>
                            </NavLink> */}
                        </div>

                        <div className="b-mTop__item">
                            <div className="b-mTop__icon"><span className="icons-volunteering"></span></div>
                            <div className="b-mTop__title">
                                Volunteer
                            </div>
                            <div className="b-mTop__desc">
                                Give your time to local and global projects and causes. We connect you to amazing nonprofits to do amazing things!
                            </div>
                            {/* <NavLink className="b-mTop__link link" to={`/learn`} onClick={e => e.stopPropagation()}>
                                <span>Learn more...</span>
                            </NavLink> */}
                        </div>
                        <div className="b-mTop__item">
                            <div className="b-mTop__icon"><span className="icon-add-property"></span></div>
                            <div className="b-mTop__title">
                                PickUp
                            </div>
                            <div className="b-mTop__desc">
                                Don't wait around for nonprofits to call you for donation items! Request pickups from your local nonprofits for items you'd like to donate.
                            </div>
                            {/* <NavLink className="b-mTop__link link" to={`/learn`} onClick={e => e.stopPropagation()}>
                                <span>Learn more...</span>
                            </NavLink> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default TopThree