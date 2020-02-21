import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { NavLink } from 'react-router-dom';

import { history } from '../../../store';

import PostList from '../Post/PostList';
import PostForm from '../Post/PostForm';

import { getProjectByParams } from '../../../actions/project';
import ProjectCardSimple from './ProjectCardSimple';

class NewsFeed extends Component {

	state = {
		skip: 0,
        limit: 5
	}

	componentDidMount() {
		// const { isAuth, user } = this.props;
		// if (isAuth) {
		// 	window.Intercom('boot', {
		// 		app_id: 'q4hnc1xx',
		// 		email: user.email,
		// 		user_id: user._id,
		// 		created_at: 1234567890
		// 	});
		// } else {
		// 	window.Intercom('boot', {
		// 		app_id: 'q4hnc1xx'
		// 	});
		// }

		let { skip, limit } = this.state;

		let params = {
			skip: skip,
            limit: limit,
            isWeLove: true
		};
		
		this.props.getProjectByParams(params);
	}

	onSelectProject = project => {
        let userId = project.user ? project.user._id : "";
        let projectId = project._id;

        history.push(`/${userId}/project/${projectId}`)
	}
	
	readMore = (id, projectId) => () => {
		this.setState({shouldClear: false}, () => {
            document.querySelector('html').scrollTop = 0;
			this.props.push(`/${id}/project/${projectId}`);
		})
    }

	render() {
		const { projects, user } = this.props;
		
		return (
			<section className="NewsFeedPage">
				<div className="news-list">
					<PostForm match={{ params: {} }} />
					<PostList match={{ params: {} }} />
				</div>
				<div className="news-right">
					<div className="right-sidebar">
						<div className="projectsWeLoveBody">
							<p className="title">Projects we love</p>
							{ projects && projects.length > 0 &&
								<ProjectCardSimple
									{...projects[0]}
									user={projects[0] && projects[0].user}
									isMy={false}
									authUser={user}
									readMore={this.readMore((projects[0] && projects[0].user) ? projects[0].user._id : "", (projects[0]) ? projects[0]._id : "")}
								/>
							}
							{ projects && projects.length > 1 &&
								<ProjectCardSimple
									{...projects[1]}
									user={projects[1] && projects[1].user}
									isMy={false}
									authUser={user}
									readMore={this.readMore((projects[1] && projects[1].user) ? projects[1].user._id : "", (projects[1]) ? projects[1]._id : "")}
								/>
							}
							<div className="discoverMore">
								<NavLink to={`/discovery`}>
									Discover more
								</NavLink>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}

}

const mapStateToProps = state => ({
	user: state.authentication.user,
	isAuth: state.authentication.isAuth,
	projects: state.project.projects
})

const mapDispatchToProps = {
	getProjectByParams,
	push
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NewsFeed)