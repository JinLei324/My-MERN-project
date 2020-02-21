import React, { Component } from 'react';

import Button from '../common/Button';

class ScrollToTopComponent extends Component {

	state = {
		scropTopDest: false
	}

	scrollFunc = () => {
		let scropTopDest = window.scrollY >= 200;
		this.setState({ scropTopDest });
	}

	componentDidMount() {
		document.addEventListener('scroll', this.scrollFunc);
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.scrollFunc);
	}

	scrollTop = () => {
		const scrollStep = -window.scrollY / (100 / 15),
		scrollInterval = setInterval(() => {
			if (window.scrollY !== 0) {
				window.scrollBy(0, scrollStep);
			} else {
				clearInterval(scrollInterval);
			}
		}, 15);
	}

	render() {
		let { scropTopDest } = this.state;

		return (
			<div className={`rowForScroll ${scropTopDest ? 'show' : ''}`}>
				<Button
					className={`scrollTotop`}
					inverse={true}
					onClick={this.scrollTop}
					padding="20px"
				/>
			</div>
		)
	}
}

export default ScrollToTopComponent
