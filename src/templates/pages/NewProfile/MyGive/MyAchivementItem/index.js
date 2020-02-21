import React, { Component } from 'react';

export default class RecuringItem extends Component {

    render() {
        const { type, point, amount, status } = this.props;

        return (
            <section className={`my-achivement-card ${((type !== "donation" && status === 1) || (type === "donation")) ? "active" : ""}`}>
                <div className="icon">
                    { ((type !== "donation" && status === 1) || (type === "donation")) &&
                        <img src="/images/ui-icon/profile/point-star-icon.svg" alt="point-star-icon" />
                    }
                    { (type !== "donation" && status !== 1) && 
                        <img src="/images/ui-icon/profile/point-star-icon-disabled.svg" alt="point-star-icon" />
                    }
                    <div>
                        <p className="pointVal">{point}</p>
                    </div>
                </div>
                <div className="info">
                    { type === "donation" && 
                        <div>
                            <p className={`title ${((type !== "donation" && status === 1) || (type === "donation")) ? "active" : ""}`}>Donation</p>
                            <p className="desc">Donate ${amount} to a nonprofit</p>
                        </div>
                    }
                    { type === "volunteer" &&
                        <div>
                            <p className={`title ${((type !== "donation" && status === 1) || (type === "donation")) ? "active" : ""}`}>Volunteer Request</p>
                            <p className="desc">Sign up for a volunteer event</p>
                        </div>
                    }
                    { type === "pickup" &&
                        <div>
                            <p className={`title ${((type !== "donation" && status === 1) || (type === "donation")) ? "active" : ""}`}>Pickup Request</p>
                            <p className="desc">Set up a pickup request</p>
                        </div>
                    }
                </div>
                <div className="point">
                    <p className={`${((type !== "donation" && status === 1) || (type === "donation")) ? "active" : ""}`}>{point}pt</p>
                </div>
            </section>
        )
    }
}