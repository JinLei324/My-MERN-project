import React, { Component } from 'react'
import { connect } from 'react-redux'
import { toggleNotification } from '../../../../actions/notificationActions'
import Textarea from 'react-textarea-autosize'

class ProjectDescription extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: this.props.title || '',
			description: this.props.description || '',
			file: null,
			urlData: this.props.urlData || ''
		}
		this.previewRef = React.createRef()
	}

	inputHelper = key => ({ target }) =>
		this.setState({ [key]: target.value }, () => {
			this.props.getData &&
				this.props.getData({
					title: this.state.title,
					description: this.state.description,
					file: this.state.file
				})
		})

	changeFile = e => {
		if(e.target.files.length === 0)
			return;
		if (
			e.target.files[0].type !== 'image/jpeg' &&
			e.target.files[0].type !== 'image/png'
		) {
			this.props.dispatch(
				toggleNotification({
					isOpen: true,
					resend: false,
					firstTitle: 'Error',
					secondTitle: 'You can only upload image files',
					buttonText: 'Ok'
				})
			)
		} else {
			if (
				e.target.files[0] &&
				e.target.files[0].size / 1024 / 1024 <= 10
			) {
				this.setState({ file: e.target.files[0] })
				this.props.getData &&
					this.props.getData({
						file: e.target.files[0]
					})
				if (e.target.files[0]) {
					let reader = new FileReader()
					reader.onload = event => {
						this.setState({ urlData: event.target.result })
					}
					reader.readAsDataURL(e.target.files[0])
				} else {
					this.setState({ urlData: null })
				}
			} else {
				this.props.dispatch(
					toggleNotification({
						isOpen: true,
						resend: false,
						firstTitle: 'Error',
						secondTitle: 'Photo should be up to 10mb',
						buttonText: 'Ok'
					})
				)
			}
		}
	}

	openSelectFile = () => {
		this.previewRef.current.click()
	}

	render() {
		const { title, description, file, urlData } = this.state
		const { disabled } = this.props

		return (
			<div className="project-information">
				<div
					className="file-wrapper image-action animation-click-effect"
					onClick={this.openSelectFile}>
					<img
						src={
							urlData
								? urlData
								: '/images/ui-icon/mini-images.svg'
						}
						atl="img-icon"
						className={`icon ${file || urlData ? 'full' : 'fix'}`}
						alt="icon"
					/>
					{file || urlData ? (
						''
					) : (
						<span className="main-font text">
							Upload Cover Photo
						</span>
					)}
					<input
						type="file"
						ref={this.previewRef}
						onChange={this.changeFile}
						accept="image/*"
						id="projectFileCreate"
						disabled={disabled}
					/>
					<span className="globalErrorHandler" />
				</div>
				<div className="separator-25" />
				<div className="title-input">
					<span className="label main-font">Project Title:</span>
					<input
						className="main-font control"
						type="text"
						id="projectTitleCreate"
						placeholder="Project Title"
						onChange={this.inputHelper('title')}
						value={title}
						disabled={disabled}
					/>
					<span className="globalErrorHandler" />
				</div>
				<div className="separator-25" />
				<div className="description-input">
					<span className="label main-font">
						Project description:
					</span>
					<Textarea
						className="main-font control description"
						defaultValue={description}
						style={{ minHeight: 48 }}
						placeholder="Describe your project here"
						id="projectDescriptionCreate"
						onChange={this.inputHelper('description')}
						disabled={disabled}
					/>
					<span className="globalErrorHandler" />
				</div>
			</div>
		)
	}
}

export default connect()(ProjectDescription)
