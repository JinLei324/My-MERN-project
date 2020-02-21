import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    getSearchByType,
    clearSearchByType  
} from '../../../../../actions/search'
import Modal from '../../../../common/Modal';
import Button from '../../../../common/Button';
import Search from '../../../../pages/search'

const ALL_SEARCH = 0;

class ModalSearch extends Component {

    state = {
        search: "",
        limit: 4,
        skip: 0,
        searchType: ALL_SEARCH
    }

    getData = () => {
		this.props.getSearchByType({
            type: this.state.searchType,
            skip: 0,
            // limit: this.state.limit,
            limit: -1,
            search: this.state.search
        })
    }
    
    componentDidMount() {
        this.setState({search: this.props.search}, () => {
            this.getData()
        })
    }

    componentWillUnmount(){
        this.props.clearSearchByType()
    }

    onClickSearch = e => {
        this.props.history.push('/m-search');
        // this.setState({skip:0, limit: 10, searchType: ALL_SEARCH}, () => {
        //     this.getData()
        // })
    }

    inputHelper = key => e => this.setState({ [key]: e.target.value })
    
    onClickAllSearch = type => (e) => {
        e.stopPropagation();
        this.setState({limit: -1, searchType: type}, () => {
            this.getData()
        })
    }

    render() {
        const { search, searchType } = this.state
        const { showModal, closeModal, width } = this.props
        return(
            <Modal showModal={showModal} closeModal={closeModal} className="modal-search" width={width}>
                <div className="searchWrapper">
                    <div className="searchBox">
                        <input type="text" placeholder="Search for Nonprofits..." value={search} onChange={this.inputHelper("search")}/>
                        <Button padding="8px 24px" label="Search" className="button-submit" onClick={this.onClickSearch}/>
                    </div>
                </div>
                <Search onClickAllSearch={this.onClickAllSearch} searchType={searchType}/>
            </Modal>
        )
    }

}

const mapStateToProps = state => ({
    searchResults: state.search.searchResults
})

const mapDispatchToProps = {
    getSearchByType,
    clearSearchByType
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ModalSearch)