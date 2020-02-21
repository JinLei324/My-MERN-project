import React, { Component } from 'react'
import AvatarEditor from 'react-avatar-editor'
import Button from '../../../Button'

class MyEditor extends Component {
	state = {
		scale: 1
	}

	changeScale = e => {
		this.setState({ scale: +e.target.value })
	}

	onClickSave = e => {
		e.preventDefault()
		if (this.editor) {
            const canvas = this.editor.getImage().toDataURL()
            fetch(canvas)
				.then(res => {
                    return res.blob()
                })
				.then(blob => {
					let file = new File([blob], 'img.png', {
						type: 'image/png'
					})
					this.props.closeCropper(
						window.URL.createObjectURL(blob),
						file
					)
				})
		}
	}

	setEditorRef = editor => (this.editor = editor)

	render() {
		const { scale } = this.state
		const { imageUrl } = this.props

		return (
			<div className={`MyEditor`}>
				<h3>Avatar settings</h3>
				<img
					src="/images/ui-icon/border_for_cropper.svg"
					alt=""
					className="absoluteBorderForCropper"
				/>
				<AvatarEditor
					image={imageUrl}
					ref={this.setEditorRef}
					width={250}
					height={250}
					border={48}
					borderRadius={150}
					color={[255, 255, 255, 0.5]}
					scale={scale}
					rotate={0}
				/>
				<input
					value={scale}
					onChange={this.changeScale}
					type="range"
					min="1"
					max="2"
					step="0.1"
				/>
				<Button
					onClick={this.onClickSave}
					padding="12px 18px"
					className="submitPhotoEdit"
					label="Submit"
				/>
			</div>
		)
	}
}

export default MyEditor
