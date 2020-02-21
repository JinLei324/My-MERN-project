import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';

import {
	getProjectByParams,
	getProjectSubscription,
	clearProjectsList
} from '../../../../../actions/project';
import { getUserList, clearUserList } from '../../../../../actions/user';

import { DONOR } from '../../../../../helpers/userRoles';

import ProjectCard from '../../../../common/ProjectCard';

import CharityForm from '../../../../pages/ProjectListPage/CharityForm';

class ProjectsPeopleComponent extends Component {

    state = {
        projectsSkip: 0,
        projectsLimit: 10,
        usersSkip: 0,
        usersLimit: 10,
        shouldClear: true,
        projects: [],
        userList: []
    }

    componentDidMount() {
        this._mounted = true;

        this.getData();
    }

    componentWillUnmount() {
        this._mounted = false;
	}

    componentWillReceiveProps(nextProps) {
        if (nextProps.projects.length !== this.state.projects.length && nextProps.projects.length > 0) {
            this.setState({
                projects: nextProps.projects
            }, () => {
                setTimeout(() => {
                    window.renderProjectScroll();
                }, 1000);
            });
        }
        
        if (nextProps.userList.length !== this.state.userList.length && nextProps.userList.length > 0) {
            this.setState({
                userList: nextProps.userList
            }, () => {
                setTimeout(() => {
                    window.renderNonprofitScroll();
                }, 1000);
            });
        }
    }
    
    getData() {
        let { projectsSkip, projectsLimit, usersSkip, usersLimit } = this.state;

        let params = {
			skip: projectsSkip,
            limit: projectsLimit,
            isWeLove: true
        };
        
        this.props.getProjectByParams(params);

        params = {
            skip: usersSkip,
            limit: usersLimit,
            role: 3,
            isWeLove: true
        }

        this.props.getUserList(params);
    }

    readMore = (id, projectId) => () => {
		this.setState({shouldClear: false}, () => {
            document.querySelector('html').scrollTop = 0;
			this.props.push(`/${id}/project/${projectId}`);
		})
    }
    
    onCharityClick = id => () => {
		this.setState({shouldClear: false}, () => {
            document.querySelector('html').scrollTop = 0;
            if (id === "")
                return;

			this.props.push(`/${id}`);
		})
    }
    
    render() {
        const { projects, userList, authUser } = this.props;

        let user = {}
        if (!authUser) {
            user = {
                role: DONOR
            };
        } else {
            user = authUser;
        }
        
        return (
            <section className="projectsPeopleComponent">
                <div className="b-indent b-scroll">
                    <div className="cn">
                        <div className="b-indent-left">
                            <div className="t-group">
                                <div className="t-group">
                                    <h2>Discover, <span>create and engage</span></h2>
                                    <h3 style={{ color: `#000000` }}>OneGivv connects people who want to do good.</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cn-fl">

                        <div className="b-scroll-wrap">
                            <h3 className="b-scroll__title">Projects We love</h3>
                            <div className="scrollbar project-scrollbar">
                                <div className="handle">
                                    <div className="mousearea"></div>
                                </div>
                            </div>

                            <div className="b-scroll-items project-scroll frame">
                                <ul className="clearfix">
                                    { projects && projects.length > 0 && projects.map((e, i) => (
                                        <li className="b-scroll__item" key={e._id}>
                                            <ProjectCard
                                                {...e}
                                                user={e && e.user}
                                                authUser={user}
                                                readMore = {this.readMore((e && e.user) ? e.user._id : "", (e) ? e._id : "")}
                                            />
                                        </li>
                                    )) }
                                </ul>
                                <div className="btn-group">
                                    <NavLink to={`/discovery`} className="link" onClick={e => e.stopPropagation()}>
                                        Discover more
                                    </NavLink>
                                </div>
                            </div>
                            <div className="controls center">
                                <button className="next project-scroll-next"><i className="icon-lg-arrow-right"></i></button>
                            </div>
                        </div>

                        <div className="b-scroll-wrap">
                            <h3 className="b-scroll__title">Nonprofits We Love</h3>
                            <div className="scrollbar nonprofit-scrollbar">
                                <div className="handle">
                                    <div className="mousearea"></div>
                                </div>
                            </div>
                            <div className="b-scroll-items nonprofit-scroll frame">
                                <ul className="clearfix">
                                    { userList && userList.length > 0 && userList.map((e, i) => (
                                        <li className="b-scroll__item" key={e._id}>
                                            <CharityForm 
                                                user={e} 
                                                onUserClick={() => this.onCharityClick(e ? e._id : "")}
                                            />
                                        </li>
                                    ))}
                                </ul>
                                <div className="btn-group">
                                    <NavLink to={`/discovery`} className="link" onClick={e => e.stopPropagation()}>
                                        Discover more
                                    </NavLink>
                                </div>
                            </div>
                            <div className="controls center">
                                <button className="next nonprofit-scroll-next"><i className="icon-lg-arrow-right"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => ({
    projects: state.project.projects,
    userList: state.user.userList,
    authUser: state.authentication.user,
})

const mapDispatchToProps = {
	getProjectByParams,
	getProjectSubscription,
    clearProjectsList,
    getUserList,
    clearUserList,
    push
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProjectsPeopleComponent)