import React, {Component} from 'react';
import UserAvatar from '../../userComponents/userAvatar';
import { 
    LikeOnPost, FollowAccept, FollowDecline, FollowRequest, 
    CommentOnPost, UnFollow, SharedOnPost, SharedOnProject 
} from '../../../../helpers/notificationType';
import moment from 'moment';

export default class NotifyItem extends Component {
    
    render() {
        const { user, type, createdAt, viewedAt, isRead, post, onClickItem, onCloseItem } = this.props;
        // const { _id, user, onDelete, type, viewedAt, post, onClickItem } = this.props;
        
        if (!user) {
            return (null);
        }

        const userName = user.companyName ? user.companyName : user.firstName + " " + user.lastName
        return (
            <section className="notify-item" onClick={ onClickItem }>
                <div className="main-info">
                    <UserAvatar
                        imgUser={user.avatar}
                        imgUserType={user.role}
                    />
                    <div className="separator-h-10"/>
                    <div className="_content">
                        { type === LikeOnPost && <span className="_name">
                            <span className="solid">{ userName }</span>
                            &nbsp;liked your post</span> }
                        { type === CommentOnPost && <span className="_name">
                            <span className="solid">{ userName }</span>
                            &nbsp;commented on your post</span> }
                        { type === SharedOnPost && <span className="_name">
                            <span className="solid">{ userName }</span>
                            &nbsp;shared your post</span> }
                        { type === SharedOnProject && <span className="_name">
                            <span className="solid">{ userName }</span>
                            &nbsp;shared your project</span> }
                        { type === FollowAccept && <span className="_name">
                            <div className="solid">{ userName }</div>
                            accepted your request
                        </span> }
                        { type === FollowDecline && <span className="_name">
                            <div className="solid">{ userName }</div>
                            declined your request
                        </span> }
                        { type === FollowRequest && <span className="_name">                            
                            <div className="solid">{ userName }</div>
                            followed you                          
                        </span> }
                        { type === UnFollow && <span className="_name">
                            <div className="solid">{ userName }</div>
                            unfollowed you
                        </span> }
                        <span className="_time">
                            { isRead ? moment(viewedAt).fromNow() : moment(createdAt).fromNow() }
                        </span>
                    </div>
                </div>
                <div className="separator-h-10"/>
                { type === LikeOnPost && post && post.medias.length > 0 && <img className="_img" src={ post.medias[0].url } alt="" /> }
                { type === CommentOnPost && post && post.medias.length > 0 && <img className="_img" src={ post.medias[0].url } alt="" /> }
                {/* <img className="_close" src="/images/ui-icon/close_modal.svg" alt="" onClick={ onDelete(_id) } /> */}
                <img className="_close" src="/images/ui-icon/close_modal.svg" alt="" onClick={ onCloseItem } />
            </section>
        )
    }
}