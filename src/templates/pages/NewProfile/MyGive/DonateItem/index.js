import React, { Component } from 'react';
import moment from 'moment';

import Card from '../../../../common/Card';

class DonateItem extends Component {

    state = {
    }
        
    render() {
        const { donation } = this.props;

        return (
            <section className='donate-item-card'>
                <Card className="donate-form">
                    <div className='donate-type'>
                        <p>Donate Type: { donation.generalDonation === 0 ? 'Project Donation' : 'General Donation' }</p>
                        <p>Donate Amount: ${ donation.amount }</p>
                        <p>Donate Time: { moment.unix(donation.createdAt).format('M/D/YYYY') }</p>
                    </div>
                </Card>
            </section>
        )
    }
}

export default DonateItem