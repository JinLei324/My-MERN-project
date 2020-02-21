import React, { Component } from 'react';
import { connect } from 'react-redux';

import { history } from '../../../../../store';
import { getCommunityList } from '../../../../../actions/user';
import { getProjectList } from '../../../../../actions/project';

import LovedProject from './LovedProject';

class Discovers extends Component {

	constructor(props) {
		super(props);

		this.onClickProject = this.onClickProject.bind(this);
		this.onClickDiscoverMore = this.onClickDiscoverMore.bind(this);
	}
	
	componentDidMount() {
		this.props.getProjectList({
            skip: 0,
            limit: 999999
        });
	}

	onClickProject = project => e => {
        e.stopPropagation();
		
        let userId = project.userId ? project.userId : "";
        let projectId = project.projectId ? project.projectId : "";

        history.push(`/${userId}/project/${projectId}`)
	}
	
	onClickDiscoverMore = e => {
		e.stopPropagation();
		history.push('/discovery')
	}

	render() {
		const { projectList } = this.props;
		let showProjectList = projectList.slice(0, projectList.length > 4 ? 4 : projectList.length);
		
		return (
			<div className='discovers section'>
				<p className='title'>Discover & Engage</p>
				<p className='sub-title'>OneGivv connects people who want to do good.</p>
				<div className='main'>
					<div>
						<p className="caption">Projects We Love</p>
						<ul>
							{ showProjectList && showProjectList.length > 0 && showProjectList.map((e, i) => (
								<li key={e._id}>
									<LovedProject {...e} onClickProject={this.onClickProject}  />
								</li>
							))}
						</ul>
						<p className="more" onClick={this.onClickDiscoverMore}>Discover More</p>
					</div>
					<div>
						<p className="caption">Nonprofits We Love</p>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
    authUser: state.authentication.user,
    isAuth: state.authentication.isAuth,
    projectList: state.project.projects,
    communityList: state.user.communityList
})

const mapDispatchToProps = {
    getProjectList,
    getCommunityList
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Discovers)