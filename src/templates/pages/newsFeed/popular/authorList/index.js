import React, { Component} from 'react'
import { connect } from 'react-redux'
import Card from '../../../../common/Card';
import ChatUser from '../../../../common/chat/ChatUser'
import Button from '../../../../common/Button'
import {
    getPopularAuthors
} from '../../../../../actions/post'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PopularAuthor extends Component {
    state = {
        text: "",
    }

    static getDerivedStateFromProps(props, state) {
        return state;
    }

    componentDidMount() {
        this.props.getPopularAuthors({
            name: "",
            skip: 0,
            limit: 3
        })
    }

    handleChange = (e) => {
        this.setState({ text: e.target.value }, () => {
            this.props.getPopularAuthors({
                name: this.state.text,
                skip: 0,
                limit: 3
            })
        })        
    }

    render() {
        const {text} = this.state
        const {authors} = this.props
        return (
            <Card  padding="0px" className="popular-author">
                <div className="main-font _title">Popular authors</div>
                <div className="search-body">
                    <div className="search-bar">
                        <FontAwesomeIcon className="_icon" icon="search" />
                        <input className="_text" type="text" placeholder="Search" value={text} onChange={this.handleChange}/>
                    </div>
                    {authors.length !== 0 && authors.map((e, i) => {
                        return ( 
                            <ChatUser key={e._id} user={e.user} last_msg={e.content} border={authors.length -1 !== i}/>
                        )
                    })}
                    <div className="more-button-box text-right">
                        <Button
                            className="more-button"
                            padding="7px 22px"
                            label="More"
                            inverse
                        />
                    </div>
                </div>
            </Card>
        );
    }
}
const mapStateToProps = state => ({
    user: state.authentication.user,
    userId: state.authentication.userId,
    authors: state.post.authors
})

const mapDispatchToProps = {
    getPopularAuthors
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PopularAuthor)