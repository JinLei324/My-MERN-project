import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';

import NewFooter from '../mainPageComponents/NewFooter';

import { history } from '../../../../store';
import { signUp } from '../../../common/authModals/modalTypes';

class NewLearnMorePage extends Component {

    componentDidMount() {
        // document.querySelector('html').scrollTop = 0;
        
        window.renderParallaxWindow();
        window.renderFaqScroll();
        window.renderReadMore();
    }

	render() {
		return (
			<div className="page-learn-more">
				<div className="header-description parallax-window" style={{backgroundImage: `url("images/ui-icon/back/l-more-back.jpg")`}}>
                    <div className="cn" data-depth="0.2">
                        <div className="header-description__content">
                            <h1 className="header-description__title">
                                Select a Role to <br /> Learn More!
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="b-indent learn-more-section">
                    <div className="cn learn-more-section__item">
                        <div className="b-indent-left">
                            <h3 className="h3 visible-lg learn-more-section__title" style={{ color: `#000000` }}>Nonprofit</h3>
                            <div className="learn-more-section__thumb" style={{backgroundImage: `url("images/ui-icon/l-more/1.jpg")`}}></div>
                        </div>
                        <div className="b-indent-right learn-more-section__content">
                            <h3 className="h3 hidden-md learn-more-section__title" style={{ color: `#000000` }}>Nonprofit</h3>
                            <div className="learn-more-section__text off">
                                <p>Through OneGivv, you're able to benefit from the many methods of giving available on our platform to save you time, money, and man power!</p>
                                <p>Also, through our social media feature, you can communicate directly with your donors and communities to keep them updated and informed on your various causes, volunteer opportunities, and upcoming events!</p>
                            </div>
                            <p className="hide-content link visible-md">
                                <span className="more">View more</span>
                                <span className="less" style={{display: `none`}}>Hide</span>
                            </p>
                            <div className="btn-group">
                                <p className="btn btn--rounded btn--brdr-b btn--sm" onClick={e => history.push(`?modal=${signUp}`)}>
                                    Sign up
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="cn learn-more-section__item">
                        <div className="b-indent-left">
                            <h3 className="h3 visible-lg learn-more-section__title" style={{ color: `#000000` }}>Donor</h3>
                            <div className="learn-more-section__thumb" style={{backgroundImage: `url("images/ui-icon/l-more/2.jpg")`}}></div>
                        </div>
                        <div className="b-indent-right learn-more-section__content">
                            <h3 className="h3 hidden-md learn-more-section__title" style={{ color: `#000000` }}>Donor</h3>
                            <div className="learn-more-section__text off">
                                <p>Through OneGivv, we give you the tools to further your giving by being able to donate monetarily, volunteer, and request PickUps for items you'd like to give!</p>
                                <p>Furthermore, by using our social media feature and chat, you're able to stay up-to-date on the projects you love, discover volunteer opportunities, chat with organizations and friends, and be apart of world wide movements!</p>
                            </div>
                            <p className="hide-content link visible-md">
                                <span className="more">View more</span>
                                <span className="less" style={{display: `none`}}>Hide</span>
                            </p>
                            <div className="btn-group">
                                <NavLink className="btn btn--rounded btn--brdr-b btn--sm" to={`/discovery`} onClick={e => e.stopPropagation()}>
                                    <span>Discover</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>

                    <div className="cn learn-more-section__item">
                        <div className="b-indent-left">
                            <h3 className="h3 visible-lg learn-more-section__title" style={{ color: `#000000` }}>Student</h3>
                            <div className="learn-more-section__thumb" style={{backgroundImage: `url("images/ui-icon/l-more/3.jpg")`}}></div>
                        </div>
                        <div className="b-indent-right learn-more-section__content">
                            <h3 className="h3 hidden-md learn-more-section__title" style={{ color: `#000000` }}>Student</h3>
                            <div className="learn-more-section__text off">
                                <p>Looking for an easy, fun way to complete your community service hours or in search of trying new ways to give back?</p>
                                <p>Sign up for OneGivv and discover our student volunteer feature that connects you to causes and projects you care about. By using your school email and entering your interests and skills, we can match you with a volunteer opportunity that fits you or you may discover your own! When it's time to volunteer, we'll keep track of all the time you have given so you don't have to.</p>
                            </div>
                            <p className="hide-content link visible-md">
                                <span className="more">View more</span>
                                <span className="less" style={{display: `none`}}>Hide</span>
                            </p>
                            <div className="btn-group">
                                <NavLink className="btn btn--rounded btn--brdr-b btn--sm" to={`/discovery`} onClick={e => e.stopPropagation()}>
                                    <span>Discover</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="gradient-overlay">
                            <p>Coming Soon</p>
                        </div>
                    </div>

                    <div className="cn learn-more-section__item">
                        <div className="b-indent-left">
                            <h3 className="h3 visible-lg learn-more-section__title" style={{ color: `#000000` }}>Business</h3>
                            <div className="learn-more-section__thumb" style={{backgroundImage: `url("images/ui-icon/l-more/4.jpg")`}}></div>
                        </div>
                        <div className="b-indent-right learn-more-section__content">
                            <h3 className="h3 hidden-md learn-more-section__title" style={{ color: `#000000` }}>Business</h3>
                            <div className="learn-more-section__text off">
                                <p>Through our Connecting the Dots feature, OneGivv allows your business to connect with nonprofits of your choice and give  back to your local communities! </p>
                                <p>By using this feature, you can post various items you have available to give  and search for nonprofits in need of those items. Our goal is to help your business support the communities that support you! </p>
                                <p>Coming This New Year!</p>
                            </div>
                            <p className="hide-content link visible-md">
                                <span className="more">View more</span>
                                <span className="less" style={{display: `none`}}>Hide</span>
                            </p>
                            <div className="btn-group">
                                <NavLink className="btn btn--rounded btn--brdr-b btn--sm" to={`/discovery`} onClick={e => e.stopPropagation()}>
                                    <span>Stay Updated</span>
                                </NavLink>
                            </div>
                        </div>
                        <div className="gradient-overlay">
                            <p>Coming Soon</p>
                        </div>
                    </div>

                </div>

                <div className="b-indent b-scroll faq">
                    <div className="cn">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <div className="t-group">
                                    <h2>Frequently <span>asked questions</span></h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cn-fl">
                        <div className="b-scroll-wrap">
                            <div className="scrollbar">
                                <div className="handle">
                                    <div className="mousearea"></div>
                                </div>
                            </div>
                            <div className="b-scroll-items faq-scroll frame">
                                <ul className="clearfix">
                                    <li className="b-scroll__item active">
                                        <div className="b-scroll__content faq-scroll__content">
                                            <div className="faq-scroll__count">01.</div>
                                            <h3 className="h3 faq-scroll__question">Why should I give with OneGivv?</h3>
                                            <p className="faq-scroll___answer">At OneGivv we place a huge emphasis on transparency. When you give with us, you can be sure that your donation is being used for good by a trustworthy nonprofit.</p>
                                        </div>
                                    </li>
                                    <li className="b-scroll__item">
                                        <div className="b-scroll__content faq-scroll__content">
                                            <div className="faq-scroll__count">02.</div>
                                            <h3 className="h3 faq-scroll__question">How do I search for nonprofits on OneGivv?</h3>
                                            <p className="faq-scroll___answer">To search for a nonprofit, go to our Discover page and then click the tab labeled "Filter." A dropdown menu will appear which you can use to search for nonprofits!</p>
                                        </div>
                                    </li>
                                    <li className="b-scroll__item">
                                        <div className="b-scroll__content faq-scroll__content">
                                            <div className="faq-scroll__count">03.</div>
                                            <h3 className="h3 faq-scroll__question">When do I get my receipt?</h3>
                                            <p className="faq-scroll___answer">After completing your donation, you will immediately receive a receipt on behalf of your chosen nonprofit in your email inbox and in the “My Giving” section of your profile!</p>
                                        </div>
                                    </li>
                                    <li className="b-scroll__item">
                                        <div className="b-scroll__content faq-scroll__content">
                                            <div className="faq-scroll__count">04.</div>
                                            <h3 className="h3 faq-scroll__question">How do I donate?</h3>
                                            <p className="faq-scroll___answer">To donate, head to our Discover page and click the tab labeled "Donations". Click on the campaign that you want to donate to and then select “donate” from the available options. You will then be directed to the payment page to complete your donation. You can also donate directly from a nonprofit’s profile by electing “Give” and then "Donate" from the available options!</p>
                                        </div>
                                    </li>
                                    <li className="b-scroll__item">
                                        <div className="b-scroll__content faq-scroll__content">
                                            <div className="faq-scroll__count">05.</div>
                                            <h3 className="h3 faq-scroll__question">Is my donation tax deductible?</h3>
                                            <p className="faq-scroll___answer">All donations made through the OneGivv platform are tax deductible! We keep track of your receipts so that you are good to go come tax season.</p>
                                        </div>
                                    </li>
                                    <li className="b-scroll__item">
                                        <div className="b-scroll__content faq-scroll__content">
                                            <div className="faq-scroll__count">06.</div>
                                            <h3 className="h3 faq-scroll__question">Why a service fee?</h3>
                                            <p className="faq-scroll___answer">Great question! The service fees on our platform keep OneGivv up and running and allow us to give nonprofits 100% of your donations to nonprofits!</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="btn-group">
                                    <NavLink className="link" to={`/discovery`} onClick={e => e.stopPropagation()}>
                                        <span>Discover more</span>
                                    </NavLink>
                                </div>

                            </div>
                            <div className="controls center">
                                <button className="next"><i className="icon-lg-arrow-right"></i></button>
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
	)(NewLearnMorePage)
)