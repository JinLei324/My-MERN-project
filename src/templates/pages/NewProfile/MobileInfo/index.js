import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import StarRatingComponent from 'react-star-rating-component';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import Textarea from 'react-textarea-autosize';

import Card from '../../../common/Card';
import Modal from '../../../common/Modal';
import Button from '../../../common/Button';

import Map from '../UserDetailInfo/Map';
import RatingItem from '../UserDetailInfo/RatingItem';

import {
    submitReview,
    getReviews,
    clearReviews
} from '../../../../actions/user';

class MobileInfo extends Component {

    state = {
        lat: 0,
        lng: 0,
        currentView: 0, // 0 UserInfo, 1: rating view
        newReview: false,
        newRating: 0,
        newFeedback: "",
        currentRating: 0,
        copied: false
    }

    chooseLocationFromMap = event => {		
    }

    componentDidMount() {
        const { user } = this.props;

        if (!user.address) return;

        let address = '';
        if (user.address.address1)
            address = address + user.address.address1;
        if (user.address.address2)
            address = address + ' ' + user.address.address2;
        if (user.address.city)
            address = address + ' ' + user.address.city;
        if (user.address.state)
            address = address + ' ' + user.address.state;
        
        geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
                
                this.setState({
                    lat: lat,
                    lng: lng
                });
            });
            
        this.props.user && this.props.getReviews({userId: this.props.user._id}) && this.setState({ currentRating: this.props.user.rating });
    }

    componentWillUnmount() {
        this.props.clearReviews();
    }

    onClickReview = e => {
        if (!this.props.isAuth)
            return;

        if (this.props.authUser && this.props.user) {
            if (this.props.authUser._id === this.props.user._id)
                return;
        }

        this.setState({ currentView: 1 });
    }

    onClickBack = e => {
        this.setState({ currentView : 0 });
    }

    onClickNew = e => {
        if (!this.props.isAuth)
            return;

        if (this.props.authUser && this.props.user) {
            if (this.props.authUser._id === this.props.user._id)
                return;
        }
        
        this.setState({ newReview: true });
    }

    closeReviewDialog = e => {
        this.setState({ newReview: false });
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({ newRating: nextValue });
    }

    inputHelper = key => e => this.setState({ [key]: e.target.value })

    onClickSubmitReview = e => {
        const { newRating, newFeedback, currentRating } = this.state;

        this.props.submitReview({
            rating: newRating,
            review: newFeedback,
            user: this.props.user._id,
            currentRating: currentRating,
            cb: () => {
                this.setState({ newReview: false, newRating: 0, newFeedback: "", currentRating: this.props.user.rating} );
            }
        })
    }

    render() {
        let { lat, lng, currentView, newReview, newRating, newFeedback, currentRating } = this.state;
        const { user, reviewList } = this.props;

        if (currentView === 0) {
            return (
                <section className="mobileInfoSection">
                    <Card padding="0px" className="mobileInfoCard">
                        <div className="userInfoBody">
                            <div className="ratingBody">
                                <div className="caption">
                                    <p className="title">Rating</p>
                                    <div className="desc">
                                        <img src="/images/ui-icon/profile/eye_icon.svg" alt="eye-icon" />
                                        <p>({reviewList.length} Reviews)</p>
                                    </div>
                                </div>
                                <div className="star">
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={currentRating}
                                        editable={false}
                                        starColor={"#F2C94C"}
                                        emptyStarColor={"#E0E0E0"} 
                                        onStarClick={this.onClickReview}
                                    />
                                </div>
                            </div>
                            <div className="ourMissionBody">
                                <div className="overview">
                                    <p className="title">Our mission</p>
                                    <p className="description">{ user.aboutUs }</p>
                                </div>
                            </div>
                            <div className="financialInfoBody">
                                <div className="titleBody">
                                    <p className="caption">Financials</p>
                                    <p className="value">
                                        Annual Budget:
                                        <span>${user.anualBudget}</span>
                                    </p>
                                </div>
                                <div className="subInfo">
                                    <div className="summary">
                                        <p className="summaryCaption">Program Spend</p>
                                        <p className="percent">{ user.programSpend }%</p>
                                    </div>
                                    <div className="flexWrapper">
                                        <div className="progressBar">
                                            <div className="progressWrapper">
                                                <div className="progress">
                                                    <div className="progressContain"
                                                        style={{
                                                            width: `${
                                                                user.programSpend > 100
                                                                    ? 100
                                                                    : user.programSpend
                                                            }%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="subInfo">
                                    <div className="summary">
                                        <p className="summaryCaption">Fundraising Spend</p>
                                        <p className="percent">{ user.fundrasingSpend }%</p>
                                    </div>
                                    <div className="flexWrapper">
                                        <div className="progressBar">
                                            <div className="progressWrapper">
                                                <div className="progress">
                                                    <div className="progressContain"
                                                        style={{
                                                            width: `${
                                                                user.fundrasingSpend > 100
                                                                    ? 100
                                                                    : user.fundrasingSpend
                                                            }%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="subInfo managementSpend">
                                    <div className="summary">
                                        <p className="summaryCaption">Management Spend</p>
                                        <p className="percent">{ user.managementSpend }%</p>
                                    </div>
                                    <div className="flexWrapper">
                                        <div className="progressBar">
                                            <div className="progressWrapper">
                                                <div className="progress">
                                                    <div className="progressContain"
                                                        style={{
                                                            width: `${
                                                                user.managementSpend > 100
                                                                    ? 100
                                                                    : user.managementSpend
                                                            }%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="programsTitle">Programs</p>
                                { user && user.programs && user.programs.length > 0 && user.programs.map((e, i) => (
                                    <div key={i} className="programSection">
                                        <p className="title">Program { i + 1 }</p>
                                        <div className="subInfo">
                                            <p className="subTitle">{ e.title }</p>
                                            <p className="description">{ e.description }</p>
                                        </div>
                                    </div>
                                )) }
                            </div>
                            <div className="contactInfoBody">
                                <p className="title">Contact Information</p>
                                { user.address && user.address.address1 && user.address.address2 &&
                                    <p>{user.address.address1} {user.address.address2}</p>
                                }
                                { user.address && user.address.city && user.address.state && 
                                    <p>{user.address.city} {user.address.state}</p>
                                }
                                { user.email &&
                                    <p>{user.email}</p>
                                }
                            </div>
                        </div>
                        { lat !== 0 && lng !== 0 &&
                            <Map
                                lat={lat}
                                lng={lng}
                                containerElement={<div style={{ height: `140px` }} />}
                                chooseLocationFromMap={this.chooseLocationFromMap}
                                mapElement={<div style={{ height: `100%` }} />}
                            />
                        }
                    </Card>
                </section>
            )
        } else if (currentView === 1) {
            return (
                <section className="mobileInfoSection">
                    <Card padding="0px" className="mobileInfoCard">
                        <div className="userInfoBody">
                            <div className="reviewBody">
                                <div className="review-title">
                                    <img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickBack} />
                                    <span className="title">Review</span>
                                    <img className="btn-back" src="/images/ui-icon/profile/review-writing.svg" alt="" onClick={this.onClickNew }/>
                                </div>
                                <div className="star-rating review-tab">
                                    <StarRatingComponent 
                                        name="rate1" 
                                        starCount={5}
                                        value={currentRating}
                                        editable={false}
                                        starColor={"#1AAAFF"}
                                        emptyStarColor={"#C4C4C4"} 
                                        />
                                </div>
                                <div className="review-list">
                                    {reviewList.length !== 0 && reviewList.map((e, i) => {
                                        return(
                                            <Fragment key={e._id} >
                                                <RatingItem {...e} />
                                            </Fragment>
                                        )
                                    })}
                                </div>
                                <Modal className="new-review" showModal={newReview} closeModal={this.closeReviewDialog}>
                                    <div className="title center">Leave Review</div>
                                    <div className="star-rating review-tab">
                                        <StarRatingComponent 
                                            name="rate1" 
                                            starCount={5}
                                            value={newRating}
                                            onStarClick={this.onStarClick.bind(this)}
                                            starColor={"#1AAAFF"}
                                            emptyStarColor={"#C4C4C4"} 
                                            />
                                    </div>
                                    <div className="separator-10"/>
                                    <Textarea
                                        className="_review"
                                        name="newFeedback"
                                        value={newFeedback}
                                        style={{ minHeight: 100, maxHeight: 100 }}
                                        placeholder="How was your experience with this nonprofits?..."
                                        onChange={this.inputHelper('newFeedback')}
                                    />
                                    <div className="separator-10" />
                                    <div className="separator-15" />
                                    <div className="submit-btn">
                                        <Button label="Submit" padding="6px 20px" solid noBorder fontSize="14px" onClick={this.onClickSubmitReview} />
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </Card>
                </section>
            )
        } else {
            return (null);
        }
    }

}

const mapStateToProps = state => ({
    authUser: state.authentication.user,
    isAuth: state.authentication.isAuth,
    reviewList: state.user.reviewList
})

const mapDispatchToProps = {
    submitReview,
    getReviews,
    clearReviews
}

export default connect(
    mapStateToProps,
	mapDispatchToProps
)(MobileInfo)