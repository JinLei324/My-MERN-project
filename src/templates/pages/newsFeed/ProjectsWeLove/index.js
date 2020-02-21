import React, { Component } from 'react';
import { connect } from 'react-redux';

import Slider from 'react-slick';
import NumberFormat from 'react-number-format';

import { PICKUP, DONATION, VOLUNTEER } from '../../../../helpers/projectTypes';

const NextArrow = props => {
    const { className, style, onClick } = props;
    
	return (
		<div
			className={className}
			style={{ ...style, width: 27, height: 27, backgroundImage: "url(/images/ui-icon/post/arrow-right-64.png)" }}
			onClick={onClick}
		/>
	);
}

const PrevArrow = props => {
	const { className, style, onClick } = props;
	return (
		<div
			className={className}
			style={{ ...style, width: 27, height: 27, backgroundImage: "url(/images/ui-icon/post/arrow-left-64.png)" }}
			onClick={onClick}
		/>
	);
}

class ProjectsWeLove extends Component {
    
    state = {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
    
    render() {
        const slickSettings = {
			dots: false,
			arrows: true,
			infinite: false,
            slidesToShow: 2,
            slidesToScroll: 1,
			// centerMode: false,
			// centerPadding: '0px',
			nextArrow: <NextArrow />,
			prevArrow: <PrevArrow />,
			responsive: [{
				breakpoint: 769,
				settings: {
					centerPadding: '100px',
				}
			}, {
				breakpoint: 425,
				settings: {
					centerPadding: '75px',
				}
			}, {
				breakpoint: 350,
				settings: {
					centerPadding: '45px',
				}
			}]
        };

        const { projectList, onSelectProject } = this.props;
        
        let filteredProjectList = projectList.filter(e => {
            if (e.isEnd || e.isCancel || e.isTurnedOff)
                return false;
            return true;
        });

        return (
            <section className="projectsWeLove">
                <p className="title">Projects We Love</p>
                <Slider {...slickSettings} className="slider">
                    { filteredProjectList && filteredProjectList.length > 0 && filteredProjectList.map((e, i) => {
                        return (
                            <div className="sliderBox" key={e._id} onClick={() => { onSelectProject(e) }}>
                                <div className="boxContent">
                                    <div className="projectMiniCard">
                                        <div className="cardBody">
					                        <div className="cardHeader">
                                            </div>
                                            <div className="coverImg">
                                                { e.coverThumb && <img src={e.coverThumb} className="preview" alt="" /> }
                                                { !e.coverThumb && <img src="/images/temp_project.jpg" className="preview" alt="" /> }
                                            </div>
                                            <div className="cardContent">
                                                <p className="title">{e.title}</p>
                                                <p className="description">{e.description}</p>
                                                <div className="activityWrapper">
                                                    <div className="clickedPart">
                                                        <div className="flexWrapper">
                                                            <div className="progressBar">
                                                                <div className="progressWrapper">
                                                                    <div className="values">
                                                                        <span className="current">
                                                                            { (e.projectType === DONATION || e.projectType === PICKUP) ? 
                                                                                <NumberFormat value={e.money.current} displayType={'text'} thousandSeparator={true} prefix={'$'} /> :
                                                                                <NumberFormat value={e.money.current} displayType={'text'} thousandSeparator={true} prefix={''} />
                                                                            }
                                                                        </span>
                                                                        <span className="of text-right">
                                                                            { (e.projectType === DONATION || e.projectType === PICKUP) ? 
                                                                                <NumberFormat value={e.money.total} displayType={'text'} thousandSeparator={true} prefix={'$'} /> :
                                                                                <NumberFormat value={e.money.total} displayType={'text'} thousandSeparator={true} prefix={''} />
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="label">
                                                                        <span className="current">
                                                                            { e.projectType === PICKUP && 'Pickups' }
                                                                            { e.projectType === DONATION && 'Donations' }
                                                                            { e.projectType === VOLUNTEER && 'Volunteers' }
                                                                        </span>
                                                                        <span className="of text-right">Goal</span>
                                                                    </div>
                                                                    <div className="progress">
                                                                        <div
                                                                            className="progressContain"
                                                                            style = {{
                                                                                width: `${
                                                                                    (e.money.current / e.money.total) * 100 > 100
                                                                                        ? 100
                                                                                        : (e.money.current / e.money.total) * 100
                                                                                }%`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    } ) }
                </Slider>
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
)(ProjectsWeLove)