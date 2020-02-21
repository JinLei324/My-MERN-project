import React, { Component } from 'react';

import NumberFormat from 'react-number-format';

import { VOLUNTEER, DONATION, PICKUP } from '../../../../helpers/projectTypes';

class ProjectActivityWrapperSimple extends Component {

	render() {
		const { money, donate_summary, projectType } = this.props;
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
					<div className="captionFlexBody">
						{ projectType === VOLUNTEER && <p>Volunteers</p> }
						{ projectType === DONATION && <p>Donation</p> }
						{ projectType === PICKUP && <p>Pickups</p> }
						<p>goal</p>
					</div>
					<div className="valueFlexBody">
						{ projectType === DONATION &&
							<div>
								<p><NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
								<p className="total"><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
							</div>
						}
						{ projectType !== DONATION &&
							<div>
								<p><NumberFormat value={current} displayType={'text'} thousandSeparator={true} prefix={''} /></p>
								<p className="total"><NumberFormat value={total} displayType={'text'} thousandSeparator={true} prefix={''} /></p>
							</div>
						}
					</div>

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
				</div>
			</section>
		)
	}
}

export default ProjectActivityWrapperSimple