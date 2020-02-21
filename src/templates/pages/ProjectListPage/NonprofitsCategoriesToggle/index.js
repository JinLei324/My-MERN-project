import React, { Component } from 'react';

import Button from '../../../common/Button';

class NonprofitsCategoriesToggle extends Component {

    render() {
        const { onClickNonprofits, onClickCategories, activeType } = this.props;

        return (
            <div className={`nonprofitsCategoriesSection ${activeType === -1 ? 'd-flex' : ''}`}>
                <Button
                    className="nonprofitsBtn"
                    padding="15px 20px"
                    label="Nonprofits We Love"
                    fontSize="14px"
                    onClick={onClickNonprofits}
                />
                <div className="span"></div>
                <Button
                    className="categoriesBtn"
                    padding="15px 20px"
                    label="Categories"
                    fontSize="14px"
                    onClick={onClickCategories}
                />
            </div>
        )
    }

}

export default NonprofitsCategoriesToggle;