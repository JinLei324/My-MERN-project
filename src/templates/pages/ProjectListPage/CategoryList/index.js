import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAllCategories, getAllInterests, getHierarchyInterests } from '../../../../actions/global';

class CategoryList extends Component {

    state = {
        selectedCategoryInfo: {},
        showToggleMenu: false,
        toggleMenuPosLeft: 0,
        toggleMenuPosTop: 0
    }

    constructor(props) {
        super(props);

        this.onClickCategory = this.onClickCategory.bind(this);
        this.closeToggleMenu = this.closeToggleMenu.bind(this);
    }

    componentDidMount() {
        this.props.getAllCategories();
    }

    onClickCategory = (categoryInfo) => e => {
        let left = 0, top = 0;
        if (e && e.currentTarget && e.currentTarget.offsetLeft && e.currentTarget.offsetTop && e.currentTarget.clientHeight) {
            left = e.currentTarget.offsetLeft;
            top = e.currentTarget.offsetTop + e.currentTarget.clientHeight;
        }
        
        this.setState({
            showToggleMenu: true,
            toggleMenuPosLeft: left + 'px',
            toggleMenuPosTop: top + 'px',
            selectedCategoryInfo: {
                _id: categoryInfo._id,
                title: categoryInfo.title
            }
        }, () => {
            this.props.getAllInterests({
                parentId: categoryInfo._id
            });
        });
    }

    closeToggleMenu = e => {
        if (e)
            e.stopPropagation();
        
        this.setState({
            showToggleMenu: false
        });
    }

    render() {
        let { showToggleMenu, toggleMenuPosLeft, toggleMenuPosTop, selectedCategoryInfo } = this.state;
        const { categories, interests, onClickEachInterest } = this.props;
        
        if (interests && interests.length > 0 && selectedCategoryInfo._id && selectedCategoryInfo.title) {
            interests.splice(0, 0, selectedCategoryInfo);
        }

        return (
            <section className="categoryListSection">
                <div className="categoryList">
                    { categories && categories.length > 0 && categories.map((category, i) => (
                        <div key={`category_` + category._id} className="eachCategory" onClick={this.onClickCategory(category)}>
                            <img src={category.thumbImage} alt="" />
                            <p>{category.title}</p>
                        </div>
                    )) }
                </div>
                
                <div className={`toggleMenu ${showToggleMenu ? 'open' : ''}`} style={{left: toggleMenuPosLeft, top: toggleMenuPosTop}}>
                    <div className="header text-right" onClick={this.closeToggleMenu}>
                        <img src="/images/ui-icon/discovery/dropdown-icon.svg" alt="dropdown-icon" />
                    </div>
                    { interests && interests.length > 0 && interests.map((interest, i) => (
                        <div key={`interest_` + interest._id} className="submenu">
                            <span className="_label" onClick={onClickEachInterest(selectedCategoryInfo, interest)}>{interest.title}</span>
                        </div>
                    )) }
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => ({
    categories: state.globalReducer.categories,
    interests: state.globalReducer.interests,
    hierarchyInterests: state.globalReducer.hierarchyInterests
})

const mapDispatchToProps = {
    getAllCategories,
    getAllInterests,
    getHierarchyInterests
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CategoryList)