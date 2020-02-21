import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { history } from '../../../../../store';

import { signIn } from '../../../../common/authModals/modalTypes';
import Modal from '../../../../common/Modal';

class NewFooter extends Component {

    state = {
        email: '',
        showSubscribeMessage: false
    }

    submitForm = e => {
        if (e)
            e.preventDefault();

        let { email } = this.state;
        if (email === '')
            return;

        this.setState({
            showSubscribeMessage: true
        });
    }

    emailChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	}

    render() {
        let { email, showSubscribeMessage } = this.state;

        return (
            <footer className="footer" id="contacts">
                <Modal
                    className="zeroBorderRadius"
                    showModal={showSubscribeMessage}
                    closeModal={() => this.setState({showSubscribeMessage: false})}
                    title="You're subscribed!" />
                <div className="footer-top">
                    <div className="footer-logo">
                        <img src="/images/ui-icon/logo.png" alt="logo" />
                    </div>
                </div>
                <div className="cn footer-middle">
                    <div className="footer-nav">
                        <div className="footer-nav-learn">
                            <h3 className="footer__title" onClick={() => history.push(`/learn`)}>Learn more</h3>
                            <NavLink to={`/about`} onClick={e => e.stopPropagation()} className="footer-nav--link" href="#">About Us</NavLink>
                            <p className="footer-nav--link" onClick={e => window.Intercom('showNewMessage')}>Contact</p>
                        </div>
                        <div className="footer-nav-company">
                            <h3 className="footer__title">Company</h3>
                            <p className="footer-nav--link" href="#">How it works</p>
                            <p className="footer-nav--link" onClick={e => history.push(`?modal=${signIn}`)}>Log in</p>
                        </div>
                        <div className="footer-nav-legal">
                            <h3 className="footer__title">Legal</h3>
                            <a className="footer-nav--link" href="https://s3.amazonaws.com/onegivv-common/Privacy+Policy+(OneGivv).pdf" target="_blank" rel="noopener noreferrer">
                                Privacy
                            </a>
                            <a className="footer-nav--link" href="https://s3.amazonaws.com/onegivv-common/User+Agreement+(Donors)+-+OneGivv.pdf" target="_blank" rel="noopener noreferrer">
                                Terms
                            </a>
                        </div>
                    </div>
                    <div className="footer-subscribe">
                        <h3 className="footer__title">Subscribe to our newsletter</h3>

                        <form className="form form-subscribe" onSubmit={this.submitForm}>
                            <label className="form__label">
                                <input
                                    id="email"
                                    className="form__control"
                                    type="text"
                                    name="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={this.emailChange}
                                />
                            </label>
                            <input className="btn btn--blue" type="submit" value="Subscribe" />
                        </form>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="cn">
                        <div className="footer-copy">
                            &copy;Copyright 2019 OneGivv
                        </div>
                    </div>
                </div>
            </footer>
        )
    }

}

export default NewFooter