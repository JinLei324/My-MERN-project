import React, {Component} from 'react'
import UserAvatar from '../userComponents/userAvatar'
import Label from '../Label'
import { NavLink } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class PopNews extends Component {
    render() {
        const {post, border} = this.props
        return (
            <section className={`pop-news ${border ? 'border' : ''}`}>
                <div className="_preview">
                    {post.medias && post.medias.length > 0 && <img className="_image" src={post.medias[0].url} alt="Post" /> }
                    <div className="like-box">
                        <div className="_back"></div>
                        <FontAwesomeIcon className="_img" icon="heart" />
                        <span className="_text">{post.likeCount}</span>
                    </div>
                </div>
                <div className="post-title main-font">
                    {post.title}
                </div>
                <NavLink
                    to={`/${post.user && post.user._id}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="info-wrapper">
                        <UserAvatar
                            imgUserType={post.user.role}
                            imgUser={post.user.avatar}
                            userId={post.user._id}
                            size={32}
                        />
                        <Label
                            name={post.user.companyName || post.user.firstName + " " + post.user.lastName}
                        />
                    </div>
                </NavLink>
            </section>
        )
    }
}