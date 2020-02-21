import React, { Component } from 'react';

import StarRatingComponent from 'react-star-rating-component';

import UserAvatar from '../../../../common/userComponents/userAvatar';

export default class RatingItem extends Component {

    render() {
        const { rating, review, author } = this.props;
        const fullName = author.companyName ? author.companyName : author.firstName + " " + author.lastName;

        return(
            <section className="rating-view-item">
                <UserAvatar
                    imgUser={author.avatar}
                    imgUserType={author.role}
                />
                <div className="separator-h-10" />
                <div className="_info">
                    <div className="_name">{fullName}</div>
                    <StarRatingComponent 
                        name="rate1" 
                        starCount={5}
                        value={rating}
                        editable={false}
                        starColor={"#1AAAFF"}
                        emptyStarColor={"#C4C4C4"} 
                    />
                    <div className="_review">{review}</div>
                </div>
            </section>
        )
    }
    
}