import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { getUserList, clearUserList } from '../../../../actions/user';
import Placeholder from '../../../common/noContentPlaceholder';

import CharityForm from '../CharityForm';

class NonprofitsWeLove extends Component {

    state = {
        skip: 0,
        limit: 10
    }

    componentDidMount() {
        this._mounted = true;

        let { skip, limit } = this.state;
        const { title, location, interests } = this.props;

        this.props.getUserList({
            skip: skip,
            limit: limit, 
            companyName: title, 
            location: location, 
            interests: interests, 
            role: 3, 
            sortBy: 'isApproved', 
            sortDirection: -1,
            isWeLove: true
        });

        this.setState({
            skip: skip + limit
        });

        document.addEventListener('wheel', this.scrolling, false);
		document.addEventListener('touchstart', this.scrolling, false);
    }

    componentWillUnmount() {
        this._mounted = false;

        this.props.clearUserList();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.title !== this.props.title || 
            nextProps.location !== this.props.location ||
            nextProps.interests !== this.props.interests) {
            
            let { limit } = this.state;

            let newSkip = 0;
            this.props.getUserList({
                newSkip, limit, 
                companyName: nextProps.title, 
                location: nextProps.location, 
                interests: nextProps.interests,
                role: 3, 
                sortBy: 'isApproved', 
                sortDirection: -1,
                type: 'all',
                isWeLove: true
            });
    
            this.setState({
                skip: limit
            });
        }
    }

    currentPos = window.scrollY;
	scrolling = () => {
        let { skip, limit } = this.state;
        const { userList, title, location, interests } = this.props;

		if (document.body.clientHeight - 500 < window.scrollY + window.innerHeight && skip <= userList.length) {
            if (this._mounted) {
                this.props.getUserList({
                    skip: skip,
                    limit: limit, 
                    companyName: title, 
                    location: location, 
                    interests: interests, 
                    role: 3, 
                    sortBy: 'isApproved', 
                    sortDirection: -1,
                    isWeLove: true
                });
    
                this.setState({
                    skip: skip + limit
                });
            }
        }

		this.currentPos = window.scrollY;
	}

    render() {
        const { userList, onCharityClick } = this.props;

        return (
            <section className="nonprofitListSection">
                <div className="nonprofitList">
                    { userList && userList.length > 0 && userList.map((e, i) => (
                        <Fragment key={e._id}>
                            <CharityForm user={e} onUserClick={() => onCharityClick(e._id)} />
                        </Fragment>
                    )) }
                </div>
                { userList && userList.length === 0 &&
                    <Placeholder
                        titleMain={`There are currently no charities found`}
                    />
                }
            </section>
        )
    }

}

const mapStateToProps = state => ({
    userList: state.user.userList
})

const mapDispatchToProps = {
    getUserList,
    clearUserList
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NonprofitsWeLove);