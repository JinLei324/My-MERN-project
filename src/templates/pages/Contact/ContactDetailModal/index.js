import React, { Component } from 'react';
import { connect } from 'react-redux';

import moment from 'moment';

import Modal from '../../../common/Modal';
import UserAvatar from '../../../common/userComponents/userAvatar';
import IconButton from '../../../common/IconButton';

class ContactDetailModal extends Component {

	render() {
        const { contactDetail, contactDetailInfo, showContactDetailModal, closeContactDetailModal } = this.props;

        if (!contactDetail || !contactDetailInfo) {
            return (null);
        }

		return (
            <div className="contactDetailModal">
                <Modal title="" showModal={showContactDetailModal} closeModal={() => { closeContactDetailModal(); }}>
                    <div className="content">
                        <div className="left-content">
                            <div className="main-info">
                                <div className="left-wrap">
                                    <div className="info-wrapper">
                                        {contactDetailInfo.contact && <UserAvatar
                                            imgUserType={contactDetailInfo.contact.role}
                                            imgUser={contactDetailInfo.contact.avatar}
                                            userId={contactDetailInfo.contact._id}
                                        />}
                                        {!contactDetailInfo.contact && <div className="empty-avatar" />}
                                        <section className="label">
                                            <div className="label-name">
                                                {contactDetailInfo.fullName}
                                            </div>
                                            <div className="label-contact">
                                                Contact
                                            </div>
                                        </section>
                                    </div>
                                    <div className="social-buttons">
                                        <img className="social-btn" src="/images/ui-icon/social/icon-facebook.svg" alt="facebook" />
                                        <img className="social-btn" src="/images/ui-icon/social/icon-linkedin.svg" alt="linkedin" />
                                        <img className="social-btn" src="/images/ui-icon/social/icon-twitter.svg" alt="twitter" />
                                        <img className="social-btn" src="/images/ui-icon/social/icon-google.svg" alt="google" />
                                    </div>
                                </div>
                                <div className="right-wrap">
                                    <IconButton icon="/images/ui-icon/icon-phone.svg" label={contactDetailInfo.phone} size="22px" />
                                    <IconButton icon="/images/ui-icon/icon-message.svg" label={contactDetailInfo.email} size="22px" />
                                    <IconButton icon="/images/ui-icon/contact/chat_icon.svg" label="Message" size="22px" />
                                </div>
                            </div>
                            <div className="donation-info">
                                <div className="info tot">
                                    <span className="_value">${contactDetail && contactDetail.totalDonation}</span>
                                    <span className="_label">Total Donation</span>
                                </div>
                                <div className="info last">
                                    <span className="_value">${contactDetail && (contactDetail.lastDonation || 0)}</span>
                                    <span className="_label">Last Donation</span>
                                </div>
                                <div className="info volunteer">
                                    <span className="_value">{contactDetail && contactDetail.totalHours} Hours</span>
                                    <span className="_label">Volunteer Hours</span>
                                </div>
                            </div>
                            <div className="detail-info border">
                                <div className="_label">Last Volunteer Record</div>
                                <div className="_value">{contactDetail && contactDetail.lastActivity && contactDetail.lastActivity.createdAt && moment(contactDetail.lastActivity.createdAt).format("MMMM D, YYYY")}</div>
                            </div>
                            <div className="detail-info border">
                                <div className="_label">Membership Start</div>
                                <div className="_value">{contactDetail && moment(contactDetail.memberSince).format("MMMM D, YYYY")}</div>
                            </div>
                            <div className="detail-info border">
                                <div className="_label">Membership End</div>
                                <div className="_value">{contactDetail && contactDetail.memberEnd && moment(contactDetail.memberEnd).format("MMMM D, YYYY")}</div>
                            </div>
                            <div className="detail-info">
                                <div className="_label">Last Contact</div>
                                <div className="_value">{contactDetail && contactDetail.lastContact && moment(contactDetail.lastContact).format("MMMM D, YYYY")}</div>
                            </div>
                        </div>
                        <div className="right-content">
                            {/* <div className="info birthday">
                                <img className="_icon" src="/images/ui-icon/contact/icon-birthday.svg" alt="" />
                                <div className="birthday-right">
                                    <span className="_label">Birthday</span>
                                    <span className="_birthday">{ contactDetailInfo.contact && moment(contactDetailInfo.contact.birthDate).format("DD, MMMM")}</span>
                                </div>
                            </div> */}
                            <IconButton icon="/images/ui-icon/contact/icon-birthday.svg" label={`Birthday   ${contactDetailInfo.contact && moment(contactDetailInfo.contact.birthDate).format("DD, MMMM")}`} size="22px" />
                            <IconButton icon="/images/ui-icon/contact/location_icon.svg" label={contactDetailInfo.address} size="22px" />
                            <div className="activity">
                                <img className="_icon" src="/images/ui-icon/contact/icon-calendar.svg" alt="" />
                                <span className="_label">Activity</span>
                            </div>
                            <div className="activity-year">2018</div>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-icon">
                                        <img src="/images/ui-icon/icon-message.svg" alt="" />
                                    </div>
                                    <div className="timeline-content">
                                        <span className="date">October, 12</span>
                                        <span className="act">Letter to Joe</span>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-icon">
                                        <img src="/images/ui-icon/sidemenu/active_menu_donation.svg" alt="" />
                                    </div>
                                    <div className="timeline-content">
                                        <span className="date">November, 13</span>
                                        <span className="act">Donation to Joe</span>
                                    </div>
                                </div>
                                <div className="timeline-item no-bottom">
                                    <div className="timeline-icon">
                                        <img src="/images/ui-icon/contact/icon-pen.svg" alt="" />
                                    </div>
                                    <div className="timeline-content">
                                        <span className="date">July, 15</span>
                                        <span className="act">Note</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
		)
	}
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ContactDetailModal);