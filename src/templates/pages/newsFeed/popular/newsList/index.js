import React, { Component} from 'react'
import { connect } from 'react-redux'
import Card from '../../../../common/Card';
import Button from '../../../../common/Button'
import {
    getPopularNews
} from '../../../../../actions/post'
import PopNews from '../../../../common/popNews'

class PopularNews extends Component {
    state = {
    }

    static getDerivedStateFromProps(props, state) {
        return state;
    }

    componentDidMount() {
        this.props.getPopularNews({
            skip: 0,
            limit: 3
        })
    }

    render() {
        const {popNews} = this.props
        return (
            <Card  padding="0px" className="popular-news">
                <div className="main-font _title">Popular news</div>
                <div className="search-body">
                    {popNews.length !== 0 && popNews.map((e, i) => {
                        return ( 
                            <PopNews key={e._id} post={e} border={popNews.length -1 !== i} />
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
    popNews: state.post.popNews
})

const mapDispatchToProps = {
    getPopularNews
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PopularNews)