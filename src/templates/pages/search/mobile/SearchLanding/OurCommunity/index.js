import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from 'react-slick';

import { history } from '../../../../../../store';

class OurCommunity extends Component {
    
    state = {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
    }

    selectUser = userId => e => {
        history.push(`/${userId}`);
	}
    
    render() {
        const slickSettings = {
			dots: false,
			arrows: false,
			infinite: true,
			slidesToShow: 1,
			centerMode: true,
			centerPadding: '200px',
			slidesToScroll: 1,
			nextArrow: null,
			prevArrow: null,
			responsive: [{
				breakpoint: 769,
				settings: {
					centerPadding: '100px',
				}
			}, {
				breakpoint: 425,
				settings: {
					centerPadding: '75px',
				}
			}, {
				breakpoint: 350,
				settings: {
					centerPadding: '45px',
				}
			}]
        };

        const { communityList } = this.props;
        
        return (
            <section className="ourCommunity mobile">
                <p className="title">Our Community Pages</p>
                <Slider {...slickSettings} className="slider">
                    { communityList && communityList.length > 0 && communityList.map((e, i) => {
                        return (
                            <div className="sliderBox" key={e._id}>
                                <div className="boxContent">
                                    <div className="projectMiniCard">
                                        <div className="cardBody">
                                            <div className="cardContent">
                                                <div className="iconBox">
                                                    <img className="communityIcon" src="/images/ui-icon/search/health-community-page-icon.svg" alt="health-community-page-icon" />
                                                </div>
                                                <div className="titleBox">
                                                    <p>{e.communityTitle}</p>
                                                </div>
                                                <div className="contentBox">
                                                    <p>{e.aboutUs}</p>
                                                </div>
                                                <div className="btnBox">
                                                    <img 
                                                        className="communityFollowImg" 
                                                        src="/images/ui-icon/search/plus-people.svg" 
                                                        alt="plus-people"
                                                        onClick={this.selectUser(e._id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    } ) }
                </Slider>
            </section>
        )
    }
}

const mapStateToProps = state => ({
    isAuth: state.authentication.isAuth
})

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OurCommunity)