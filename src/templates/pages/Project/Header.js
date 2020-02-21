import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';

import { FacebookShareButton } from 'react-share';

import ProjectPreview from '../../common/ProjectPreview';
import UserAvatar from '../../common/userComponents/userAvatar';
import Label from '../../common/Label';
import Button from '../../common/Button';

import Money from './Money';

const Header = ({
	project,
	isMy,
	gotToEditProject,
	turnOnOffProject,
	cancelProject,
	isDonation,
	isEnd,
	isCancel,
	immediateDonation
}) => {
	let total = 0, dRestUsers = 0, mRestUsers = 0, dParticipants, mParticipants;
	
	if (project && project.participants) {
		total = project.participants.length;
		dParticipants = project.participants.slice(0, 5);
		if (total >= 5) {
			dRestUsers = total - 5;
		}

		mParticipants = project.participants.slice(0, 2);
		if (total >= 2) {
			mRestUsers = total - 2;
		}
	}

	const url = process.env.REACT_APP_BACKEND_URL + `/project-preview/` + project._id;

	return (
		<div className="projectHeader">
			<ProjectPreview
				previewUrl={project.cover}
				previewThumbUrl={project.coverThumb}
				type={project.projectType}
				titleOnImage={true}
				title={project.title}
				isDetailPage={true}
			/>
			<div className="separator-15" />

			<div className="flex-wrapper">
				<NavLink to={`/${project.user._id}`}>
					<div className="flex-wrapper user-avatar">
						<UserAvatar
							imgUser={project.user.avatar}
							imgUserType={project.user.role}
							userId={project.user._id}
						/>
						<Label
							name={project.user.companyName}
							location={project.user.billingAddress}
							date={moment.unix(project.createdAt)}
							isApproved={project.user.isApproved}
							role={project.user.role}
						/>
					</div>
				</NavLink>

				{ project.participants && project.participants.length > 0 && 
					<ul className="request-users hide-mobile">
						{ dParticipants.map((u, i) => {
							return (
								<li key={i}>
									<UserAvatar
										imgUser={u.avatar}
										userId={u._id}
									/>
								</li>
							)
						}) }
						{ dRestUsers > 0 && <li className="rest-users">
							+{dRestUsers}
						</li> }
					</ul>
				}

				{ project.participants && project.participants.length > 0 && 
					<ul className="request-users show-mobile">
						{ mParticipants.map((u, i) => {
							return (
								<li key={i}>
									<UserAvatar
										imgUser={u.avatar}
										userId={u._id}
									/>
								</li>
							)
						}) }
						{ mRestUsers > 0 &&
							<li className="rest-users">
								+{mRestUsers}
							</li>
						}
					</ul>
				}
			</div>
			<div className="separator-15" />

			{ isDonation &&
				<div className="donationStatusBody">
					<Money project={project} isMy={isMy} isEnd={isEnd} isCancel={isCancel} immediateDonation={immediateDonation} />
				</div>
			}

			{ isDonation &&
				<div className="facebookFlexWrapper">
					<div className="facebook-btn">
						<FacebookShareButton
							className="button is-outlined is-rounded facebook"
							url={url}
							quote={project.title}>
							<div className="facebookIconWrapper">
								<p>Share</p>
							</div>
						</FacebookShareButton>
					</div>
					{ isMy && (
						<div className="control-project" style={{ marginTop: 15 }}>
							<Button
								label={project.isTurnedOff ? 'Turn On' : 'Turn Off'}
								inverse
								onClick={e => {
									e.stopPropagation()
									turnOnOffProject(project.isTurnedOff)
								}}
								disabled={false}
								padding="5px 5px"
								className="turnOffBtn"
							/>
							<Button
								label={project.isCancel ? 'Recover' : 'Cancel'}
								inverse
								onClick={e => {
									e.stopPropagation()
									cancelProject(project.isCancel)
								}}
								disabled={false}
								padding="5px 5px"
								className="cancelBtn"
							/>
							<Button
								label="Edit"
								inverse
								onClick={e => {
									e.stopPropagation()
									gotToEditProject()
								}}
								disabled={project.isTurnedOff || project.isCancel}
								padding="5px 5px"
								className="editBtn"
							/>
							{/* <Button
								className="controll-button"
								label="Add Post"
								solid
								padding="8px 10px"
							/> */}
						</div>
					)}
				</div>
			}

			{ !isDonation &&
				<div className="facebookFlexWrapper">
					{ isMy && (
						<div className="control-project">
							<Button
								label={project.isTurnedOff ? 'Turn On' : 'Turn Off'}
								inverse
								onClick={e => {
									e.stopPropagation()
									turnOnOffProject(project.isTurnedOff)
								}}
								disabled={false}
								padding="5px 5px"
								className="turnOffBtn"
							/>
							<Button
								label={project.isCancel ? 'Recover' : 'Cancel'}
								inverse
								onClick={e => {
									e.stopPropagation()
									cancelProject(project.isCancel)
								}}
								disabled={false}
								padding="5px 5px"
								className="cancelBtn"
							/>
							<Button
								label="Edit"
								inverse
								onClick={e => {
									e.stopPropagation()
									gotToEditProject()
								}}
								disabled={project.isTurnedOff || project.isCancel}
								padding="5px 5px"
								className="editBtn"
							/>
							{/* <Button
								className="controll-button"
								label="Add Post"
								solid
								padding="8px 10px"
							/> */}
						</div>
					)}

					<div className="facebook-btn">
						<FacebookShareButton
							className="button is-outlined is-rounded facebook"
							url={url}
							quote={project.title}>
							<div className="facebookIconWrapper">
								<p>Share</p>
								{/* <img src="/images/ui-icon/social/share.svg" className="facebookShareIcon" alt="facebookShare" /> */}
							</div>
						</FacebookShareButton>
					</div>
				</div>
			}

			<div className="interests-wrapper">
				{project.interests && project.interests.map((e, i) => {
					return (
						<Fragment key={i}>
							<span className="interest">
								{e.title}
							</span>
						</Fragment>
					)
				})}
			</div>
			<div className="separator-15" />
			<div className="main-font description" dangerouslySetInnerHTML={{ __html: project.description }}></div>
		</div>
	)
}

export default Header
