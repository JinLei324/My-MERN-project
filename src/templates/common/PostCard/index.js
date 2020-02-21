import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import ReactPlayer from 'react-player';
import EmojiMartPicker from 'emoji-mart-picker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserAvatar from '../userComponents/userAvatar';
// import Card from '../Card';
import Label from '../Label';
import { toggleNotification } from '../../../actions/notificationActions';
import Comments from './Comments';

export default class PostCard extends Component {

    constructor(props) {
        super(props)
        this.previewRef = React.createRef()
        this.editMenu = React.createRef()
    }
    
    selectType = type => {
		switch (type) {
			case 0:
				return 'volunteer.svg'
			case 1:
				return 'money.svg'
			case 2:
				return 'pink-up.svg'
			default:
				return ''
		}
    }
    
    state = {
        text : '',
        file: null,
        parent: null,
        showDropDown: false
    }

    componentDidMount() {
        this.mount = true
        window.addEventListener('scroll', (e) => {
            if (this.mount)
                this.setState({showDropDown: false})
		})
    }

    componentWillUnmount() {
        this.mount = false
    }

    scrollFunc = () => {
		this.setState({showDropDown: false})
	}

    onClickComment = (parent) => {
        if (this.props.logedUser) {
            this.setState({parent: parent}, () => {
                this.commentRef.focus();
            })
        }
    }

    onClickLike = (e) => {
        e.stopPropagation();
        this.props.onClickLike();
    }

    onClickShare = (e) => {
        e.stopPropagation();
        this.props.onClickShare();
    }

    addEmoji = e => {  
        let emojiPic = String.fromCodePoint(`0x${e.unified}`)

        let start = this.commentRef.selectionStart,
             end = this.commentRef.selectionEnd;

        this.setState(
        {
            text: this.state.text.substring(0, start) + emojiPic +  this.state.text.substring(end)
        },
        () => {
            this.commentRef.focus();
            this.commentRef.selectionStart = this.commentRef.selectionEnd = start + 1
        });
    }

    handleChange = (e) => {
        this.setState({ text: e.target.value })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.props.comment(this.props._id, this.state.parent, this.state.text, this.state.file)
            this.setState({text: "", file: null, parent: null});
        }
    }

    onSendComment = e => {
        this.props.comment(this.props._id, this.state.parent, this.state.text, this.state.file)
        this.setState({text: "", file: null, parent: null});
    }

    changeFile = e => {
        if (e.target.files.length === 0)
			return;
        if (
			e.target.files[0].type !== 'image/jpeg' &&
			e.target.files[0].type !== 'image/png'
		) {
			this.props.dispatch(toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image files',
					buttonText: 'Ok'
				}));
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.setState({ file: e.target.files[0] })
			} else {
				this.props.dispatch(toggleNotification({
                    isOpen: true,
                    resend: false,
                    firstTitle: 'Error',
                    secondTitle: 'Photo should be up to 10mb',
                    buttonText: 'Ok'
                }));
			}
		}
    }

    openSelectFile = () => {
		this.previewRef.current.click()
    }

    onClickShowDropDown= (e) =>{
        e.stopPropagation();
        this.setState({showDropDown: !this.state.showDropDown})
    }

    leaveMouseoutOfMenu = (e) => {
        this.setState({showDropDown: false})
    }

    render() {
        const { text, showDropDown, parent } = this.state
        const {
            medias,
            title,
            createdAt,
            content,
            likeCount,
            commentCount,
            isShared,
            user,
            sharer,
            logedUser,
            project,
            comment_list,
            onClick,
            onCloseDialog,
            onClickDeletePost,
            onClickEditPost,
            onClickSupport,
            isLike
        } = this.props;
        
        const dialog_open = onCloseDialog;

        return (
            <div className={`postCard post ${dialog_open ? 'open' : ''}`} onClick={onClick}>
                <section className={`post-main`}>
                    <div className="post-header">
                        <NavLink
                            to={`/${user && user._id}`}
                            onClick={e => e.stopPropagation()}>
                            <div className="info-wrapper">
                                { !isShared && 
                                    <UserAvatar
                                        imgUserType={user.role}
                                        imgUser={user.avatar}
                                        userId={user._id}
                                        size={60}
                                    />
                                }
                                { !isShared &&
                                    <Label
                                        name = { user.companyName || user.firstName + " " + user.lastName }
                                        date = { createdAt }
                                        address = { user.address } isApproved = { user.isApproved } role = { user.role }
                                    />
                                }
                                { isShared && sharer && 
                                    <div className="sharerOtherAvatar">
                                        <UserAvatar
                                            imgUserType={sharer.role}
                                            imgUser={sharer.avatar}
                                            userId={sharer._id}
                                            isSharer={true}
                                            isSelf={false}
                                            size={60}
                                        />
                                        <UserAvatar
                                            imgUserType={user.role}
                                            imgUser={user.avatar}
                                            userId={user._id}
                                            isSharer={false}
                                            isSelf={true}
                                        />
                                        <Label
                                            isSharer={true}
                                            sharerName={ sharer.companyName || sharer.firstName + " " + sharer.lastName }
                                            name={ user.companyName || user.firstName + " " + user.lastName }
                                            date={ createdAt }
                                            address={ user.address } isApproved = { user.isApproved } role = { user.role }
                                        />
                                    </div>
                                }
                            </div>
                        </NavLink>
                        <div className="post-more-btn">
                            { !onCloseDialog && logedUser && logedUser._id === user._id &&
                                <button className="action" onClick={this.onClickShowDropDown}>
                                    <FontAwesomeIcon icon="ellipsis-v"/>
                                </button>
                            }
                            { onCloseDialog && 
                                <button className="action" onClick={onCloseDialog}>
                                    {/* <FontAwesomeIcon icon="times"/> */}
                                </button>
                            }
                            <div className={`edit-menu main-font ${showDropDown ? 'open' : ''}`} onMouseLeave={this.leaveMouseoutOfMenu} ref={this.editMenu}>
                                <div className="submenu edit" onClick={(e) => {onClickEditPost(e); this.leaveMouseoutOfMenu(e)} }>
                                    <FontAwesomeIcon icon="edit"/>
                                    <span className="_label">Edit</span>
                                </div>
                                <div className="submenu trash" onClick={onClickDeletePost}>
                                    <FontAwesomeIcon icon="trash"/> 
                                    <span className="_label">Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    { title && (
                        <p
                            className="_title main-font">
                            {title}
                        </p>
                    )}
                    { content && (<section className="description">
                        <p className="text">{content}</p>
                    </section>) }

                    { medias && medias.length !== 0 && 
                        <div className="post-preview">
                            { medias[0].type === 1 &&
                                <section className="project-preview">
                                    <img src={medias[0].url} className="preview" alt="" />
                                    { project &&
                                        <div className={`type-project type-${project.projectType}`}>
                                            <img
                                                className="type"
                                                src={`/images/ui-icon/${this.selectType(
                                                    project.projectType
                                                )}`}
                                                alt="type"
                                            />
                                        </div>
                                    }
                                </section> 
                            }
                            { medias[0].type === 2 && 
                                <ReactPlayer className="preview-video" url={medias[0].url} controls width="100%" height="100%" />
                            }
                        </div>
                    }
                    <section className="postBottom">
                        {/* <div className="statusBody">
                            <div className="likeBody">
                                <img src="/images/ui-icon/profile/like_label_icon.svg" alt="" />
                                <span>{likeCount} Likes</span>
                            </div>
                            <div className="commentBody">
                                <img src="/images/ui-icon/profile/comment_label_icon.svg" alt="" />
                                <span>{commentCount} Comments</span>
                            </div>
                        </div> */}
                        <div className="actionBody">
                            { project && 
                                <div className="socialButton">
                                    <span className="support" onClick={(e) => { e.stopPropagation(); onClickSupport(); }}>Support</span>
                                    <img className="supportIcon" src="/images/ui-icon/post/right-arrow-icon.svg" alt="right-arrow-icon" />
                                </div>
                            }
                            <div className="socialButton heart" onClick={(e) => this.onClickLike(e)}>
                                { isLike && <img src="/images/ui-icon/profile/like_label_icon.svg" alt="" /> }
                                { !isLike && <img src="/images/ui-icon/profile/like_icon.svg" alt="" /> }
                                <span>{likeCount} Likes</span>
                            </div>
                            <div className="socialButton" onClick={() => this.onClickComment(null)}>
                                <img src="/images/ui-icon/profile/comment_icon.svg" alt="" />
                                <span>{commentCount} Comments</span>
                            </div>
                            { (logedUser && logedUser._id !== user._id) && 
                            <div className="socialButton share" onClick={(e) => this.onClickShare(e)}>
                                <span>{ (sharer && logedUser._id === sharer._id && isShared) ? 'Unshare' : 'Share' }</span>
                                <img className="shareIcon" src="/images/ui-icon/profile/share-icon.svg" alt="share-icon" />
                            </div>
                            }
                        </div>
                    </section>
                </section>
                <section className={`post-comment ${dialog_open ? 'active' : ''}`}>
                    {comment_list.length !== 0 &&
                        <div className="post-comment-list">
                            <p className="main-font comment-title">Comments</p>
                            <Comments comments={comment_list} onComment={this.onClickComment} parent={parent}/>
                        </div>}

                    {logedUser &&
                        <div className="leave-comment">
                            <div className="comment-wrapper">
                                <UserAvatar
                                    imgUserType={logedUser.role}
                                    imgUser={logedUser.avatar}
                                    userId={logedUser._id}
                                    size={32}
                                />
                                <div className="comment-input">
                                    <input value={text} className="_input" type="text"  placeholder="Leave a Comment" ref={ref => this.commentRef = ref} onChange={this.handleChange}  onKeyPress={this.handleKeyPress}/>
                                    {/* <button className="comment-button camera-button" onClick={this.openSelectFile}>
                                        <FontAwesomeIcon icon="image" />
                                    </button> */}
                                    <input
                                        type="file"
                                        ref={this.previewRef}
                                        onChange={this.changeFile}
                                        accept="image/*"
                                        id="projectFileCreate"
                                    />
                                    <EmojiMartPicker set="google" onChange={this.addEmoji} >
                                        <button className="comment-button emoji-button">
                                            <FontAwesomeIcon icon="smile-wink" />
                                        </button>
                                    </EmojiMartPicker>
                                </div>
                                <img className="btn-comment" src="/images/ui-icon/icon-send.svg" alt="" onClick={this.onSendComment} />
                            </div>
                        </div>}

                </section>

            </div>
        )
    }
}