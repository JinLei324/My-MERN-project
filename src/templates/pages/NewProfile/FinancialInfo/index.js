import React, { Component } from 'react';

import Card from '../../../common/Card';

class FinancialInfo extends Component {

    render() {
        const { user } = this.props;

        return (
            <Card padding="0px" className="financialInfoCard">
                <div className="financialInfoBody">
                    <div className="titleBody">
                        <p className="caption">Financials</p>
                        <p className="value">
                            Annual Budget:
                            <span>${user.anualBudget}</span>
                        </p>
                    </div>
                    <div className="subInfo">
                        <div className="summary">
                            <p className="summaryCaption">Program Spend</p>
                            <p className="percent">{ user.programSpend }%</p>
                        </div>
                        <div className="flexWrapper">
                            <div className="progressBar">
                                <div className="progressWrapper">
                                    <div className="progress">
                                        <div className="progressContain"
                                            style={{
                                                width: `${
                                                    user.programSpend > 100
                                                        ? 100
                                                        : user.programSpend
                                                }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="subInfo">
                        <div className="summary">
                            <p className="summaryCaption">Fundraising Spend</p>
                            <p className="percent">{ user.fundrasingSpend }%</p>
                        </div>
                        <div className="flexWrapper">
                            <div className="progressBar">
                                <div className="progressWrapper">
                                    <div className="progress">
                                        <div className="progressContain"
                                            style={{
                                                width: `${
                                                    user.fundrasingSpend > 100
                                                        ? 100
                                                        : user.fundrasingSpend
                                                }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="subInfo managementSpend">
                        <div className="summary">
                            <p className="summaryCaption">Management Spend</p>
                            <p className="percent">{ user.managementSpend }%</p>
                        </div>
                        <div className="flexWrapper">
                            <div className="progressBar">
                                <div className="progressWrapper">
                                    <div className="progress">
                                        <div className="progressContain"
                                            style={{
                                                width: `${
                                                    user.managementSpend > 100
                                                        ? 100
                                                        : user.managementSpend
                                                }%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    { user && user.programs && user.programs.length > 0 && user.programs.map((e, i) => (
                        <div key={i} className="programSection">
                            <p className="title">Program { i + 1 }</p>
                            <div className="subInfo">
                                <p className="subTitle">{ e.title }</p>
                                <p className="description">{ e.description }</p>
                            </div>
                        </div>
                    )) }
                </div>
            </Card>
        )
    }

}

export default FinancialInfo