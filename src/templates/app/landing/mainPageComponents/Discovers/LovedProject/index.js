import React, { Component } from 'react';

import NumberFormat from 'react-number-format';

import { PICKUP, DONATION, VOLUNTEER } from '../../../../../../helpers/projectTypes';

class LovedProject extends Component {

    selectType = type => {
		switch (type) {
			case 0:
				return 'volunteer.svg'
			case 1:
				return 'money.svg'
			case 2:
				return 'pink-up.svg'
			default:
				return ''
        }
    }

    render() {
        const { _id, title, description, coverThumb, projectType, money, onClickProject, user } = this.props;
        
        if (!money) {
            return (null);
        }
        
        return (
            <section className="projectMiniCard">
                <div className="cardBody">
                    <div className="cardHeader">
                    </div>
                    <div className="coverImg" onClick={onClickProject({ userId: user && user._id, projectId: _id })}>
                        { coverThumb && <img src={coverThumb} className="preview" alt="" /> }
                        { !coverThumb && <img src="/images/temp_project.jpg" className="preview" alt="" /> }
                        <div className={`typeProject type-${projectType}`}>
                            <img
                                className="type"
                                src={`/images/ui-icon/${this.selectType(projectType)}`}
                                alt="type"
                            />
                        </div>
                    </div>
                    <div className="cardContent">
                        <p className="title">{title}</p>
                        <p className="description">{description}</p>
                        <div className="activityWrapper">
                            <div className="clickedPart">
                                <div className="flexWrapper">
                                    <div className="progressBar">
                                        <div className="progressWrapper">
                                            <div className="values">
                                                <span className="current">
                                                    { (projectType === DONATION || projectType === PICKUP) ? 
                                                        <NumberFormat value={money.current} displayType={'text'} thousandSeparator={true} prefix={'$'} /> :
                                                        <NumberFormat value={money.current} displayType={'text'} thousandSeparator={true} prefix={''} />
                                                    }
                                                </span>
                                                <span className="of text-right">
                                                    { (projectType === DONATION || projectType === PICKUP) ? 
                                                        <NumberFormat value={money.total} displayType={'text'} thousandSeparator={true} prefix={'$'} /> :
                                                        <NumberFormat value={money.total} displayType={'text'} thousandSeparator={true} prefix={''} />
                                                    }
                                                </span>
                                            </div>
                                            <div className="label">
                                                <span className="current">
                                                    { projectType === PICKUP && 'Pickups' }
                                                    { projectType === DONATION && 'Donations' }
                                                    { projectType === VOLUNTEER && 'Volunteers' }
                                                </span>
                                                <span className="of text-right">Goal</span>
                                            </div>
                                            <div className="progress">
                                                <div
                                                    className="progressContain"
                                                    style = {{
                                                        width: `${
                                                            (money.current / money.total) * 100 > 100
                                                                ? 100
                                                                : (money.current / money.total) * 100
                                                        }%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

}

export default LovedProject;