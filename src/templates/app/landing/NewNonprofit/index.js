import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import NewFooter from '../mainPageComponents/NewFooter';

import { history } from '../../../../store';
import { signUp } from '../../../common/authModals/modalTypes';

class NewNonprofit extends Component {

    componentDidMount() {
        // document.querySelector('html').scrollTop = 0;

        window.renderParallaxWindow();
        window.renderViewMore();
    }

    render() {
        return (
            <div className="page-nonprofit">
                <div className="header-description" style={{backgroundImage: `url("/images/ui-icon/back/nonprofit-back.jpg")`}}>
                    <div className="cn parallax-window">
                        <div className="header-description__content" data-depth="0.3">
                            <h1 className="header-description__title">Nonprofit</h1>
                            <p className="header-description__description">
                                Save time and money! Manage all aspects of your nonprofit organization from one place.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="b-indent content-list">
                    <div className="cn">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <h2>OneGivv <small>is the </small>
                                    <span>Nonprofit Social, Marketing, CRM and Donation Platform</span></h2>
                                <h3 className="h3" style={{ color: `#000000` }}>Which help charities grow their giving as well as building better
                                    relationships with donors.</h3>
                            </div>
                        </div>
                    </div>
                    <div className="content-list-section">
                        <div className="cn content-list-section__item">
                                <div className="b-indent-left">
                                    <h3 className="h3 visible-lg content-list-section__title" style={{ color: `#000000` }}>Giving</h3>
                                    <div className="content-list-section__thumb" style={{backgroundImage: `url("/images/ui-icon/giving-pic.jpg")`}}></div>
                                </div>

                                <div className="b-indent-right content-list-section__content">
                                    <h3 className="h3 hidden-md content-list-section__title" style={{ color: `#000000` }}>Giving</h3>
                                    <div className="content-list-section__text off">
                                        <p>
                                            Streamline the giving process through our platform! Need volunteers for an upcoming event or have an emergency donation project you want to let your donors know about? Create projects for givvers where they can volunteer, donate, and request PickUps for items they want to donate to your organization and expand the reach of your cause!
                                        </p>
                                    </div>
                                    <p className="hide-content link visible-md">
                                        <span className="more">View more</span>
                                        <span className="less" style={{display: `none`}}>Hide</span>
                                    </p>
                                </div>
                            </div>
                        <div className="cn content-list-section__item">
                            <div className="b-indent-left">
                                <h3 className="h3 visible-lg content-list-section__title" style={{ color: `#000000` }}>Social</h3>
                                <div className="content-list-section__thumb" style={{backgroundImage: `url("/images/ui-icon/social-pic.jpg")`}}></div>
                            </div>

                            <div className="b-indent-right content-list-section__content">
                                <h3 className="h3 hidden-md content-list-section__title" style={{ color: `#000000` }}>Social</h3>
                                <div className="content-list-section__text off">
                                    <p>
                                        Be apart of something greater and utilize our social feature to grow your donor reach and engage with your network easily! Keep your donors up-to-date on the new projects you're creating, upcoming events you have, and even daily activities your organization is taking part in. Also, by using our chat feature, you're able to directly connect with donors and other organizations on our platform!
                                    </p>
                                </div>
                                <p className="hide-content link visible-md">
                                    <span className="more">View more</span>
                                    <span className="less" style={{display: `none`}}>Hide</span>
                                </p>
                            </div>
                        </div>
                        <div className="cn content-list-section__item">
                            <div className="b-indent-left">
                                <h3 className="h3 visible-lg content-list-section__title" style={{ color: `#000000` }}>CRM</h3>
                                <div className="content-list-section__thumb" style={{backgroundImage: `url("images/ui-icon/crm-pic.jpg")`}}></div>
                            </div>

                            <div className="b-indent-right content-list-section__content">
                                <h3 className="h3 hidden-md content-list-section__title" style={{ color: `#000000` }}>CRM</h3>
                                <div className="content-list-section__text off">
                                    <p>
                                        OneGivv CRM makes donor management easy. It works seamlessly with our social and giving features providing a single, data-rich view of donors.
                                    </p>
                                </div>
                                <p className="hide-content link visible-md">
                                    <span className="more">View more</span>
                                    <span className="less" style={{display: `none`}}>Hide</span>
                                </p>
                            </div>
                        </div>
                        <div className="cn content-list-section__item">
                            <div className="b-indent-left">
                                <h3 className="h3 visible-lg content-list-section__title" style={{ color: `#000000` }}>Impact Report</h3>
                                <div className="content-list-section__thumb" style={{backgroundImage: `url("images/ui-icon/report-pic.jpg")`}}></div>
                            </div>

                            <div className="b-indent-right content-list-section__content">
                                <h3 className="h3 hidden-md content-list-section__title" style={{ color: `#000000` }}>Impact Report</h3>
                                <div className="content-list-section__text off">
                                    <p>
                                        Share your impact! Update each successful project you run on OneGivv. Increase your productivity! Let OneGivv do the heavy lifting.
                                    </p>
                                </div>
                                <p className="hide-content link visible-md">
                                    <span className="more">View more</span>
                                    <span className="less" style={{display: `none`}}>Hide</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="b-indent help">
                    <div className="cn help-box">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <h2>How <small>do we help </small>
                                    <span>Your Donors?</span></h2>
                            </div>
                        </div>
                        <div className="b-indent-right">
                            <div className="help-text__description">
                                <p>
                                    We provide your donors with multiple ways to give to your organization, such as
                                    through donations, volunteering for projects or being able to request PickUps for
                                    items they want to donate. They are also able to keep track of all their giving
                                    history and view donation receipts all from their profile!
                                </p>
                                <p>
                                    With our social feature, we allow donors to post, share comments and connect with
                                    their friends and family. They are able to see all your updates and projects as well
                                    as share your posts with their network!
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="cn">
                        <div className="help-img">
                            <img src="images/ui-icon/help-pic.jpg" alt="help_picture" />
                        </div>
                    </div>
                </div>

                <div className="b-indent rofits">
                    <div className="cn">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <h2>What <small>we offer </small>
                                    <br /> <span>nonprofits</span></h2>
                            </div>
                        </div>
                    </div>
                    <div className="cn">
                        <div className="b-indent-left"></div>
                        <div className="b-indent-right rofits-content">
                            <div className="rofits__item">

                                <div className="rofits-info">
                                    <div className="rofits__title">Giving Platform</div>

                                    <div className="rofits__desc">
                                        Create donation projects, volunteer projects for your organization and post the items your nonprofit needs.
                                    </div>
                                </div>
                            </div>
                            <div className="rofits__item">

                                <div className="rofits-info">
                                    <div className="rofits__title">Volunteer Management</div>

                                    <div className="rofits__desc">
                                        Manage your volunteers for your organization! Know who is coming to help you through our volunteer RSVP feature and track your donors' volunteer hours all in one place.
                                    </div>
                                </div>
                            </div>
                            <div className="rofits__item">
                                <div className="rofits-info">
                                    <div className="rofits__title">Social Media Features</div>

                                    <div className="rofits__desc">
                                        Keep your donors updated through post and updates. Others can like, comment, and share your posts!
                                    </div>
                                </div>
                            </div>
                            <div className="rofits__item">
                                <div className="rofits-info">
                                    <div className="rofits__title">Basic Donor Analytics</div>

                                    <div className="rofits__desc">
                                        Manage and track all of your donor giving and access their donor analytics.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="b-indent ready">
                    <div className="cn ready-content">
                        <div className="b-indent-left ready-left"></div>
                        <div className="b-indent-right ready-right">
                            <div className="t-group">
                                <h2>Ready to see <small>how OneGivv </small>
                                    <span>can help you save</span> <small> time,</small> <span>raise</span>&nbsp;
                                    <small>more money and</small> <span>do</span> <small> more good?</small></h2>
                            </div>

                            <div className="btn-group">
                                <div className="btn btn--empty" onClick={e => window.Intercom('showNewMessage')}>Schedule a Demo</div>
                                <div className="btn btn--blue" onClick={e => history.push(`?modal=${signUp}`)}>Signup for Free</div>
                            </div>
                        </div>
                    </div>
                </div>

                <NewFooter />
                
            </div>
        )
    }

}

export default withRouter(
	connect(
		null,
		null,
		null,
		{
			pure: false
		}
	)(NewNonprofit)
)