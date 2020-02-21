import React, { Component } from 'react'

export default class Input extends Component {
	constructor(props){
		super(props)
		this.inputRef = React.createRef()
	}
	componentDidMount() {
		this.inputRef.current.blur()
	}
	render() {
		const {
			title,
			placeholder,
			error,
			onChangeEvent,
			inputValue,
			inputName,
			isPass,
			className
		} = this.props

		return (
			<div className={`input-wrapper ${className}`}>
				<h5 className="labelForInput">{title}</h5>
				<input
					ref={this.inputRef}
					type={`${isPass ? 'password' : 'text'}`}
					className="settingsInput"
					name={inputName}
					value={inputValue}
					onChange={onChangeEvent}
					placeholder={placeholder}
				/>
				<div className="errorHandler">{error && error}</div>
			</div>
		)
	}
}
