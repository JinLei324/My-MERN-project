import React, { Component } from 'react';

import NumberFormat from 'react-number-format';

import Button from '../Button';
import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes';

class ProjectActivityWrapper extends Component {

	render() {
		const { money, donate_summary, projectType, readMore } = this.props;
		let proc = 0, total = 0, current = 0;
		
		if (projectType === DONATION && money && money.total && money.current) {
			total = '$' + money.total;
			current = '$' + money.current;
			proc = (money.current / money.total) * 100;
		} else {
			if (donate_summary) {
				if (donate_summary.total) total = donate_summary.total;
				if (donate_summary.total_applicants) current = donate_summary.total_applicants;
				proc = (current / total) * 100;
			}
		}

		return (
			<section className='project-activity-wrapper'>
				<div className={`activity-wrapper ${proc >= 100 ? 'full' : ''}`}>
					<div className="flex-wrapper">
						<div className="progressBar">
							<div className="progress-wrapper">
								<div className="progress">
									<div className="progress-contain"
										style={{
											width: `${
												proc > 100
													? 100
													: proc
											}%`
										}}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='summary'>
						<div className='col-5'>
							{ projectType === VOLUNTEER && ( <div className='total'>
								<p>VOLUNTEERS NEEDED</p>
								<p><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={''} /></p>
							</div> ) }
							{ projectType === DONATION && ( <div className='total'>
								<p>DONATION GOAL</p>
								<p><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
							</div> ) }
							{ projectType === PICKUP && ( <div className='total'>
								<p>ITEM GOAL</p>
								<p><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={''} /></p>
							</div> ) }
						</div>
						<div className='col-3'>
							{ projectType === VOLUNTEER && ( <div className='current'>
								<p>ATTENDING</p>
								<p><NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={''} /></p>
							</div> ) }
							{ projectType === DONATION && ( <div className='current'>
								<p>RECEIVED</p>
								<p><NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
							</div> ) }
							{ projectType === PICKUP && ( <div className='current'>
								<p>RECEIVED</p>
								<p><NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={''} /></p>
							</div> ) }
						</div>
						<div className='col-4'>
							<div className="more">
								{ projectType === VOLUNTEER &&
									<Button
										solid
										label = "Volunteer"
										onClick = { readMore } 
									/>
								}
								{ projectType === DONATION &&
									<Button
										solid
										label = "Donate"
										onClick = {readMore}
									/>
								}
								{ projectType === PICKUP &&
									<Button
										solid
										label = "Request PickUp"
										onClick = {readMore}
									/>
								}
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

export default ProjectActivityWrapper