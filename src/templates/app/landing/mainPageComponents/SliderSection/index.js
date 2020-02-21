import React, { Component } from 'react';

import BackgroundSlider from 'react-background-slider';

class SliderSection extends Component {

    render() {
        return (
            <div className="sliderSection">
                <BackgroundSlider
                    images={[
                        "/images/ui-icon/landing/slider/slider-1.jpg",
                        "/images/ui-icon/landing/slider/slider-2.jpg",
                        "/images/ui-icon/landing/slider/slider-3.jpg",
                        "/images/ui-icon/landing/slider/slider-4.jpg",
                        "/images/ui-icon/landing/slider/slider-5.jpg",
                        "/images/ui-icon/landing/slider/slider-6.jpg",
                        "/images/ui-icon/landing/slider/slider-7.jpg"
                    ]}
                    duration={8}
                    transition={2}
                />
                <div className="gradientOverlay"></div>
            </div>
        )
    }

}

export default SliderSection;