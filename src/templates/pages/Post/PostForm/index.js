import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-autosize-textarea';
import ReactPlayer from 'react-player';
import EmojiMartPicker from 'emoji-mart-picker';
import { Hints } from 'intro.js-react';

import Card from '../../../common/Card';
import UserAvatar from '../../../common/userComponents/userAvatar';
import IconButton from '../../../common/IconButton';
import Button from '../../../common/Button';

import { toggleNotification } from '../../../../actions/notificationActions';

import { createPost, editPost } from '../../../../actions/post';

import { checkHint } from '../../../../helpers/websocket';
 
class PostForm extends Component {

    constructor(props) {
        super(props)
        this.previewRef = React.createRef()
        this.previewVideo = React.createRef()
    }

    state = {
        text: "",
        user: {},
        contentType: 0,
        file: null,
        filePreview: null,
        curId: null,
        curMedias: [],
        showHints: true,
        showMood: false,
		basicHints : [
			{
                id:5,
				element: '.hint-share',
                hint: 'Learn more about what your community is up to on your News Feed! Check out updates from nonprofits, share volunteer memories, express giving thoughts, stories and ideas to your community through this sharing feature.',
				hintPosition: 'bottom-left'
			},
        ],
        hints:[]
    }

    componentDidMount() {
        this._mounted = true
        if (this.props.selectedPost) {
            const type = this.props.selectedPost.medias.length === 0 ? 0 : this.props.selectedPost.medias[0].type;
            const filePreview = this.props.selectedPost.medias.length === 0 ? null : this.props.selectedPost.medias[0].url;
            this.setState({
                curMedias: this.props.selectedPost.medias,
                curId: this.props.selectedPost._id,
                text: this.props.selectedPost.content,
                contentType: type,
                filePreview: filePreview
            });
        }
        window.addEventListener('click', this.close);
    }

    componentWillUnmount() {
        this._mounted = false;
        window.removeEventListener('click', this.close);
    }

    close = e => {
        const moodBtn = document.querySelector(".mood-button");
        if (moodBtn.contains(e.target)) {
            this.setState({showMood: !this.state.showMood});
        } else {
            if (this.state.showMood) {
                const emojiDlg = document.querySelector(".emoji-mart");
                if (emojiDlg && !emojiDlg.contains(e.target)) {
                    moodBtn.click();
                }
            }    
        }
    }

    static getDerivedStateFromProps(props, state) {
        state.user = props.user;
        if (state.user) {
            state.hints = state.basicHints.filter(e => {
                if (!state.user.hints.includes(e.id)) {
                    return e;
                }
                return false;
            })
        }
        return state;
    }

    onClickPeople = e => {
    }

    onClickCheckIn = e => {
    }

    onClickShare = e => {
        if (!this.state.text && !this.state.file) {
            return;
        }

        let data = {
            id: this.state.curId,
            title: '',
            content: this.state.text,
            file: this.state.file,
            contentType: this.state.contentType,
            medias: this.state.curMedias,
            cb: () => {
                this.setState({text: "", file: null, contentType: 0, filePreview : null}, () => {
                    this.props.hideDialog && this.props.hideDialog();
                });
            }
        }
        if (this.state.curId) {
            this.props.editPost(data);
        } else {
            this.props.createPost(data);
        }
    }

    addEmoji = e => {  
        let emojiPic = String.fromCodePoint(`0x${e.unified}`)

        let start = this.textarea.selectionStart,
            end = this.textarea.selectionEnd;

        this.setState({
            text: this.state.text.substring(0, start) + emojiPic +  this.state.text.substring(end)
        }, () => {
            this.textarea.focus();
            this.textarea.selectionStart = this.textarea.selectionEnd = start + emojiPic.length
        });
    }

    handleChange = (e) => {
        this.setState({ text: e.target.value });
    }

    onClickType = (type) => {
        if (type === 1) {
            this.openSelectFile()
        } else if (type === 2) {
            this.openSelectVideo()
        }
    }

    changeFile = e => {
        if (e.target.files.length === 0)
            return;

        if (
			e.target.files[0].type !== 'image/jpeg' &&
            e.target.files[0].type !== 'image/png' && 
            e.target.files[0].type !== 'video/mp4' && 
            e.target.files[0].type !== 'video/avi' &&
            e.target.files[0].type !== 'video/3gp' &&
            e.target.files[0].type !== 'video/mov'
		) {
			this.props.toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image and video files',
					buttonText: 'Ok'
				})
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 50
			) {
                var contentType = 1
                if (e.target.files[0].type === 'video/mp4' || e.target.files[0].type === 'video/3gp' || e.target.files[0].type === 'video/avi')
                    contentType = 2;

                this.setState({ file: e.target.files[0], contentType: contentType})
                var reader = new FileReader();
                reader.onload= (e) => {
                    this.setState({filePreview: e.target.result})
                }

                reader.readAsDataURL(e.target.files[0])
			} else {
				this.props.toggleNotification({
                    isOpen: true,
                    resend: false,
                    firstTitle: 'Error',
                    secondTitle: 'Photo and Video should be up to 50mb',
                    buttonText: 'Ok'
                })
			}
		}
    }

    openSelectFile = () => {
		this.previewRef.current.click();
    }

    onClickPeople = () => {
    }
    
    removeAttachFile = () => {
        this.setState({contentType: 0, filePreview: null, file: null});
        if (this.state.curId) {
            this.setState({curMedias: []});
        }
    }

    onCloseHint = idx => {
        if (!this._mounted)
            return;

        const { hints } = this.state;
        const hId = hints[idx].id;
        checkHint(hId);
    }

    render() {
        const { user, text, contentType, filePreview, curId, hints, showHints } = this.state;
        const { request } = this.props;

        return (
            <Card className="post-options" padding="0px">
                { user && <Fragment>
                    <Hints 
                        enabled={showHints}
                        hints={hints}
                        onClose={this.onCloseHint}
                        ref={hints => this.hintRef = hints}
                    />
                    <div className="post-box">
                        <UserAvatar
                            imgUserType={0}
                            imgUser={user.avatar}
                        />
                        <TextareaAutosize
                            className="post-content"
                            innerRef={ref => this.textarea = ref} 
                            value={text} 
                            onChange={this.handleChange}
                            placeholder={`Type your message...`} />
                    </div>
                    <div className="preview-file">
                        {filePreview && contentType === 1 && <img className="preview" src={filePreview} alt="prev"/> }
                        {filePreview && contentType === 2 && <ReactPlayer className="preview-video" url={filePreview} controls width="100%" height="100%" /> }
                        {filePreview && <img className="preview-close" src="/images/ui-icon/close_modal.svg" alt="close" onClick={this.removeAttachFile}/>}
                    </div>
                    <div className="post-lower">
                        <div className="post-lower-wrap">
                            <IconButton 
                                className="mr-5" 
                                icon="/images/ui-icon/news_feed/photo-video-icon.svg"
                                label="Photo/Video"
                                size="17px"
                                fontSize="10px"
                                onClick={this.openSelectFile} />
                            <IconButton 
                                className="mr-5" 
                                icon="/images/ui-icon/news_feed/people-icon.svg"
                                label="People"
                                size="20px"
                                fontSize="10px"
                                onClick={this.onClickPeople} />
                            <EmojiMartPicker 
                                set="google" 
                                onChange={this.addEmoji} 
                                title='Pick your mood.'>
                                <IconButton 
                                    className="mood-button" 
                                    icon="/images/ui-icon/news_feed/smile-icon.svg" 
                                    label="Mood" 
                                    size="18px"
                                    fontSize="10px" />
                            </EmojiMartPicker>
                        </div>
                        <input
                            type="file"
                            ref={this.previewRef}
                            onChange={this.changeFile}
                            accept="image/*|video/*"
                        />
                        <div className="rightFlexBody">
                            <Button
                                onClick={this.onClickShare}
                                className="hint-share shareBtn"
                                padding="14px 80px"
                                label={`${curId ? 'Update' : 'Post'}`}
                                disabled={request}
                                solid
                            />
                        </div>
                    </div>
                </Fragment>
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user,
    userId: state.authentication.userId,
    request: state.post.request
})

const mapDispatchToProps = {
    createPost,
    editPost,
    toggleNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PostForm)
