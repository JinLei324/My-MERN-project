import React, { Component } from 'react';

class MainDiscover extends Component {

    componentDidMount() {
        window.renderDiscoverContentSlick();
    }

    render() {
        return (
            <div className="b-indent main-discover">
                <div className="cn">
                    <div className="b-indent-left">
                        <div className="t-group">
                            <div className="t-group">
                                <h2>Discover <small>your</small> <span>philanthropic identity</span></h2>
                                <h3 style={{ color: `#000000` }}>OneGivv makes it easy for you to give to your favorite causes in multiple ways, all from one place.</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="cn">
                    <div className="b-indent-left"></div>
                    <div className="b-indent-right main-discover-content">
                        <div className="main-discover__item">
                            <div className="main-discover__header">
                                <div className="main-discover__icon"><span className="icons-receive-cash"></span></div>
                                <div className="main-discover__title">My Giving</div>
                            </div>
                            <div className="main-discover__desc">
                                My Giving is where you’ll be able to track and refine your imprint on the world as well as access all your giving information. From how many volunteer hours you’ve completed to all your donation history.
                            </div>
                        </div>
                        <div className="main-discover__item">
                            <div className="main-discover__header">
                                <div className="main-discover__icon"><span className="icon-user-groups"></span></div>
                                <div className="main-discover__title">Social Feature</div>
                            </div>
                            <div className="main-discover__desc">
                                Learn more about what your community is up to on OneGivv. Check out updates from nonprofits, share volunteer memories, express your thoughts, post, update friends and family, comment and share!
                            </div>
                        </div>
                        <div className="main-discover__item">
                            <div className="main-discover__header">
                                <div className="main-discover__icon"><span className="icon-find-user-male"></span></div>
                                <div className="main-discover__title">Discover</div>
                            </div>
                            <div className="main-discover__desc">
                                We continuously match you with nonprofits based on your background and interests. Explore new ways to give back and connect with your community!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default MainDiscover