import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { selectLabel } from './service'
import Select, { components } from 'react-select'
import Geocode from 'react-geocode'
import moment from 'moment'
import {
	ChooseType,
	ProjectDescription,
	NeededFrom,
	NeededCard,
	Time,
	PickupDay,
	Map,
	LimitTime,
	Money
} from './component'
import Card from '../../common/Card'
import Button from '../../common/Button'
import isValid from '../../../helpers/validate'
import {
	createProject,
	editProject,
	getProjectById,
	clearProject
} from '../../../actions/project'
import {
	getAllInterests
} from '../../../actions/global'
import Autocomplete from '../../common/Autocomplete'
import { VOLUNTEER, DONATION, PICKUP } from '../../../helpers/projectTypes'
import { Hints } from 'intro.js-react'
import {
	checkHint
} from '../../../helpers/websocket'

Geocode.setApiKey('AIzaSyDuMQs00SaxXjB7pQz0cwIGj-3gIVZYOGI&libraries')



const projectTypes = [
	{label: "Volunteer", index: VOLUNTEER},
	{label: "Donation", index: DONATION},
	{label: "PickUp", index: PICKUP}
]

const selectStyles = {
	indicatorSeparator: styles => ({ ...styles, width: 0 }),
	placeholder: styles => ({ ...styles, color: '#ccc' }),
	option: (styles, state) => (
		{ ...styles,
			position: "relative",
			padding: `5px 5px 5px 30px`,
			backgroundColor: 'transparent',
			color: state.isSelected ? '#1AAAFF' : '#666666',
			':active': {
				backgroundColor: 'transparent'
			},
			'::before': {
				content: '""',
				background: 'url(/images/ui-icon/check.svg)',
				backgroundRepeat: "no-repeat",
				backgroundSize: "10px 7px",
				display: state.isSelected ? "block" : "none",
				width: "10px",
				height: "7px",
				position: "absolute",
				top: "10px",
				left: "10px"
			}
		}
	),
}

const DropdownIndicator = props => {
	return (
		components.DropdownIndicator && (
			<components.DropdownIndicator {...props}>
				<img src="/images/ui-icon/dropdown.svg" alt="" />
			</components.DropdownIndicator>
		)
	);
};

class ProjectFormPage extends Component {
	state = {
		projectType: 0,
		needs: [
			{
				value: '',
				of: '',
				type: 0,
				isExactly: false
			}
		],
		projectId: '',
		title: '',
		description: '',
		selected_interests: [],
		interests: [],
		file: null,
		startDate: null,
		endDate: null,
		address: "",
		location: {
			geo: [0, 0],
			name: '',
			range: 0
		},
		quantity: 0,
		isExactly: false,
		pickupDays: [],
		editFlag: Boolean(this.props.match.params.projectId),
		getData: false,
		allInterests: [],
		isEnd: false,
		isCancel: false,
		isTurnedOff: false,
		showHints: true,
		basicHints : [
			{
				id: 15,
				element: '.hint-add-project',
				hint: "Select a type of project you'd like to create. Donations are aimed at raising funds, Volunteer at getting help for projects and events, and PickUp requests for collecting items and supplies your organization needs!",
				hintPosition: 'bottom-right'
			}
		],
		hints: [
		]
	}

	componentDidMount() {
		this._mounted = true
		document.querySelector('html').scrollTop = 0
		if (!this.props.user || !this.props.user.isApproved) {
			this.props.history.push('/');
		} else {
			if( navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition( (position) => {
					if (this.state.location.name === "") {
						let location = {
							geo: [position.coords.latitude, position.coords.longitude],
							name: "",
							range: 0
						}
						this.setState({ location })
					}
				});
			}
			let { projectId } = this.props.match.params
			if (projectId) this.props.getProjectById(projectId)
			else this.props.clearProject()
			this.props.getAllInterests()
		}

		window.scroll(0, 0);
	}

	componentWillUnmount() {
		this._mounted = false
		this.props.clearProject()
	}

	static getDerivedStateFromProps(props, state) {
		if(!props.user)
			return state
		let newState = {}
		if (
			state.editFlag &&
			props.project &&
			props.project._id &&
			!state.getData
		) {
			newState = {
				getData: true,
				...props.project
			}
			let today = moment().format('X')
			if (Number(props.project.endDate) < Number(today)) {
				newState.isEnd = true;
			}
			newState.isTurnedOff = props.project.isTurnedOff;
			newState.isCancel = props.project.isCancel;
			newState._id = props.project._id
			newState.quantity = props.project.money.total || 0
			newState.isExactly = props.project.money.isExactly
			newState.interests = props.project.interests || []
			newState.selected_interests = newState.interests.map(e => {
				return { value: e._id, label: e.title }
			})
			newState.urlData = props.project.cover
			newState.description = props.project.description
			newState.startDate = props.project.startDate
			newState.endDate = props.project.endDate
			newState.pickupDays = props.project.pickupDays || []
			newState.needs = props.project.needs.map(
				({ value, of, type, _id, isExactly }) => ({
					value,
					of,
					type,
					isExactly,
					_id: _id ? _id : undefined
				})
			)
			let _location = {
				geo: [...props.project.location.geo.reverse()],
				name: props.project.location.name,
				range: props.project.location.range
			}
			newState.location = _location
		}

		if (props.all_interests) {
			newState.allInterests = props.all_interests.map(e => {
				return { value: e._id, label: e.title }
			})
		}

		state.hints = state.basicHints.filter(e => {
			if(!props.user.hints.includes(e.id)) {
				return e
			}
			return false
		})


		return newState
	}

	addNeeded = e => {
		let needs = this.state.needs
		needs.push(e)
		this.setState({ needs })
	}

	addressChange = e => {
		let address = { ...this.state.address, [e.target.name]: e.target.value }
		this.setState({ address })
	}

	updateMainInfo = data => {
		let updateData = { ...data }
		if (data.startDate) {
			updateData.date = moment.unix(data.startDate)
			updateData.startTime = moment.unix(data.startDate)
		}
		if (data.endDate) {
			updateData.endTime = moment.unix(data.endDate)
		}
		if (data.location && data.location.name) {
			updateData = { ...updateData, address: data.location.name }
		}

		this.setState(updateData)
	}
	helpers = (key, val) => () => this.setState({ [key]: val })
	updateNeeded = ({ key, value, index }) => {
		let needs = [...this.state.needs]
		needs[index][key] = value
		this.setState({ needs })
	}

	deleteNeeded = index => {
		let needs = this.state.needs
		needs.splice(index, 1)
		this.setState({ needs })
	}

	chooseType = type => {
		this.setState({ projectType: type })
	}

	save = e => {
		e.preventDefault()

		let inputs = e.target.getElementsByTagName('input'),
			textareas = e.target.getElementsByTagName('textarea'),
			all = [...inputs, ...textareas],
			errors = false,
			addressFields = ["address1", "address2", "city", "state", "country", "zipcode"],
			formData = {}

		for (let i = 0; i < all.length; ++i) {
			let valid = isValid(all[i].id.split('-')[0], all[i].value)
			if (all[i].id) {
				let notValid = document.querySelector(
					`[id=${all[i].id}] ~ span.globalErrorHandler`
				)
				let inputValid = document.querySelector(`[id=${all[i].id}]`)
				if (valid.length !== 0) {
					if (
						all[i].id === 'projectFileCreate' &&
						this.state.urlData
					) {
						errors = false
					} else {
						notValid.innerHTML = valid[0]
						inputValid.style.borderColor = '#FF90B5'
						errors = true
					}
				} else {
					notValid && (notValid.innerHTML = '')
					notValid && (inputValid.style.borderColor = '#ddd')
				}

				if (addressFields.indexOf(all[i].name) > -1) {
					if (!formData.address) formData.address = {}
					formData.address[all[i].name] = all[i].value
				}

				formData[all[i].name] = all[i].value
			}
		}

		if (errors) {
			let arrayItems = document.querySelectorAll(
					`span.globalErrorHandler`
				),
				singleItem
			Array.prototype.slice
				.call(arrayItems)
				.reverse()
				.forEach(elem => {
					if (elem.innerHTML !== '') {
						singleItem = elem
						return false
					} else {
						return true
					}
				})

			let bodyRect = document.body.getBoundingClientRect(),
				elemRect = singleItem.getBoundingClientRect(),
				offset = elemRect.top - bodyRect.top

			var scrollStep = -window.scrollY / (100 / 15),
				scrollInterval = setInterval(function() {
					if (window.scrollY >= offset - 200) {
						window.scrollBy(0, scrollStep)
					} else clearInterval(scrollInterval)
				}, 15)
		}

		if (!errors) {
			let data = {
				projectType: this.state.projectType,
				needs: this.state.needs,
				title: this.state.title,
				description: this.state.description,
				interests: this.state.interests.map(e => e._id),
				file: this.state.file,
				startDate: Number(this.state.startDate),
				endDate: Number(this.state.endDate),
				address: this.state.address,
				location: this.state.location,
				quantity: this.state.quantity,
				isExactly: this.state.isExactly,
				pickupDays: this.state.pickupDays.sort()
			}

			if (this.state.projectType === PICKUP) {
				delete data.startDate
				delete data.endDate
			}

			if (this.state.editFlag) {
				this.props.editProject({
					...data,
					cover: this.state.urlData,
					_id: this.state._id,
					userId: this.props.userId
				})
			} else {
				if (this.state.projectType === (PICKUP)) {
					data.endDate = moment().add(1, 'M').unix()
				}
				this.props.createProject(data)
			}
		}
	}

	chooseLocationFromMap = event => {
		var lat = event.latLng.lat(),
			lng = event.latLng.lng()

		Geocode.fromLatLng(lat, lng).then(response => {
			const formated_address = response.results[0].formatted_address
			if (formated_address) {
				let _location = {
					...this.state.location,
					geo: [lat, lng],
					name: formated_address
				}
				this.setState({ location: _location, address: formated_address })
			}
		})
	}

	onLocationRangeChange = e => {
		let _location = this.state.location
		_location.range = Number(e.target.value)
		this.setState({ location: _location })
	}

	onSelectInterest = target => {
		let _interests = target.map(e => {
			return this.props.all_interests.find(ei => ei._id === e.value)
		})
		this.setState({ selected_interests: target })
		this.setState({ interests: _interests })
	}

	onRemoveInterest = _id => e => {
		let _index = this.state.selected_interests.findIndex(e => _id === e.value)
		let _selected_interests = this.state.selected_interests
		let _interests = this.state.interests
		_selected_interests.splice(_index, 1)
		_interests.splice(_index, 1)
		this.setState({ selected_interests: _selected_interests })
		this.setState({ interests: _interests })
	}

	onCloseHint = idx => {
		if(!this._mounted)
			return;
		const {hints} = this.state
		const hId = hints[idx].id
		checkHint(hId)
	}

	render() {
		const {
			projectType,
			needs,
			// address,
			location,
			editFlag,
			title,
			description,
			interests,
			selected_interests,
			urlData,
			getData,
			startDate,
			endDate,
			quantity,
			isExactly,
			pickupDays,
			allInterests,
			isEnd,
			isTurnedOff,
			isCancel, hints, showHints
		} = this.state;

		// const { request } = this.props;

		return (
			<Card className="project-options">
				<form className="createProjectForm" onSubmit = { this.save }>
					<Hints 
						enabled={showHints}
						hints={hints}
						onClose={this.onCloseHint}
						ref={hints => this.hintRef = hints}
					/>
					<p className="description description-main main-font">
						{ editFlag ? 'Edit project' : 'Create new project' }
					</p>
					<div className="separator-25" />
					<p className="hint-add-project description main-font">Choose category</p>
					<ChooseType
						activeType={projectType}
						chooseType={this.chooseType}
						disabled={editFlag}
						types={projectTypes}
					/>
					<div className="separator-25" />
					<p className="description main-font">Project description</p>
					<div className="separator-25" />
					<ProjectDescription
						key={getData ? 'update-title' : ''}
						getData={this.updateMainInfo}
						title={title}
						description={description}
						urlData={urlData && urlData}
						disabled={isTurnedOff || isEnd || isCancel}
					/>
					<div className="separator-25" />
					<p className="description main-font">Interest</p>
					<div className="separator-25" />
					<div className="Select-menu-outer">
						<Select
							value={selected_interests}
							onChange={this.onSelectInterest}
							options={allInterests}
							isMulti
							isSearchable
							placeholder="Choose interest(s)..."
							controlShouldRenderValue={false}
							closeMenuOnSelect={false}
							hideSelectedOptions={false}
							isClearable={false}
							menuContainerStyle={{zIndex: 1000}}
							styles={selectStyles}
							components={{ DropdownIndicator }}
							disabled={isTurnedOff || isEnd || isCancel}
						/>
					</div>
					<div className="interests">
						{interests.map((e, i) => {
							return (
								<Fragment key={i}>
									<div className="interest" onClick={this.onRemoveInterest(e._id)}>
										<span className="interest__title">{ e.title }</span>
										<span className="remove"><img src="/images/ui-icon/remove.svg" alt="" /></span>
									</div>
								</Fragment>
							)
						})}
					</div>
					
					{ projectType === (VOLUNTEER) &&
						<div>
							<div className="separator-25" />
							<p className="description main-font">{selectLabel(0)}</p>
							{needs.map((e, i) => {
								return (
									<Fragment key={i}>
										<NeededCard
											{...e}
											deleteAvailible={needs.length > 1}
											deleteElem={() => this.deleteNeeded(i)}
											updateNeeded={this.updateNeeded}
											index={i}
											type={VOLUNTEER}
											isChecked={needs.isExactly}
										/>
									</Fragment>
								)
							})}
							<div className="separator-25" />
							<NeededFrom
								action={this.addNeeded}
								disableButton={!(this.state.needs.length < 10) || isTurnedOff || isEnd || isCancel }
								types={projectType}
							/>
							<div className="separator-25" />
							<p className="description main-font">Date and location</p>
							<div className="separator-25" />

							<Time
								update={this.updateMainInfo}
								startDate={startDate}
								endDate={endDate}
								disabled={isTurnedOff || isEnd || isCancel}
							/>
							<div className="separator-25" />
							<div className="field">
								<span className="label main-font">Location:</span>
								<Autocomplete
									key={getData ? 'update-name-volunteer' : ''}
									update={this.updateMainInfo}
									errorHandler={
										<span className="globalErrorHandler" />
									}
									inputId="projectLocationField"
									address={location.name}
									inputPlaceholder="Address..."
									className="radius"
									disabled={isTurnedOff || isEnd || isCancel}
								/>
							</div>
							<div className="separator-25" />
							<Map
								lat={location.geo[0]}
								lng={location.geo[1]}
								containerElement={<div style={{ height: `400px` }} />}
								chooseLocationFromMap={this.chooseLocationFromMap}
								mapElement={<div style={{ height: `100%` }} />}
							/>
						</div>
					}

					{ projectType === (DONATION) &&
						<div>
							<div className="separator-20" />
							<p className="description main-font">Donation Goal</p>
							<Money
								update={this.updateMainInfo}
								quantity={quantity}
								isExactly={isExactly}
								disabled={isTurnedOff || isEnd || isCancel}
								immediateDonation={false}
							/>
							<div className="separator-25" />
							<p className="description main-font">End Date</p>
							<LimitTime
								update={this.updateMainInfo}
								endDate={endDate}
								disabled={isTurnedOff || isEnd || isCancel}
							/>
						</div>
					}

					{ projectType === (PICKUP) &&
						<div>
							<div className="separator-25" />
							<p className="description main-font">{selectLabel(1)}</p>
							{needs.map((e, i) => {
								return (
									<Fragment key={i}>
										<NeededCard
											{...e}
											deleteAvailible={needs.length > 1}
											deleteElem={() => this.deleteNeeded(i)}
											updateNeeded={this.updateNeeded}
											index={i}
											type={PICKUP}
											isChecked={needs.isExactly}
										/>
									</Fragment>
								)
							})}
							<div className="separator-25" />
							<NeededFrom
								action={this.addNeeded}
								disableButton={!(this.state.needs.length < 10)}
								types={projectType}
							/>
							<div className="separator-25" />
							<p className="description main-font">Date and location</p>
							<p>Select the days in which are you`re able to do PickUps in this location.</p>
							<PickupDay pickupDays={pickupDays} update={this.updateMainInfo} />
							<div className="separator-25" />
							<div className="field">
								<span className="label main-font">Your Location:</span>
								<Autocomplete
									key={getData ? 'update-name-pickup' : ''}
									update={this.updateMainInfo}
									errorHandler={
										<span className="globalErrorHandler" />
									}
									inputId="projectLocationField"
									address={location.name}
									inputPlaceholder="Address..."
									className="radius"
									disabled={isTurnedOff || isEnd || isCancel}
								/>
							</div>
							<div className="separator-15" />
							<div className="field">
								<span className="label main-font">How many miles are you willing to PickUp from your location?</span>
								<input
									className="main-font control"
									type="number"
									id="projectLocationRange"
									placeholder="0"
									onChange={this.onLocationRangeChange}
									value={location.range}
									min="0"
									disabled={isTurnedOff || isEnd || isCancel}
								/>
								<span className="globalErrorHandler" />
							</div>
						</div>
					}

					<div className="separator-25" />
					<div className="center">
						<Button
							label = { ` ${!editFlag ? 'Create Project' : 'Update Project'}` }
							padding = "15px 30px"
							disabled = {isTurnedOff || isEnd || isCancel}
							solid
							fontSize = "16px"
						/>
						{/* <Button
							label = { ` ${!editFlag ? 'Create Project' : 'Update Project'}` }
							padding = "15px 30px"
							disabled = { request || isEnd || isCancel }
							solid
							fontSize = "16px"
						/> */}
					</div>
				</form>
			</Card>
		)
	}
}

const mapStateToProps = state => ({
	user: state.authentication.user,
	userId: state.authentication.userId,
	request: state.project.request,
	project: state.project.openProject,
	all_interests: state.globalReducer.interests
})

const mapDispatchToProps = {
	getAllInterests,
	createProject,
	editProject,
	getProjectById,
	clearProject
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProjectFormPage)
