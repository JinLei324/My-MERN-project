import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import {
    getMySharedPosts,
    clearMySharedPosts,
    getPostById,
    sharePost
} from '../../../../actions/post';

import PostCard from '../../../common/PostCard';
import { signIn } from '../../../common/authModals/modalTypes';

class MySharedPostList extends Component {

    state = {
        skip: 0,
        limit: 5,
        scrollRun: false,
        title: "",
        user: {},
        shouldClear: true
    }

    static getDerivedStateFromProps(props, state) {
        state.user = props.authUser;
        return state;
    }

    componentDidMount() {
        const { selectedUserId } = this.props;

        selectedUserId && this.getData();
        
        document.addEventListener('wheel', this.scrollUpload, false);
        document.addEventListener('touchstart', this.scrollUpload, false);
    }

    componentWillUnmount() {
        if (this.state.shouldClear)
            this.props.clearMySharedPosts();

        document.removeEventListener('wheel', this.scrollUpload, false);
        document.removeEventListener('touchstart', this.scrollUpload, false);
    }

    currentPos = window.scrollY;
	scrollUpload = () => {
        let { skip } = this.state
		if (
			document.body.clientHeight - 500 <
				window.scrollY + window.innerHeight &&
			skip <= this.props.mySharedPosts.length
		) {
			this.getData()
		}
		this.currentPos = window.scrollY
    }
    
    getData = () => {
		let { skip, limit, title } = this.state;
		this.props.getMySharedPosts({
			skip,
			limit,
			title,
            userId: this.props.selectedUserId
		});
		this.setState({
			skip: skip + limit
		});
    }
    
    onClickPostLike = post => {
        if (this.props.authUser) {
            this.props.getPostLike({
                id: post._id,
                isLike: post.isLike
            });
        } else {
            this.props.push(`?modal=${signIn}`)
        }
    }

    onClickPostShare = post => {
        if (this.props.authUser) {
            this.props.sharePost({
                id: post._id,
                isShared: (post.sharer && this.props.authUser._id === post.sharer._id && post.isShared)
            });
        } else {
            this.props.push(`?modal=${signIn}`)
        }
    }

    onComment = (postId, parent, text, file) => {
        this.props.commentPost({
            id: postId,
            text: text,
            file: file,
            parent: parent
        })
    }

    onClickSupport = post => {
        this.setState({shouldClear: false}, () => {
            this.props.push(`/${post.user._id}/project/${post.project._id}`)
        });
    }

    onClickPost = (post) => {
        this.props.getPostById({_id: post._id});
    }
    
    render() {
        const { authUser, mySharedPosts } = this.props;

        return (
            <section className="postListPage">
                { mySharedPosts && mySharedPosts.length !== 0 && mySharedPosts.map((e, i) => {
                    return (
                        <Fragment key={e._id}>
                            <PostCard 
                                {...e}
                                logedUser = {authUser}
                                onClickLike = {() => this.onClickPostLike(e)}
                                onClickShare = {() => this.onClickPostShare(e)}
                                comment = {this.onComment}
                                onClick={() => this.onClickPost(e)}
                                onClickSupport={() => this.onClickSupport(e)}
                                />
                            <div className="separator-15" />
                        </Fragment>
                    )
                }) }
            </section>
        )
    }
}


const mapStateToProps = state => ({
    authUser: state.authentication.user,
    isAuth: state.authentication.isAuth,
	userId: state.authentication.userId,
    mySharedPosts: state.post.mySharedPosts
})

const mapDispatchToProps = {
    getMySharedPosts,
    clearMySharedPosts,
    sharePost,
    getPostById
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MySharedPostList)