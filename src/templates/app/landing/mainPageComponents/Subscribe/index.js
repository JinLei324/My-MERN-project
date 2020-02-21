import React, { Component } from 'react';

class Subscribe extends Component {

    render() {
        return (
            <section className="subscribeSection">
                <div className="subscribePanel">
                    <p className="caption">Subscribe to our newsletter</p>
                    <div className="inputBody">
                        <input className="email" type="text" placeholder="Email@onegivv.com" />                        
                        <button className="subscribeBtn">SUBSCRIBE</button>
                    </div>
                </div>
                {/* <div className="mobile-subscribe">
                    <span style={{ marginTop: '27px', color: '#fff', fontSize: '22px', lineHeight: '26px' }}>Subscribe to our newsletter</span>
                    <div style={{
                        width: '326px',
                        height: '47px',
                        backgroundColor: 'white',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <input type="text" placeholder="Email@onegivv.com" style={{ fontSize: '14px', border: 'none', fontWeight: 'bold', textAlign: 'center' }} />
                    </div>
                    <button style={{
                        marginTop: '15px',
                        marginBottom: '21px',
                        background: '#fff',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                        border: '1px solid #FFFFFF',
                        boxSizing: 'border-box',
                        borderRadius: '8px',
                        color: '#1AAAFF',
                        padding: '6px 21px',
                        fontSize: '14px',
                        lineHeight: '16px'
                    }}>
                        SUBSCRIBE
                    </button>
                </div> */}
            </section>
        )
    }

}

export default Subscribe;