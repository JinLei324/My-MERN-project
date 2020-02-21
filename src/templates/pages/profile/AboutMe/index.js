import React, { Component } from 'react'
import Card from '../../../common/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import parseAddress from 'parse-address-string'

class AboutMe extends Component {
    state = {
        city: "",
        state: ""
    }
    componentDidMount() {        
        var thisObj = this        
        parseAddress(this.props.user.donorAddress, (err, as) => {
            if(!err) {
                thisObj.setState({city: as.city, state: as.state})
            }
        });
    }
    render() {
        const {city, state} = this.state
        const {logined, user} = this.props
        return(
            <Card  className="profile-about-me" padding="18px">
                {logined && logined._id === user._id && <div className="more-action">
                    <NavLink
                        to={`/${user._id}/setting`}>
                        <span className="action" onClick={this.toggleSubmenu}>
                            <FontAwesomeIcon icon="edit"/>
                        </span>          
                    </NavLink>
                </div>}
                <div className="_label">About Me:</div>
                <div className="separator-10"></div>
                <div className="_address">{!user.aboutUs && logined && logined._id === user._id ? 
                    'Write something about yourself, why do you give? ' 
                    : user.aboutUs}</div>
                <div className="separator-20"></div>
                <div className="_label">Hometown:</div>
                <div className="separator-10"></div>
                <div className="_address">{city}, {state}</div>
            </Card>
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
