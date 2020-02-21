import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng
} from 'react-places-autocomplete';
import React, { Component } from 'react';

const searchOptions = {
	componentRestrictions: { country: 'us' },
	types: ['address']
}

export default class Autocomplete extends Component {

	state = {
		address: this.props.address,
		viewAddress: this.props.address
	}

	setLocation = address => this.setState({ viewAddress: address })

	selectAddress = address => {
		this.setState({ viewAddress: address })
		this.textInput.blur()
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
				this.props.update &&
					this.props.update({
						location: {
							geo: [lat, lng],
							name: address
						}
					})
			})
	}

	static getDerivedStateFromProps(props, state) {
		if (
			props.inputId === 'projectLocationField' &&
			props.address &&
			document.activeElement.id !== 'projectLocationField'
		) {
			state.address = props.address
			state.viewAddress = props.address
		}
		return state
	}

	render() {
		let { viewAddress } = this.state
		let {
			placeholder,
			style,
			className,
			name,
			errorHandler,
			inputPlaceholder,
			inputId
		} = this.props

		return (
			<PlacesAutocomplete
				value={viewAddress}
				onChange={this.setLocation}
				searchOptions={searchOptions}>
				{({
					getInputProps,
					suggestions,
					getSuggestionItemProps
					// loading
				}) => (
					<div
						className={`autocomplete input-wrapper with-location ${className}`}
						style={{ ...style }}>
						<input
							{...getInputProps({
								className: 'input-modal-auth',
								name: name || ''
							})}
							placeholder={`${
								inputPlaceholder ? inputPlaceholder : ''
							}`}
							ref={input => {
								this.textInput = input
							}}
							id={inputId && inputId}
							value={viewAddress}
						/>
						{placeholder && (
							<span className="placeholder">{placeholder}</span>
						)}
						{errorHandler}
						<div
							className="autocomplete-dropdown-container"
							style={{
								visibility: suggestions.length
									? 'visible'
									: 'hidden'
							}}>
							{/* {loading && <div>Loading...</div>} */}
							{suggestions.map(suggestion => {
								const className = suggestion.active
									? 'suggestion-item--active'
									: 'suggestion-item'
								const style = suggestion.active
									? {
											backgroundColor: '#fafafa',
											cursor: 'pointer',
											zIndex: 2
									  }
									: {
											backgroundColor: '#ffffff',
											cursor: 'pointer',
											zIndex: 2
									  }
								return (
									<div
										{...getSuggestionItemProps(suggestion, {
											className,
											style
										})}
										className="item-city"
										onClick={() =>
											this.selectAddress(
												suggestion.description
											)
										}>
										<span>
											{
												suggestion.formattedSuggestion
													.mainText
											}
											{', '}
										</span>
										<span>
											{
												suggestion.formattedSuggestion
													.secondaryText
											}
										</span>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</PlacesAutocomplete>
		)
	}
}
