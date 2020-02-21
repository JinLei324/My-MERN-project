import React, { Component } from 'react';
import { connect } from 'react-redux';

import Card from '../../../common/Card';

class MissionForm extends Component {

    render() {
        const { user } = this.props;

        return (
            <section className="missionFormSection">
                <Card className="missionForm" padding="42px 25px">
                    <div className="overview">
                        <p className="title">Our mission</p>
						<p className="description">{ user.aboutUs }</p>
                    </div>
                </Card>
            </section>
        )
    }

}

const mapStateToProps = state => ({
})

const mapDispatchToProps = {
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MissionForm)