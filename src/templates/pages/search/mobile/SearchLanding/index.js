import React, { Component } from 'react';
import { connect } from 'react-redux';

import PeopleYouKnow from './PeopleYouKnow';
import ProjectsWeLove from './ProjectsWeLove';
import OurCommunity from './OurCommunity';

import { history } from '../../../../../store'

import { getUserList, getCommunityList } from '../../../../../actions/user';
import { getUserFollowers } from '../../../../../actions/followsAction';
import { getProjectByParams } from '../../../../../actions/project';

class SearchLanding extends Component {
    
    state = {
        userListSkip: 0,
        userListLimit: 100,
        projectListSkip: 0,
        projectListLimit: 100
    }

    componentDidMount() {
        let { userListSkip, userListLimit, projectListSkip, projectListLimit } = this.state;
        const { isAuth, authUser } = this.props;

        if (isAuth) {
            this.props.getUserList({
                skip: userListSkip,
                limit: userListLimit,
                // role: 3,
                sortBy: 'isApproved',
                sortDirection: -1,
                type: 'all'
            });
            // this.props.getUserFollowers(authUser._id, {
            //     skip: 0
            // });
        } else {
            this.props.getUserList({
                skip: userListSkip,
                limit: userListLimit,
                // role: 3,
                sortBy: 'isApproved',
                sortDirection: -1,
                type: 'all'
            });
        }

        let params = {
			skip: projectListSkip,
            limit: projectListLimit,
            isWeLove: true
        };
        
        this.props.getProjectByParams(params);

        let interests = [];
        if (isAuth) {
            interests = [...authUser.interests];
        }

        this.props.getCommunityList({
            interests: interests
        });
    }

    componentWillUnmount() {
    }

    onSelectProject = project => {
        let userId = project.user ? project.user._id : "";
        let projectId = project._id;

        history.push(`/${userId}/project/${projectId}`)
    }
    
    render() {
        const { userList, projectList, followList, communityList } = this.props;
        
        return (
            <section className="searchLanding mobile">
                <div className="upper">
                    <PeopleYouKnow userList={userList} followList={followList} />
                    <ProjectsWeLove projectList={projectList} onSelectProject={this.onSelectProject} />
                    <OurCommunity communityList={communityList} />
                </div>
            </section>
        )
    }
}

const mapStateToProps = state => ({
    authUser: state.authentication.user,
    isAuth: state.authentication.isAuth,
    userList: state.user.userList,
    followList: state.follows.followers,
    projectList: state.project.projects,
    communityList: state.user.communityList
})

const mapDispatchToProps = {
    getUserList,
    getProjectByParams,
    getUserFollowers,
    getCommunityList
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchLanding)