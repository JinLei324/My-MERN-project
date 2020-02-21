import React, { Component, Fragment } from 'react'
// import { CopyToClipboard } from 'react-copy-to-clipboard';
import Card from '../../../common/Card';
import { connect } from 'react-redux'
import { Line } from 'rc-progress'
import Geocode from 'react-geocode'
import Map from './Map.js';
import RatingItem from './RatingItem'
import StarRatingComponent from 'react-star-rating-component';
import Modal from '../../../common/Modal';
import Textarea from 'react-textarea-autosize'
import Button from '../../../common/Button';
import {
    submitReview,
    getReviews,
    clearReviews
} from '../../../../actions/user'

Geocode.setApiKey(process.env.GEOCODE_API_KEY);

class UserInfo extends Component {

    state = {
        currentView: 0, // 0 UserInfo, 1: rating view
        newReview: false,
        newRating: 0,
        newFeedback: "",
        currentRating: 0,
        copied: false
    }
    
    chooseLocationFromMap = event => {		
    }

    onClickReview = e => {
        if (!this.props.isAuth)
            return;

        if (this.props.authUser && this.props.user) {
            if (this.props.authUser._id === this.props.user._id)
                return;
        }

        this.setState({currentView: 1})
    }

    onClickBack = e => {
        this.setState({currentView : 0})
    }

    onClickNew = e => {
        if (!this.props.isAuth)
            return;

        if (this.props.authUser && this.props.user) {
            if (this.props.authUser._id === this.props.user._id)
                return;
        }

        this.setState({newReview: true})
    }

    closeReviewDialog = e => {
        this.setState({newReview: false})
    }
    
    onStarClick(nextValue, prevValue, name) {
        this.setState({newRating: nextValue});
    }

    inputHelper = key => e => this.setState({ [key]: e.target.value })

    onClickSubmitReview = e => {
        const {newRating, newFeedback, currentRating} = this.state
        this.props.submitReview({
            rating: newRating,
            review: newFeedback,
            user: this.props.user._id,
            currentRating: currentRating,
            cb: () => {
                this.setState({newReview: false, newRating: 0, newFeedback: "", currentRating: this.props.user.rating} )
            }
        })
    }

    componentDidMount(){        
        this.props.user && this.props.getReviews({userId: this.props.user._id}) && this.setState({currentRating: this.props.user.rating})
    }

    componentWillUnmount(){
        this.props.clearReviews()
    }
    
    render() {
        const { currentView, newReview, newRating, newFeedback, currentRating } = this.state
        const { user, reviewList } = this.props
        const fullAddress = user && `${user.address.address1}, ${user.address.address2}, ${user.address.city}, ${user.address.country}, ${user.address.state}, ${user.address.zipcode}`;
        if(currentView === 0) {
            return (<Card className="profile-user-info" padding="20px 40px 50px">
                <div className="title">Rating</div>
                <div className="star-rating m-b-5" onClick={this.onClickReview}>
                    <StarRatingComponent 
                        name="rate1" 
                        starCount={5}
                        value={currentRating}
                        editable={false}
                        starColor={"#1AAAFF"}
                        emptyStarColor={"#C4C4C4"} 
                        />
                    <span className="review-count">({reviewList.length} Reviews)</span>
                </div>
                <div className="title">Mission</div>
                <div className="description text-left ">{user.aboutUs}</div>
                <div className="title">Program Percentage</div>
                <div className="description">0%</div>
                <Line percent="0" strokeWidth="2" strokeColor="#C4C4C4" trailColor="#1AAAFF" trailWidth="2"/>
                <div className="description">
                    <span className="description">Overhead</span>
                    <span className="description">Programs</span>
                </div>
                <div className="flex-start">
                    <span className="title">Cost to Raise $100 :</span>
                    <span className="description"> $ 0</span>
                </div>
                <div className="flex-start">
                    <span className="title">Total Contributions :</span>
                    <span className="description"> $ 0</span>
                </div>
                <div className="separator-30"></div>
                <div className="description">
                    <div className="col text-left">
                        <div className="title">Contact Information :</div>
                        <div className="description text-left user-select">
                            { fullAddress }
                            {/* <CopyToClipboard text = { fullAddress }
                                onCopy={() => this.setState({copied: true})}>
                                <span>{ fullAddress }</span>
                            </CopyToClipboard> */}
                        </div>
                        <div className="description text-left user-select">{ user && user.phoneOfContact }</div>
                        <div className="description text-left user-select">{ user && user.email }</div>
                    </div>
                    <div className="col">
                        <Map
                            lat={0}
                            lng={0}
                            containerElement={<div style={{ height: `140px` }} />}
                            chooseLocationFromMap={this.chooseLocationFromMap}
                            mapElement={<div style={{ height: `100%` }} />}
                        />
                    </div>
                </div>
                <div className='ein-section'>
                    <div className="ein">EIN :</div>
                    <p>{ user && user.ein }</p>
                </div>
            </Card>)
        } else if(currentView === 1) {
            return (<Card className="profile-user-info" padding="20px 40px 50px">
                <div className="review-title">
                    <img className="btn-back" src="/images/ui-icon/arrow-left.svg" alt="" onClick={this.onClickBack}/>
                    <span className="title">Review</span>
                    <img className="btn-back" src="/images/ui-icon/profile/review-writing.svg" alt="" onClick={this.onClickNew}/>
                    {/* <div className={`btn-new ${user && isOther && isAuth && 'active'}`} onClick={this.onClickNew}/>  */}
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
                <div className="separator-20" />
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
                    <div className="separator-10 bot-border"/>
                    <div className="separator-15"/>
                    <div className="submit-btn">
                        <Button label="Submit" padding="4px 6px" solid noBorder fontSize="14px" onClick={this.onClickSubmitReview}/>
                    </div>
                    
                </Modal>
            </Card>)
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
)(UserInfo)
