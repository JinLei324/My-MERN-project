import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { history } from '../../../../../store';

import Button from '../../../../common/Button';
import SearchBox from '../../../../common/SearchBox';

class SliderIntro extends Component {

    onClickSearch = e => {
		history.push('/m-search');
    }
    
    render() {
        return (
            <div className="homeContent">
                <div className="introBox">
                    <h4 className="captionTitle">Join the Social Network for Philanthropists</h4>
                    <h5 className="subtitle">OneGivv is a social, <strong>giving</strong> platform<br/>
                    that connects you to the communities and causes you<br/>
                    care about. Donate, Volunteer & Request pickups!</h5>
                    <SearchBox onMouseDown={this.onClickSearch} />
                    <div className="signUpBox">
                        <Button className="signUp" padding="7px 50px" label="Sign Up" onClick={this.props.onSignUpClick} />
                        <NavLink exact to="/discovery">
                            <Button className="discover" fontSize="18px" padding="6px 46px" label="Discover" inverse />
                        </NavLink>
                    </div>
                </div>
                <div className="descBox">
                    <p>In 2017 Brook got cancer, We the Kids helped raise $100,000 for her! She Back up and learn<br />how to ride a bike!</p>
                </div>
            </div>
        )
    }

}

export default SliderIntro;