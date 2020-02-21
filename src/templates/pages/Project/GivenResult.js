import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserAvatar from '../../common/userComponents/userAvatar';

class GivenResult extends Component {

	state = {
	}

	render() {
        const { user, project } = this.props;
        
        if (!user) {
            return (null);
        }

		return (
			<div className="given-result">
                <div className="flex-wrapper">
                    <div className="flex-wrapper user-avatar">
                        <UserAvatar
                            imgUser = { user.avatar }
                            imgUserType = { user.role }
                            userId = { user._id }
                        />
                        <div className='desc'>
                            <p className='note'>You've given:</p>
                            <p className='date'>{ moment(project.donate_date).format('MMMM D, YYYY') }</p>
                        </div>
                    </div>
                    <div className='flex-wrapper other'>
                        <p className='amount'>${ project.donate_sum }</p>
                        <button className="action">
                            <FontAwesomeIcon icon="ellipsis-v"/>
                        </button>
                    </div>
                </div>
			</div>
		)
	}
}

const mapStateToProps = ({ authentication, project }) => ({
	user: authentication.user,
	userId: authentication.userId
})

const mapDispatchToProps = {
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GivenResult)