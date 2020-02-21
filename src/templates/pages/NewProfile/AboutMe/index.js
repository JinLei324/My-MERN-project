import React, { Component } from 'react';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import parseAddress from 'parse-address-string';

import Card from '../../../common/Card';

class AboutMe extends Component {

    state = {
        city: "",
        state: ""
    }

    componentDidMount() {        
        var thisObj = this        
        parseAddress(this.props.user.donorAddress, (err, as) => {
            if (!err) {
                thisObj.setState({
                    city: as.city,
                    state: as.state
                });
            }
        });
    }

    render() {
        const { city, state } = this.state;
        const { logined, user, isDetail } = this.props;

        return (
            <section className="aboutMeSection">
                { isDetail &&
                    <div className="detailBody">
                        <Card className="aboutMeBody desktop">
                            <div className="leftFlexBody">
                                <p className="title">About me</p>
                                <p className="desc">
                                    { ( !user.aboutUs && logined && logined._id === user._id)
                                        ? 'Write something about yourself, why do you give? ' 
                                        : user.aboutUs }
                                </p>
                            </div>
                            { logined && logined._id === user._id &&
                                <div className="rightFlexBody">
                                    <NavLink
                                        to={`/${user._id}/setting`}>
                                        <span onClick={this.toggleSubmenu}>
                                            Edit
                                        </span>          
                                    </NavLink>
                                </div>
                            }
                        </Card>

                        <Card className="aboutMeBody mobile">
                            <div className="flexBody">
                                <div className="leftFlexBody">
                                    <p className="title">About me</p>
                                </div>
                                { logined && logined._id === user._id &&
                                    <div className="rightFlexBody">
                                        <NavLink
                                            to={`/${user._id}/setting`}>
                                            <span onClick={this.toggleSubmenu}>
                                                <img src="/images/ui-icon/profile/pencil-icon.svg" alt="pencil-icon" />
                                            </span>          
                                        </NavLink>
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="desc">
                                    { ( !user.aboutUs && logined && logined._id === user._id)
                                        ? 'Write something about yourself, why do you give? ' 
                                        : user.aboutUs }
                                </p>
                            </div>
                        </Card>

                        <Card className="homeTownBody desktop">
                            <div className="leftFlexBody">
                                <p className="title">Hometown</p>
                                <p className="desc">{city}, {state}</p>
                            </div>
                            { logined && logined._id === user._id &&
                                <div className="rightFlexBody">
                                    <NavLink
                                        to={`/${user._id}/setting`}>
                                        <span onClick={this.toggleSubmenu}>
                                            Edit
                                        </span>          
                                    </NavLink>
                                </div>
                            }
                        </Card>

                        <Card className="aboutMeBody mobile">
                            <div className="flexBody">
                                <div className="leftFlexBody">
                                    <p className="title">Hometown</p>
                                </div>
                                { logined && logined._id === user._id &&
                                    <div className="rightFlexBody">
                                        <NavLink
                                            to={`/${user._id}/setting`}>
                                            <span onClick={this.toggleSubmenu}>
                                                <img src="/images/ui-icon/profile/pencil-icon.svg" alt="pencil-icon" />
                                            </span>          
                                        </NavLink>
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="desc">{city}, {state}</p>
                            </div>
                        </Card>

                        <Card className="emailBody desktop">
                            <div className="leftFlexBody">
                                <p className="title">Email</p>
                                <p className="desc">{user.email}</p>
                            </div>
                            { logined && logined._id === user._id &&
                                <div className="rightFlexBody">
                                    <NavLink
                                        to={`/${user._id}/setting`}>
                                        <span onClick={this.toggleSubmenu}>
                                            Edit
                                        </span>          
                                    </NavLink>
                                </div>
                            }
                        </Card>

                        <Card className="aboutMeBody mobile">
                            <div className="flexBody">
                                <div className="leftFlexBody">
                                    <p className="title">Email</p>
                                </div>
                                { logined && logined._id === user._id &&
                                    <div className="rightFlexBody">
                                        <NavLink
                                            to={`/${user._id}/setting`}>
                                            <span onClick={this.toggleSubmenu}>
                                                <img src="/images/ui-icon/profile/pencil-icon.svg" alt="pencil-icon" />
                                            </span>          
                                        </NavLink>
                                    </div>
                                }
                            </div>
                            <div>
                                <p className="desc">{user.email}</p>
                            </div>
                        </Card>

                    </div>
                }
                { !isDetail &&
                    <div className="detailBody">
                        <Card className="detailCard">
                            <div className="headerBody">
                                <p className="title">About Me</p>
                                <p className="desc">
                                    { ( !user.aboutUs && logined && logined._id === user._id)
                                        ? 'Write something about yourself, why do you give? ' 
                                        : user.aboutUs }
                                </p>
                            </div>
                            <div className="homeTownBody">
                                <p className="title">Hometown</p>
                                <p className="desc">{city}, {state}</p>
                            </div>
                            <div className="emailBody">
                                <p className="title">Email</p>
                                <p className="desc">{user.email}</p>
                            </div>
                        </Card>
                    </div>
                }
            </section>
        )
    }
}

const mapStateToProps = state => ({
    logined: state.authentication.user,
})

const mapDispatchToProps = {
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AboutMe)