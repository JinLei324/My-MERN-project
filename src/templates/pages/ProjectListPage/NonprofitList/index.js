import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { getUserList, clearUserList } from '../../../../actions/user';
import Placeholder from '../../../common/noContentPlaceholder';

import CharityForm from '../CharityForm';

class NonprofitList extends Component {

    state = {
        skip: 0,
        limit: 5
    }

    componentDidMount() {
        this._mounted = true;

        let { skip, limit } = this.state;
        const { title, location, interests } = this.props;
        
        let selectedInterests = [];
        if (interests && interests.length > 0) {
            if (interests[0].value) {
                selectedInterests = interests.map(e => e.value);
            } else {
                selectedInterests = interests.map(e => e);
            }
        }

        this.props.getUserList({
            skip, limit, 
            companyName: title, 
            location: location, 
            interests: selectedInterests, 
            role: 3, 
            sortBy: 'isApproved', 
            sortDirection: -1
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
            
            let selectedInterests = [];
            if (nextProps.interests && nextProps.interests.length > 0) {
                if (nextProps.interests[0].value) {
                    selectedInterests = nextProps.interests.map(e => e.value);
                } else {
                    selectedInterests = nextProps.interests.map(e => e);
                }
            }
            
            let { limit } = this.state;

            let newSkip = 0;
            this.props.getUserList({
                newSkip, limit, 
                companyName: nextProps.title, 
                location: nextProps.location, 
                interests: selectedInterests,
                role: 3, 
                sortBy: 'isApproved', 
                sortDirection: -1,
                type: 'all'
            });
    
            this.setState({
                skip: limit
            });
        }
    }

    currentPos = window.scrollY;
	scrolling = () => {
        let { skip, limit } = this.state;
        const { userList, title, location, interests, activeType } = this.props;

        if (activeType >= 0 || activeType === -2 || activeType === -4)
            return;

        let selectedInterests = [];
        if (interests && interests.length > 0) {
            if (interests[0].value) {
                selectedInterests = interests.map(e => e.value);
            } else {
                selectedInterests = interests.map(e => e);
            }
        }

        if (document.body.clientHeight - 500 < window.scrollY + window.innerHeight && skip <= userList.length) {
            if (this._mounted) {
                this.props.getUserList({
                    skip, limit, companyName: title, location: location, interests: selectedInterests, role: 3, sortBy: 'isApproved', sortDirection: -1
                });
    
                this.setState({
                    skip: skip + limit
                });
            }
        }

		this.currentPos = window.scrollY;
	}

    render() {
        const { userList, onCharityClick, activeType } = this.props;

        if (activeType === -2) {
            return (null);
        }
        
        return (
            <section className="nonprofitListSection">
                <div className="nonprofitList">
                    { userList && userList.length > 0 && userList.map((e, i) => (
                        <Fragment key={e._id}>
                            <CharityForm user={e} onUserClick={(event) => onCharityClick(e._id, event)} />
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
)(NonprofitList);