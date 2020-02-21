import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../Button';

import { getAllCategories } from '../../../actions/global';

class CategoriesWrapper extends Component {

    state = {
		allCategories: [],
		categories: []
    }

    constructor(props) {
        super(props);

        this.onClickCategoryButton = this.onClickCategoryButton.bind(this);
        this.onClickMore = this.onClickMore.bind(this);
        this.onClickApply = this.onClickApply.bind(this);
    }
    
    componentDidMount() {
		this.props.getAllCategories();
    }
    
    componentWillReceiveProps(nextProps) {
        let allCategories = [];
        if (this.state.allCategories !== nextProps.allCategories) {
            allCategories = nextProps.allCategories.map(e => {
                return {
                    value: e._id,
                    label: e.title,
                    checked: (typeof e.checked === 'undefined' || e.checked === false) ? false : true
                }
            });
        }
		
        let categories = allCategories.slice(0, allCategories.length > 5 ? 5 : allCategories.length);
        this.setState({
            allCategories: allCategories,
            categories: categories
        });
    }
    
    onClickCategoryButton = categoryId => e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
            
        let { categories } = this.state;
        categories = categories.map((e, i) => {
            if (e.value === categoryId) {
                return { ...e, checked: !e.checked };
            } else {
                return { ...e };
            }
        });
        this.setState({
            categories: categories
        }, () => {
            let selectedInterestIds = [];
            categories.map(e => {
                if (e.checked) {
                    selectedInterestIds.push(e);
                }
                return { ...e };
            });
            this.props.onCategoryCheckedChanged(selectedInterestIds);
        });
    }

    onClickMore = e => {
        if (e)
            e.stopPropagation();
        
        let { allCategories, categories } = this.state;
        if (categories.length === allCategories.length)
            return;

        let newCategories = categories.concat(allCategories.slice(categories.length, allCategories.length > categories.length + 5 ? categories.length + 5 : allCategories.length ));
        this.setState({
            categories: newCategories
        });
    }

    onClickApply = e => {
        this.props.onSearchCharity();
    }

    render() {
        let { categories } = this.state;
        let { isFilterOpened } = this.props

        return (
            <div className={ `categoryWrapper ${ isFilterOpened ? 'd-block' : 'd-none' }` }>
                <div className="categoryWrapperCard">
                    <div className="categoryHeader"><h3 className="main-font">Categories</h3></div>
                    <div className="categoryList">
                        { categories && categories.length > 0 && categories.map((e, i) => (
                            <Button
                                key={e.value}
                                className={`categoryBtn ${e.checked ? "checked" : ""}`}
                                padding="4px 10px"
                                label={e.label}
                                fontSize="12px"
                                onClick={this.onClickCategoryButton(e.value)}
                            />
                        )) }
                    </div>
                    <p className="moreCaption" onClick={this.onClickMore}>More...</p>
                    <div className="filter" align="center">
						<button className="btn-invite" onClick={this.onClickApply}>Apply</button>							
					</div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = state => ({
    allCategories: state.globalReducer.categories
})

const mapDispatchToProps = {
	getAllCategories
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CategoriesWrapper)