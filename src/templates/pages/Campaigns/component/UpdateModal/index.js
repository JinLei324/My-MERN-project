import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../../../../common/Modal';
import Button from '../../../../common/Button';

class UpdateModal extends Component {

	state = {
		projectGo: "",
		peopleNum: 0,
		doBetter: "",
		supportHelp: "",
		LearnAnything: ""
	}

	handleChange = key => target => {
		let value;
		if (key === 'peopleNum' || 
			key === 'projectGo' ||
			key === 'doBetter' ||
			key === 'supportHelp' ||
			key === 'LearnAnything') {
			value = target.target.value;
		}
		this.setState({ [key]: value });
	}

	render() {
		const { projectGo, peopleNum, doBetter, supportHelp, LearnAnything } = this.state;
		const { showUpdateModal, closeUpdateModal, onUpdateComplete } = this.props;

		return (
			<div className="updateModal">
				<Modal title="Update" showModal={showUpdateModal} closeModal={() => { closeUpdateModal(); }}>
					<div className="modalBody">
						<p className="subTitle">Project: Food Drive For The Homeless in Richmond</p>
						<div className="formGroup">
							<p className="caption">How did the project go?(characters remaining: 500)</p>
							<div className="formContent">
								<textarea
									className="longDesc"
									rows="8"
									value={projectGo}
									onChange={this.handleChange("projectGo")}
									placeholder="We love seeing and hearing about all the diffrent Projects that are out there!"
								/>
							</div>
						</div>
						<div className="formGroup">
							<p className="caption">How many people will/did this project help?</p>
							<div className="formContent">
								<input
									type="number"
									className="inputText" 
									value={peopleNum}
									onChange={this.handleChange("peopleNum")}
								/>
							</div>
						</div>
						<div className="formGroup">
							<p className="caption">What can be done better next time?</p>
							<div className="formContent">
								<textarea
									className="longDesc"
									rows="4"
									value={doBetter}
									onChange={this.handleChange("doBetter")}
									placeholder="We love seeing and hearing about all the diffrent projects that are out!"
								/>
							</div>
						</div>
						<div className="formGroup">
							<p className="caption">How can your supports help more next time?</p>
							<div className="formContent">
								<textarea
									className="longDesc"
									rows="4"
									value={supportHelp}
									onChange={this.handleChange("supportHelp")}
									placeholder="We love seeing and hearing about all the diffrent projects that are out!"
								/>
							</div>
						</div>
						<div className="formGroup">
							<p className="caption">Learn anything? Share anything else here!</p>
							<div className="formContent">
								<textarea
									className="longDesc" 
									rows="4" 
									value={LearnAnything} 
									onChange={this.handleChange("LearnAnything")}
									placeholder="We love seeing and hearing about all the diffrent projects that are out!"
								/>
							</div>
						</div>
						<div className="formGroup">
							<Button label="Complete" className="btnComplete" 
								onClick={onUpdateComplete({
									projectGo: projectGo,
									peopleNum: peopleNum, 
									doBetter: doBetter,
									supportHelp: supportHelp,
									LearnAnything: LearnAnything
								})} />
						</div>
					</div>
				</Modal>
			</div>
		)
	}
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(UpdateModal);