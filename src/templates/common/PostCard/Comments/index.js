import React, { Component } from 'react'
import Comment from '../Comment'

export default class Comments extends Component {

    render() {
        const {comments, onComment, parent} = this.props;
        return (
            <div>
                {comments && comments.length !==0 && comments.map(function(comment){
                    return <Comment key={comment._id} comment={comment}  onComment={onComment} parent={parent}/>
                })}
            </div>
        )
    }
}