import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import {
  trySuperLogin
} from '../actions/authActions';

class SuperLoginRoute extends Component {

  state = {
    isChecked: false
  }

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let super_token = params.get('token');
    let user_id = this.props.match.params.id;
    this.props.trySuperLogin({
      super_token,
      user_id,
        cb: data => {
          this.setState({
            isChecked: true
          })
        }
    })
  }

  render() {
    let { isChecked } = this.state;

    if (isChecked) {
      return (
        <Redirect
          to={{
            pathname: '/discovery',
          }}
        />
      )
    }

    return <div>Matching</div>
  }

}

const mapDispatchToProps = {
  trySuperLogin
}

export default connect(
  null,
  mapDispatchToProps
)(withRouter(SuperLoginRoute))
