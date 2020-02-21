import React, { Component } from 'react'

const getAnglePoint = (startAngle, endAngle, radius, x, y) => {
	var x1, y1, x2, y2;

	x1 = x + radius * Math.cos(Math.PI * startAngle / 180);
	y1 = y + radius * Math.sin(Math.PI * startAngle / 180);
	x2 = x + radius * Math.cos(Math.PI * endAngle / 180);
	y2 = y + radius * Math.sin(Math.PI * endAngle / 180);

	return { x1, y1, x2, y2 };
}


class Slice extends Component {
	state = {
		path: '',
		x: 0,
		y: 0
	}

	componentDidMount() {
		this.animate();
	}

	animate() {
		this.draw(0);
	}

	draw(s) {
		var p = this.props, path = [], a, b, c, self = this, step;

		step = p.angle / (37.5 / 2);

		if (s + step > p.angle) {
			s = p.angle;
		}

		// Get angle points
		a = getAnglePoint(p.startAngle, p.startAngle + s, p.radius, p.radius, p.radius);
		b = getAnglePoint(p.startAngle, p.startAngle + s, p.radius - p.hole, p.radius, p.radius);

		path.push('M' + a.x1 + ',' + a.y1);
		path.push('A'+ p.radius +','+ p.radius +' 0 '+ (s > 180 ? 1 : 0) +',1 '+ a.x2 + ',' + a.y2);
		path.push('L' + b.x2 + ',' + b.y2);
		path.push('A'+ (p.radius- p.hole) +','+ (p.radius- p.hole) +' 0 '+ (s > 180 ? 1 : 0) +',0 '+ b.x1 + ',' + b.y1);

		// Close
		path.push('Z');

		this.setState({ path: path.join(' ') });

		if (s < p.angle) {
			setTimeout(() => { self.draw(s + step) } , 16);
		} else if (p.showLabel) {
			c = getAnglePoint(p.startAngle, p.startAngle + (p.angle / 2), (p.radius / 2 + p.trueHole / 2), p.radius, p.radius);

			this.setState({
				x: c.x2,
				y: c.y2
			});
		}
	}

	render() {
		const {
			fill,
			stroke,
			strokeWidth,
			showLabel,
			percentValue,
			percent,
			value,
			isGradient
		} = this.props

		const {
			path,
			x,
			y
		} = this.state

		return (
			<g overflow="hidden">
				{isGradient &&
					<defs>
						<linearGradient id={`grad${this.props.index}`} x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor={fill[0]} stopOpacity="100%" />
							<stop offset="100%" stopColor={fill[1]} stopOpacity="100%" />
						</linearGradient>
					</defs>
				}
				<path
					d={ path }
					fill={ isGradient ? `url(#grad${this.props.index})` : fill }
					stroke={ stroke }
					strokeWidth={ strokeWidth ? strokeWidth : 3 }
					 />
				{ showLabel && percentValue > 5 ?
					<text x={ x } y={ y } fill="#fff" textAnchor="middle">
						{ percent ? percentValue + '%' : value }
					</text>
				: null }
			</g>
		);
	}
}

const PieChart = ({data, percent, stroke, strokeWidth, colors, labels, hole, radius, isGradient}) => {
	let colorsLength = colors.length,
		diameter = radius * 2,
		startAngle = -90

	const sum = data.reduce((carry, current) => { return carry + current }, 0);

	return (
		<svg width={ diameter } height={ diameter } viewBox={ '0 0 ' + diameter + ' ' + diameter } xmlns="http://www.w3.org/2000/svg" version="1.1">
			{ data.map((slice, sliceIndex) => {
				let angle, nextAngle, _percent;

				nextAngle = startAngle;
				angle = (slice / sum) * 359.99;
				_percent = (slice / sum) * 99.99;
				startAngle += angle;

				return <Slice
					key={ sliceIndex }
					index={ sliceIndex }
					value={ slice }
					percent={ percent }
					percentValue={ _percent.toFixed(1) }
					startAngle={ nextAngle }
					angle={ angle }
					radius={ radius }
					hole={ radius - hole }
					trueHole={ hole }
					showLabel= { labels }
					fill={ colors[sliceIndex % colorsLength] }
					stroke={ stroke }
					strokeWidth={ strokeWidth }
					isGradient={isGradient}
				/>
			}) }

		</svg>
	)
}

export default PieChart