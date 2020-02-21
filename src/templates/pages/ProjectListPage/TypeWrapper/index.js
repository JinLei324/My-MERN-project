import React, { Component } from 'react';

//import Card from '../../../common/Card';

class TypeWrapper extends Component {

    render() {
        const { user, isDiscoverPage, projectTypes, donorProjectTypes, inputHelper, activeType } = this.props;

        return (
            <div className="typeWrapper" padding="0">
                { user && !isDiscoverPage && projectTypes.map((e, i) =>
                    <div
                        key={`type-${i}`}
                        className={`wrapper ${activeType === e.index && 'active'} ${e.index === -1 && 'hint-all'}`}
                        onClick={inputHelper('activeType', e.index)}>
                        <span className="label">{e.label}</span>
                    </div>
                )}
                { isDiscoverPage && donorProjectTypes.map((e, i) =>
                    <div
                        key={`type-${i}`}
                        className={`wrapper ${activeType ===
                            e.index && 'active'}`}
                        onClick={inputHelper('activeType', e.index)}>
                        <span className="label">{e.label}</span>
                    </div>
                )}
            </div>
        )
    }

}

export default TypeWrapper;