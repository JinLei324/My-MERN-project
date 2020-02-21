import React, { Component } from 'react'
import UserAvatar from '../../userComponents/userAvatar'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux'
import {
    deleteComment
} from '../../../../actions/post'
import ConfirmModal from '../../Modal/ConfirmModal';

class Comment extends Component {

    state = {
        showDeleteModal: false
    }
    constructor(props){
        super(props)
        let level = props.comment.slug.split('/').length - 1        
        this.state = {
            style: {
                padding: `0px 0px 0px ${30 * level}px`
            },
            avatarSize: level === 0 ? 32 : 24
        }
    }

    onClickComment = (e) => {
        this.props.onComment(this.props.comment._id)
    }

    onClickDelete = e => {
        this.props.deleteComment({
            postId: this.props.comment.post,
            _id: this.props.comment._id
        })
        e.stopPropagation();
    }

    onClickShowDeleteModal = e => {
        this.setState({showDeleteModal: true})
    }
    
    onClickCloseDeleteModal = e => {
        this.setState({showDeleteModal: false})
    }
    
    render() {
        const {style, avatarSize, showDeleteModal} = this.state
        const {comment, user, parent} = this.props
        return (
            <div className="comment-section">
                <ConfirmModal title="Are you sure you want to delete this comment?" showModal={showDeleteModal} closeModal={this.onClickCloseDeleteModal} onClickYes={this.onClickDelete} onClickNo={this.onClickCloseDeleteModal}/>
                <div className="comment-view-wrapper main-font" style={style}>
                    <div className="avatar-text">
                        <UserAvatar
                            imgUserType={comment.author.role}
                            imgUser={comment.author.avatar}
                            userId={comment.author._id}
                            size={avatarSize}
                        />
                        <div className="comment-text">
                            <span className="_name">{comment.author.companyName || comment.author.firstName + " " + comment.author.lastName}</span>
                            {comment.text}
                        </div>
                    </div>
                    <div className="comment-bot">
                        <span className="comment-time">{moment(comment.createdAt).fromNow()}</span>
                        <div className={`comment-reply ${parent === comment._id ? 'active' : ''}`} onClick={this.onClickComment}>Comment</div>
                        {user && user._id === comment.author._id && <div className="comment-trash" onClick={this.onClickShowDeleteModal}><FontAwesomeIcon icon="trash"/></div> }  
                    </div>                    
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    user: state.authentication.user
})

const mapDispatchToProps = {
    deleteComment
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Comment)