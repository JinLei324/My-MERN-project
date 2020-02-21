import React, { Component } from 'react'
import { connect } from 'react-redux'

class ChatHistory extends Component {
  render() {
    return (
      <div>
        this is ChatHistory
      </div>
    )
  }
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	userId: state.authentication.userId
})


export default connect(
	mapStateToProps,
	null
)(ChatHistory)