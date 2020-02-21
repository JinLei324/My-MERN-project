import React, { Component } from 'react';

import Card from '../../../common/Card';

import ProjectPreview from '../../../common/ProjectPreview';
import ProjectActivityWrapperSimple from '../ProjectActivityWrapperSimple';

class ProjectCard extends Component {

	state = {
		showSummary: false
	}

	componentDidMount() {
		if (this.props._id) {
			// if (this.props.isUserProjectsPage && this.props.isMy) {
			if (this.props.isUserProjectsPage) {
				this.setState({ showSummary: true });
			}
		}
	}

	openSummaryView = (e) => {
		if (e)
			e.preventDefault();
	}

	closeSummaryView = () => {
	}

	render() {
		const {
			full,
			description,
			user,
			cover,
			coverThumb,
			title,
			projectType,
			readMore,
			donate_summary,
			money,
			authUser
		} = this.props;
		
		if (!user || !authUser) {
			return (null);
		}

		return (
			<Card className={`projectCardSimple ${full && 'full'}`} onClick={readMore}>
				<ProjectPreview
					previewUrl={cover}
					previewThumbUrl={coverThumb}
					type={100}
					title=""
					titleOnImage={true}
					openSummary={this.openSummaryView}
					isDetailPage={false} />

				<div className="description">
					<p className="title">{title}</p>
					<p className="text">{description}</p>
				</div>
				<ProjectActivityWrapperSimple money={money} donate_summary={donate_summary} projectType={projectType} />
			</Card>
		)
	}
}

export default ProjectCard