import React, { Component } from 'react'
import moment from 'moment';
import Geocode from 'react-geocode';

import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes'

Geocode.setApiKey(process.env.GEOCODE_API_KEY);

class ProjectDateLocation extends Component {

	state = {
		city: '',
		state: '',
		date: ''
	}

	controller = new AbortController();

	constructor(props) {
		super(props);

		this._isMounted = false;
	}

	componentDidMount() {
		this._isMounted = true;

		this._isMounted && this.initialize();
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.controller.abort();
	}

	initialize = async () => {
        await this.getDateLocation();
    }

	async getDateLocation() {
		const {
            date,
            location,
            type
        } = this.props;

		let todayMoment = moment();
		let dateMoment = moment.unix(date);
		switch (type) {
			case VOLUNTEER:
				if (this._isMounted) this.setState({ date: dateMoment.format('MMM DD') });
				break;
			case DONATION:
			case PICKUP:
				if (this._isMounted) this.setState({ date: (dateMoment.diff(todayMoment, 'days') > 0) ? dateMoment.diff(todayMoment, 'days') + ' DAYS LEFT' : '0 DAYS LEFT' });
				break;
			default:
				break;
		}

		if (location && location.geo && location.geo.length === 2) {
			const lng = location.geo[0].toString(); const lat = location.geo[1].toString();
			if ( (lng === '0' && lat === '0') || (lng === '' && lat === '') ) {
				if (this._isMounted) this.setState({ city: '' }); this.setState({ state: '' });
				return;
			}
			Geocode.fromLatLng(lat, lng).then(
				response => {
					const address_components = response.results[0].address_components;
					for (let i = 0; i < address_components.length; i++) {
						const each_address = address_components[i];
						for (const key in each_address) {
							if (key === 'types') {
								if (each_address[key].includes('locality') && each_address[key].includes('political')) {
									if (this._isMounted) this.setState({ city: each_address.long_name });
								} else if (each_address[key].includes('administrative_area_level_1') && each_address[key].includes('political')) {
									if (this._isMounted) this.setState({ state: each_address.long_name });
								}
							}
						}
					}
				},
				error => {
				  console.log('geocode error!'); console.error(error);
				}
			);
		}
	}

	render() {
		let { date, city, state } = this.state;

		return (
			<section className='project-date-location'>
				<div className='date-section'>
					<img alt='date-icon' src='/images/ui-icon/date.svg' />
					<p>{ date }</p>
				</div>
				<div className='location-section'>
					<img alt='date-icon' src='/images/ui-icon/location.svg' />
					{ city === '' && state === '' && (null) }
					{ city !== '' && state !== '' && (
						<p>{ city }, { state }</p>
					) }
				</div>
			</section>
		)
	}
}

export default ProjectDateLocation