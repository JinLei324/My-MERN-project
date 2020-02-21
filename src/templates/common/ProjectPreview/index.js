import React, { Component } from 'react';
import ProgressiveImage from 'react-progressive-image';

import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes';

export default class ProjectPreview extends Component {

	controller = new AbortController();

	selectType = (type) => {
		switch (type) {
			case VOLUNTEER:
				return 'volunteer.svg'
			case DONATION:
				return 'money.svg'
			case PICKUP:
				return 'pink-up.svg'
			default:
				return ''
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
		this.controller.abort();
	}

	render() {
		let { isDetailPage, previewUrl, previewThumbUrl, type, titleOnImage, title, openDetail } = this.props
		
		return (
			<section className="project-preview">
				<div className="project-cover">
					{ isDetailPage && <ProgressiveImage
						delay = { 2000 }
						src = { previewUrl }
						placeholder = { previewThumbUrl }
						>
						{src => <img src={src} className="preview" alt='' />}
					</ProgressiveImage> }
					{ !isDetailPage && <img src={previewThumbUrl} className="preview" alt='' /> }
				</div>
				{ (type === VOLUNTEER || type === DONATION || type === PICKUP) &&
					<div
						className={`type-project type-${type}`} onClick={openDetail}>
						<img
							className="type"
							src={`/images/ui-icon/${this.selectType(
								type
							)}`}
							alt="type"
						/>
					</div>
				}
				{ title && (
					<p
						className={`text main-font ${
							titleOnImage ? 'text-float' : 'text-static'
						}`}>
						{title}
					</p>
				) }
				<div className="gradientPreview" />
			</section>
		)
	}
}
