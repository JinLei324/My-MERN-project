import React, { Component } from 'react';

import { FacebookShareButton } from 'react-share';
import NumberFormat from 'react-number-format';

import Card from '../../../common/Card';
import Button from '../../../common/Button';
import UserAvatar from '../../../common/userComponents/userAvatar';

import Money from './Money';

class DonationProjectDetailCard extends Component {

    render() {
        const { 
            project, 
            isMy, 
            gotToEditProject, 
            turnOnOffProject,
            cancelProject,
            isEnd,
            isCancel,
            isDonation
        } = this.props;
        
        const url = process.env.REACT_APP_BACKEND_URL + `/project-preview/` + project._id;

        return (
            <section className="donationProjectDetailCardSection">
                <Card className="donationProjectDetailCard">
                    <div className="titleBody">
                        <img src="/images/ui-icon/profile/donate-icon.svg" alt="donate-icon" />
                        <p>Make a donation</p>
                    </div>
                    <div className="donationStatusBody">
                        <Money project={project} isMy={isMy} isEnd={isEnd} isCancel={isCancel} />
                    </div>
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
                        { isDonation && isMy &&
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
                            </div>
                        }
				    </div>
                    <div className="donatesListBody">
                        { project.money && project.money.donate_list && project.money.donate_list.length > 0 && project.money.donate_list.map((e, i) => 
                            <div className="eachDonate" key={e._id}>
                                <div>
                                    <UserAvatar
                                        imgUser={e.avatar}
                                        imgUserType={0}
                                        userId={e._id}
                                        size={40}
                                    />
                                    <p className="name">{e.firstName}&nbsp;{e.lastName}</p>
                                </div>
                                <p className="amount">
                                    <NumberFormat value={e.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                </p>
                            </div>
                        )}
                        <div className="seeAllBtnBody">
                            <div className="seeAllBtn">
                                <p>See All</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        )
    }

}

export default DonationProjectDetailCard