import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { NONPROFIT } from '../../../helpers/userRoles';

import Card from '../Card';
import Label from '../Label';
import ProjectPreview from '../ProjectPreview';
import ProjectSummary from '../ProjectSummary';
import ProjectDateLocation from '../ProjectDateLocation';
import ProjectActivityWrapper from '../ProjectActivityWrapper';
import UserAvatar from '../userComponents/userAvatar';

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
			_id,
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
			needs,
			isCancel,
			isTurnedOff,
			isEnd,
			endDate,
			location,
			authUser
		} = this.props;
		
		let { showSummary } = this.state;

		if (!user || !authUser) {
			return (null);
		}

		return (
			<Card className={`project ${full && 'full'}`} onClick={readMore}>
				{ authUser.role === NONPROFIT && user.role === NONPROFIT && (isEnd || isCancel || isTurnedOff) &&
					<ProjectSummary 
						_id={_id}
						title={title}
						needs={needs}
						donate_summary={donate_summary}
						money={money} 
						projectType={projectType}
						isCancel={isCancel}
						isTurnedOff={isTurnedOff}
						showSummary={showSummary}
						closeSummary={this.closeSummaryView} />
				}

				<section className="project-header">
					<NavLink
						to={`/${user && user._id}`}
						onClick={e => e.stopPropagation()}>
						<div className="info-wrapper">
							<UserAvatar
								imgUserType={user.role}
								imgUser={user.avatar}
								userId={user._id} />
							<Label
								name={user.companyName}
								location={''}
								address={user.address}
								isApproved={user.isApproved}
								role={user.role}
								showType="project" />
						</div>
					</NavLink>
				</section>
				<div className="separator" />
				<ProjectPreview
					previewUrl={cover}
					previewThumbUrl={coverThumb}
					type={projectType}
					title={title}
					titleOnImage={true}
					openSummary={this.openSummaryView}
					isDetailPage={false} />

				<ProjectDateLocation 
					date={endDate}
					location={location}
					type={projectType} />

				<section className="description">
					<p className="text">{description}</p>
				</section>

				<ProjectActivityWrapper money={money} donate_summary={donate_summary} projectType={projectType} />
			</Card>
		)
	}
}

export default ProjectCard