import React, { Component } from 'react';

class HintModal extends Component {
    
    closeModal = (e) => {
		if (e.target.className && (
                ( e.target.className.includes('modal') && e.target.className.includes('open') ) || e.target.className.includes('closeBtn')
            )) {
			this.props.closeModal();
		}
    }
    
    render() {
        const { isShow } = this.props;

        return (
            <section title='' className={`hint-modal ${isShow ? 'show' : 'hidden'}`}>
                <div className="panel-body">
                    <p>
                        Available funds are sent out every Monday. <span className='contact-support'>Conact Support</span> for any questions.
                    </p>
                </div>
            </section>
        );
    }

}

export default HintModal