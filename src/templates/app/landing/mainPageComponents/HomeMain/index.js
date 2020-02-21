import React, { Component } from 'react';

import { history } from '../../../../../store';

class HomeMain extends Component {

    render() {
        return (
            <div className="home-main" style={{ backgroundImage: `url("/images/ui-icon/back/home-back.jpg")` }}>
                <div className="cn">
                    <div className="home-main__content">
                        <h1 className="h1 home-main__title">
                            Rethink Giving
                        </h1>
                        <p className="home-main__desc">OneGivv is a social,  giving platform that connects you to the communities and causes you care about. Donate, Volunteer & Request PickUps! </p>
                        <div className="btn btn--blue" onClick={() => history.push(`/discovery`)}>Discover</div>
                    </div>
                </div>
            </div>
        )
    }

}

export default HomeMain