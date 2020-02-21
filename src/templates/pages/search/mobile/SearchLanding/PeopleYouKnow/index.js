import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from 'react-slick';

import UserAvatar from '../../../../../common/userComponents/userAvatar';

class PeopleYouKnow extends Component {
    
    state = {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps) {
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

        const { userList, /*followList,*/ isAuth } = this.props;

        let users = [];
        if (isAuth) {
            // users = [...followList];
            users = [...userList];
        } else {
            users = [...userList];
        }
        
        return (
            <section className="peopleYouKnow mobile">
                <p className="title">People You May Know</p>
                <Slider {...slickSettings} className="slider">
                    { users && users.length > 0 && users.map((e, i) => {
                        return (
                            <div className="sliderBox" key={e._id}>
                                <div className="boxContent">
                                    <div className="avatarBox">
                                        <UserAvatar
                                            imgUser={e.avatar}
                                            userId={e._id}
                                            size={55}
                                        />
                                    </div>
                                    <div className="nameBox">
                                        <p>{ e.companyName || e.firstName + " " + e.lastName }</p>
                                    </div>
                                    <div className="btnBox">
                                        {/* { (e.hasFollowers || isAuth) && <img src="/images/ui-icon/search/checked-people.svg" alt="checked-people" /> }
                                        { !e.hasFollowers && !isAuth && <img src="/images/ui-icon/search/plus-people.svg" alt="plus-people" /> } */}
                                        { e.hasFollowers && <img src="/images/ui-icon/search/checked-people.svg" alt="checked-people" /> }
                                        { !e.hasFollowers && <img src="/images/ui-icon/search/plus-people.svg" alt="plus-people" /> }
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
)(PeopleYouKnow)