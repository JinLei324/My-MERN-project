import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {
    clearSearchByType
} from '../../../actions/search'
import UserAvatar from '../../common/userComponents/userAvatar';

const ALL_SEARCH = 0
const PEOPLE_SEARCH = 1
const PROJECT_SEARCH = 2

class Search extends Component {

    state = {
        showSearchDialog: true
    }

    allSearchClicked = false;

    constructor(props) {
		super(props);

		this.onBodyClickHandler = this.onBodyClickHandler.bind(this);
    }
    
    componentDidMount() {
		document.addEventListener('mousedown', this.onBodyClickHandler);
    }

    onBodyClickHandler = e => {
		if (this.allSearchClicked) {
			this.allSearchClicked = false;
			return;
		}
		// this.setState({
		// 	showSearchDialog: false
		// });
	}
    
    onGoProfile = (userId) => {
		this.setState({search: ""}, () => {
			this.props.clearSearchByType()
			this.props.push(`/${userId}`)
		})
	}

	onGoProject = (userId, projectId) => {
		this.setState({search: ""}, () => {
			this.props.clearSearchByType()
			this.props.push(`/${userId}/project/${projectId}`)
		})
    }

    render() {
        let { showSearchDialog } = this.state;
        const { searchResults, onClickAllSearch, searchType } = this.props;
        
        return (
            <div className="search-result main-font">
                { showSearchDialog && ( (searchResults.user && searchResults.user.length > 0) || (searchResults.project && searchResults.project.length > 0) ) && 
                    <div className="all-result" onClick={() => {
                        this.allSearchClicked = true; onClickAllSearch(ALL_SEARCH);
                        } }>
                        <span className="_label">All results</span>
                        <img className="_img" src="/images/ui-icon/dropdown.svg" alt="icon" />
                    </div>
                }
                <div className="search-body">
                    { showSearchDialog && searchType !== PROJECT_SEARCH && searchResults.user.length !== 0 && <div className="group-label">People</div> }
                    { showSearchDialog && searchType !== PROJECT_SEARCH && searchResults.user.length !== 0 && 
                        <div className="search-user-list">
                            { searchResults.user.map((e, i) => {
                                return (
                                    <div className="info-wrapper" key={e._id} onClick={() =>this.onGoProfile(e._id) }>
                                        <UserAvatar
                                            imgUserType={e.role}
                                            imgUser={e.avatar}
                                            userId={e._id}
                                            size={50}
                                            />
                                        <span className="label-name">{e.companyName || e.firstName + ' ' + e.lastName}</span>
                                    </div>)
                            }) }
                        </div>
                    }
                    { showSearchDialog && searchType !== PROJECT_SEARCH && searchResults.user.length !== 0 &&  <div className="view-all"  onClick={onClickAllSearch(PEOPLE_SEARCH)}>View All</div> }
                    { showSearchDialog && searchType !== PEOPLE_SEARCH && searchResults.project.length !== 0 && <div className="group-label">Projects</div> }
                    { showSearchDialog && searchType !== PEOPLE_SEARCH && searchResults.project.length !== 0 && 
                        <div className="search-project-list">
                            { searchResults.project.map((e, i) => {
                                return (
                                    <div className="info-wrapper" key={e._id} onClick={() => this.onGoProject(e.user._id, e._id)}>
                                    <UserAvatar
                                        imgUserType={e.user.role}
                                        imgUser={e.user.avatar}
                                        userId={e.user._id}
                                        size={50}
                                        />
                                    <span className="label-name">{e.title}</span>
                                </div>)
                            }) }
                        </div>
                    }
                    { showSearchDialog && searchType !== PEOPLE_SEARCH && searchResults.project.length !== 0 && <div className="view-all"  onClick={onClickAllSearch(PROJECT_SEARCH)}>View All</div> }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    searchResults: state.search.searchResults
})

const mapDispatchToProps = {
    clearSearchByType,
    push
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)