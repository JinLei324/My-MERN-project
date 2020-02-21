import React, { Component } from 'react'
import newId from '../../../helpers/newId'

class InputFile extends Component {
	state = {
		count: 0,
		filename: ''
	}

	componentWillMount() {
		this.id = newId('inputfile')
	}

	componentDidMount() {
		this.props.onRef(this)
	}

	componentWillUnmount() {
		this.props.onRef(undefined)
	}

	clear() {
		const inputfile = document.getElementById(this.id)
		inputfile.value = ''
		this.setState({ count: 0, filename: '' })
	}

	onChange = e => {
		let files = e.target.files

		if (files) {
			let count = files.length
			let filename = e.target.value.split( '\\' ).pop()
			if (files.length === 0)
				files = null
			this.setState({ count, filename })
		}
		else {
			this.setState({ count: 0, filename: '' })
		}

		if (files && files.length > 1)
			this.setState({ count: files.length })
		else {
			this.setState({ count: 0, filename: e.target.value.split( '\\' ).pop() })
		}

		this.props.onChange && this.props.onChange(files)
	}

	render() {
		let { count, filename } = this.state
		let { multiple, accept } = this.props
		if (!multiple) multiple = false
		if (!accept) accept=''

		return (
			<div className="inputFileWrapper main-font">
				<input type="file" name={this.id} id={this.id} className="inputfile" multiple={multiple} onChange={this.onChange} accept={accept} />
				<label htmlFor={this.id}>
				{count > 1 ?
					<span>{count} files selected</span> :
					<span>{filename}</span>
				}
				<strong>Choose a file&hellip;</strong></label>
			</div>
		)
	}
}

export default InputFile