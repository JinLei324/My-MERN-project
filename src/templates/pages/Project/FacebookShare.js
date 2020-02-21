import React, { Component } from "react";
// import PropTypes from "prop-types";
// import Helmet from "react-helmet";

class FacebookShare extends Component {
  
    state = {
        // facebookAppId: '501839739845103',
        facebookAppId: '2471452612875140',
        title: "nonprofit's donation project - 0726 - 1",
        description: "Description : nonprofit's donation project - 0726 - 1",
        url: 'https://onegivv.com/5cf6d45cc58baa3a418e963f/project/5d1a144efb7ec209772f0e91',
        image: 'https://onebenefactor-image-bucket-staging.s3.amazonaws.com/2c02db230c70df08ddf50b5f3fd283e8.jpg'
    }

    componentDidMount() {
        document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
    }

    initializeFacebookLogin = () => {
        this.FB = window.FB;
        this.checkLoginStatus();
    }

    checkLoginStatus = () => {
        this.FB.getLoginStatus(this.facebookLoginHandler);
    }

    facebookLogin = () => {
        if (!this.FB) {
            return;
        }
    
        this.FB.ui({
            method: 'share_open_graph',
            action_type: 'og.likes',
            action_properties: JSON.stringify({
              object: {
                'og:url': 'https://onegivv.com/5cf6d45cc58baa3a418e963f/project/5d1a144efb7ec209772f0e91',
                'og:title': "nonprofit's donation project - 0726 - 1",
                'og:description': "Description : nonprofit's donation project - 0726 - 1",
                'og:image': 'https://onebenefactor-image-bucket-staging.s3.amazonaws.com/2c02db230c70df08ddf50b5f3fd283e8.jpg'
              }
            })
        },
        function (response) {
        });

        // this.FB.getLoginStatus(response => {
        //     if (response.status === 'connected') {
        //         this.facebookLoginHandler(response);
        //     } else {
        //         this.FB.login(this.facebookLoginHandler, {scope: 'public_profile'});
        //     }
        // }, );
    }

    facebookLoginHandler = response => {
        if (response.status === 'connected') {
          this.FB.api('/me', userData => {
          });
        } else {
        }
    }

    render() {
        let { children } = this.props;
        return (
            <div className='facebook-share' onClick={this.facebookLogin}>
                { children }
            </div>
        );
    }

};

export default FacebookShare;