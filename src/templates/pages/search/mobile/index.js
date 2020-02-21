import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {  getSearchByType, clearSearchByType } from '../../../../actions/search';

import IconButton from '../../../common/IconButton';
import Search from '../index';
import SearchLanding from './SearchLanding';

const ALL_SEARCH = 0;

class MobileSearch extends Component {
    
    state = {
        search: "",
        limit: 4,
        skip: 0,
        searchType: ALL_SEARCH
    }

    constructor(props) {
        super(props);
        
        this.searchInput = React.createRef();
    }

    getData = () => {
		this.props.getSearchByType({
            type: this.state.searchType,
            skip: 0,
            limit: -1,
            search: this.state.search
        });
    }
    
    componentDidMount() {
        setTimeout(() => {
            this.searchInput && this.searchInput.current && this.searchInput.current.focus();
        }, 100)
    }

    componentWillUnmount(){
        this.props.clearSearchByType();
    }

    onClickClose = e => {
        this.props.history.goBack();
    }

    onClickSearch = e => {
        this.setState({skip:0, limit: 10, searchType: ALL_SEARCH}, () => {
            this.getData();
        })
    }

    inputHelper = key => e => {
        this.setState({
            [key]: e.target.value
        }, () => {
            this.getData();
        });
    }
    
    onClickAllSearch = type => (e) => {
        e.stopPropagation();
        this.setState({limit: -1, searchType: type}, () => {
            this.getData();
        })
    }

    onKeyDownSearch = e => {
        if (e.keyCode === 13) {
            this.onClickSearch(null);
        }
    }
    
    render() {
        const { search, searchType } = this.state;
        return (
            <section className="modal-search mobile">
                <div className="close-wrapper">
                    <span className="close-btn" onClick={this.onClickClose}></span>
                </div>
                <div className="search-wrapper">
                    <div className="searchBox">
                        <input type="text" autoFocus  ref={this.searchInput} placeholder="Search..." value={search} onChange={this.inputHelper("search")} onKeyDown={this.onKeyDownSearch} />
                        <IconButton icon="/images/ui-icon/icon-search.svg" size="16px" fontSize="14px" onClick={this.onClickSearch} />
                    </div>
                </div>
                <Search onClickAllSearch={this.onClickAllSearch} searchType={searchType} />
                <SearchLanding />
            </section>
        )
    }
}

const mapStateToProps = state => ({
    searchResults: state.search.searchResults
})

const mapDispatchToProps = {
    getSearchByType,
    clearSearchByType,
    push
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MobileSearch)