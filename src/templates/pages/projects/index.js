import React, { Component } from 'react'
import ProjectListPage from '../ProjectListPage'

class Projects extends Component {

	componentDidMount() {
		// document.querySelector('html').scrollTop = 0;
	}
	
	render() {
		return (
			<div className="ProjectPage">
				<ProjectListPage match={{ params: this.props.match.params }} location={this.props.location}/>
			</div>
		)
	}
}

export default Projects
