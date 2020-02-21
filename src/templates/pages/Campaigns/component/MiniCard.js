import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Switch from "react-switch"
import Button from '../../../common/Button'
import { VOLUNTEER } from '../../../../helpers/projectTypes';

class MiniCard extends Component {

	state = {
	}

	componentDidMount() {
	}

	changeView = e => {}

	render() {
		const {
			userId,
			projectId,
			cover,
			title,
			description,
			onDetailView,
			onUpdateModal,
			onSelectProject,
			isSelected,
			isTemplateProject,
			isEnd,
			isCancel,
			activeType
		} = this.props;
		
		return (
			<div className={`ProjectMiniCard ${isSelected && 'active'}`}>
				<div className="CardBody">
					<div className="CardHeader">
						<label htmlFor="switch-view">
							<Switch
								id="switch-view"
								onChange={this.changeView}
								checked={false}
								offColor="#1AAAFF"
								checkedIcon={
									<div
										style={{
											display: "flex",
											alignItems: "center",
											height: "100%",
											fontFamily: "Roboto",
											fontSize: 14,
											color: "white",
											marginLeft: 5,
											paddingRight: 2
										}}
									>
										Off
									</div>
								}
								uncheckedIcon={
									<div
										style={{
											display: "flex",
											alignItems: "center",
											height: "100%",
											fontFamily: "Roboto",
											fontSize: 14,
											color: "white",
											marginLeft: 5,
											paddingRight: 2
										}}
									>
										Live
									</div>
								}
								width={70}
							/>
						</label>
						<div className="bullets"><img src="/images/ui-icon/bullets.svg" alt="" /></div>
					</div>
					<div className="CoverImg" onClick={() => {
						if (!isTemplateProject)
							onSelectProject(projectId)
						}}>
						<img src={cover} className="preview" alt="" />
					</div>
					<div className="CardContent">
						{ !isEnd && !isCancel && (
							<div>
								<h4 className="title" onClick={() => {
									if (!isTemplateProject)
										onSelectProject(projectId)
								}}>{ title }</h4>
								<p className="description">{ description }</p>
								<p className='description bottom'></p>
							</div>
						) }
						{ isEnd && (
							<div>
								<h4 className='completed-title'>Completed</h4>
								<p className='description'><b>Project:</b>&nbsp;{ title }</p>
								<p className='description bottom'>Raised: </p>
							</div>
						) }
						{ isCancel && (
							<div>
								<h4 className='canceled-title'>Canceled</h4>
								<p className='description'><b>Project:</b>&nbsp;{ title }</p>
								<p className='description bottom'>Raised: </p>
							</div>
						) }
						<div className="ActionButtons">
							{/* { activeType !== VOLUNTEER && isEnd && (
								<Button solid className="btn-view" label="Withdraw" onClick={onClickWithdraw} padding="6px 18px" />
							) } */}
							{ activeType !== VOLUNTEER && isEnd && (
								<Button label="Update" onClick={onUpdateModal({projectId, title})} />
							) }
							{ isCancel && (
								<NavLink
									to={`/${userId}/project/edit/${projectId}`}>
									<Button label="Edit" disabled={true} />
								</NavLink>
							) }
							{ !isEnd && !isCancel && (
								<NavLink
									to={`/${userId}/project/edit/${projectId}`}>
									<Button label="Edit" disabled={isTemplateProject} />
								</NavLink>
							)}
							<Button label="View" className="btn-view" onClick={onDetailView({projectId, title})} disabled={isTemplateProject} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default MiniCard