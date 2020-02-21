import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import ReactPlayer from 'react-player';

import {
    getMediaList,
    clearMediaList
} from '../../../../actions/post';
import Card from '../../../common/Card';

import Placeholder from '../../../common/noContentPlaceholder';

class MediaList extends Component {

    state = {
        skip: 0,
        limit: 10
    }

    componentDidMount() {
        this.getData();

        document.addEventListener('wheel', this.scrollUpload, false);
        // document.addEventListener('touchstart', this.scrollUpload, false);
    }

    componentWillUnmount() {
        this.props.clearMediaList()
        document.removeEventListener('wheel', this.scrollUpload, false);
        // document.removeEventListener('touchstart', this.scrollUpload, false);
    }

    currentPos = window.scrollY
	scrollUpload = () => {
        let { skip } = this.state
		if (
			document.body.clientHeight - 100 <
				window.scrollY + window.innerHeight &&
			skip <= this.props.mediaList.length
		) {
			this.getData()
		}
		this.currentPos = window.scrollY
    }

    getData() {
        let { skip, limit} = this.state
        this.props.getMediaList({
			skip,
			limit,
            userId: this.props.selectedUserId
		})
        this.setState({
			skip: skip + limit
		})
    }

    render() {
        const {
            mediaList
        } = this.props;

        return (
            <section className="media-list">
                { mediaList.length !== 0 && mediaList.map((e, i) => {
                    return (
                        <Fragment key = {e._id}>
                            <Card padding="0px" className="eachMedia">
                                { e.medias[0].type === 1 && (
                                    <img className="media-preview" src={e.medias[0].url} alt="" />
                                ) }
                                { e.medias[0].type === 2 && (
                                    <ReactPlayer className="preview-video" url={e.medias[0].url} controls width="100%" height="100%" />
                                ) }
                            </Card>
                        </Fragment>
                    )
                }) }
                { mediaList.length === 0 &&
                    <Placeholder
                        titleMain={`There are currently no media found`}
                    />
                }
            </section>
        )
    }
}

const mapStateToProps = state => ({
    mediaList: state.post.mediaList
})

const mapDispatchToProps = {
    getMediaList,
    clearMediaList
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MediaList)
