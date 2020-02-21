import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import queryString from 'query-string'
import {
    getStripeAccount
} from '../actions/user'

class StripeRoute extends Component {

    state = {
        userId: "",
        code: ""
    }
    componentDidMount() {
        const params = queryString.parse(this.props.location.search)
        this.setState({userId: params.state, code: params.code})
        this.props.getStripeAccount({
            code: params.code
        })
    }

    render() {
        const {userId, code} = this.state
        const {stripeResponse} = this.props
        if(userId && code && stripeResponse > 0) {
            return (
                <Redirect
                    to={{
                        pathname: `/${userId}/dashboard`,
                        search: `?status=${stripeResponse}`
                    }}
                />
            )
        }
        return <div className="modal open">Connecting stripe</div>
    }
    
}

const mapStateToProps = state => ({
    stripeResponse: state.user.stripeConnectResponse
})

const mapDispatchToProps = {
    getStripeAccount
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(StripeRoute))