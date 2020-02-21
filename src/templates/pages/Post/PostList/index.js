import React, { Component, Fragment } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import {
    getPosts,
    clearPosts,
    getPostLike,
    commentPost,
    deletePost,
    getPostById,
    closePost,
    sharePost
} from '../../../../actions/post';
import PostCard from '../../../common/PostCard';
import PostForm from '../PostForm';
import ConfirmModal from '../../../common/Modal/ConfirmModal';
import { signIn } from '../../../common/authModals/modalTypes';
import Placeholder from '../../../common/noContentPlaceholder';

class PostList extends Component {

    state = {
        skip: 0,
        limit: 5,
        scrollRun: false,
        title: "",
        user: {},
        shouldClear: true,
        showDeletePostDlg: false,
        delPostId : null
    }

    static getDerivedStateFromProps(props, state) {
        state.user = props.user;

        return state;
    }

    componentDidMount() {
        this.getData();

        document.addEventListener('wheel', this.scrollUpload, false);
        // document.addEventListener('touchstart', this.scrollUpload, false);
    }

    componentWillUnmount() {
        if (this.state.shouldClear)
            this.props.clearPosts();

        document.removeEventListener('wheel', this.scrollUpload, false)
        // document.removeEventListener('touchstart', this.scrollUpload, false)
    }

    currentPos = window.scrollY;
	scrollUpload = () => {
        let { skip } = this.state;
		if (
			document.body.clientHeight - 500 <
				window.scrollY + window.innerHeight &&
			skip <= this.props.posts.length
		) {
			this.getData();
		}
		this.currentPos = window.scrollY;
    }
    
    getData = () => {
		let { skip, limit, title } = this.state;
		this.props.getPosts({
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
        if (this.props.user) {
            this.props.getPostLike({
                id: post._id,
                isLike: post.isLike
            });
        } else {
            this.props.push(`?modal=${signIn}`);
        }
    }

    onClickPostShare = post => {
        if (this.props.user) {
            this.props.sharePost({
                id: post._id,
                isShared: (post.sharer && this.props.user._id === post.sharer._id && post.isShared),
                userId: this.props.selectedUserId
            });
        } else {
            this.props.push(`?modal=${signIn}`);
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
            this.props.push(`/${post.user._id}/project/${post.project._id}`);
        });
    }

    onClickPost = (post) => {
        this.props.getPostById({_id: post._id, selectedUserId: this.props.selectedUserId});
    }

    closePostModal = () => {
        this.props.closePost()
    }

    onClickDeletePost = e => {
        e.stopPropagation();
        this.props.deletePost({
            pId: this.state.delPostId,
            cb: () => {
                this.setState({skip: 0, limit: 10, delPostId: null, showDeletePostDlg: false}, () => {
                    this.getData()
                })
            }
        })
    }

    onClickShowDeleteModal = (e, pId) => {
        e.stopPropagation();
        this.setState({showDeletePostDlg: true, delPostId: pId})
    }

    onClickCloseDeleteModal = e => {
        this.setState({showDeletePostDlg: false})
    }

    onClickEditPost= (event, post) => {
        event.stopPropagation();
        if (post.project) {
        } else {
            this.props.getPostById({_id: post._id, edit: true});
        }
    }

    render() {
        const { showDeletePostDlg } = this.state;
        const { user, posts, openedPost, editPost } = this.props;
        return (
            <section className="postListPage">
                <ConfirmModal title="Are you sure you want to delete this post?" showModal={showDeletePostDlg}
                    closeModal={this.onClickCloseDeleteModal} onClickYes={this.onClickDeletePost}
                    onClickNo={this.onClickCloseDeleteModal}/>
                { posts.length !== 0 && posts.map((e, i) => {
                    return (
                        <Fragment key={e._id}>
                            <PostCard
                                {...e}
                                logedUser={user}
                                onClickLike={() => this.onClickPostLike(e)}
                                onClickShare={() => this.onClickPostShare(e)}
                                comment={this.onComment}
                                onClick={() => this.onClickPost(e)}
                                onClickSupport={() => this.onClickSupport(e)}
                                onClickDeletePost={(event) => this.onClickShowDeleteModal(event, e._id)}
                                onClickEditPost={(event) => this.onClickEditPost(event, e)}
                            />
                            <div className="separator-15" />
                        </Fragment>
                    )
                }) }

                { posts.length === 0 &&
                    <Placeholder
                        titleMain={`There are currently no posts found`}
                    />
                }

                {/* {!editSelectedPostId && openedPost && (
                    <div className={`modal ${openedPost ? 'open' : ''}`} onClick={this.closePostModal}>
                        <div className="modal-content" onClick={(e) => {e.stopPropagation()}}>
                            <PostCard
                                {...openedPost}
                                logedUser = {user}
                                onClickLike = {() => this.onClickPostLike(openedPost)}
                                comment = {this.onComment}
                                onCloseDialog = {this.closePostModal}
                            />
                        </div>
                    </div>
                )} */}

                { editPost && (
                    <div className={`modal ${editPost ? 'open' : ''}`} onClick={this.closePostModal}>
                        <div className="modal-content-post" onClick={(e) => {e.stopPropagation()}}>
                            <PostForm selectedPost={openedPost} hideDialog={this.closePostModal}/>
                        </div>
                    </div>
                )}
            </section>
        )
    }
}


const mapStateToProps = state => ({
	userId: state.authentication.userId,
    user: state.authentication.user,
    posts: state.post.posts,
    openedPost: state.post.openPost,
    editPost: state.post.editPost
})

const mapDispatchToProps = {
    getPosts,
    clearPosts,
    commentPost,
    getPostLike,
    sharePost,
    deletePost,
    getPostById,
    closePost,
    push
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PostList)