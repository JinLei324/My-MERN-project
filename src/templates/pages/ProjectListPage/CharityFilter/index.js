import React, { Component } from 'react';
import { connect } from 'react-redux';

import DropdownTreeSelect from 'react-dropdown-tree-select';
import 'react-dropdown-tree-select/dist/styles.css';

import MyAutocomplete from '../../../common/MyAutocomplete';
import { getAllInterests, getHierarchyInterests } from '../../../../actions/global';

class CharityFilter extends Component {

	state = {
		allInterests: [],
		interests: [],
		title: '',
		location: '',
		isFilterOpened: false,
		getData: false,
		data: {
			label: 'search me',
			value: 'searchme',
			children: [
			  	{
					label: 'search me too',
					value: 'searchmetoo',
					children: [
				  		{
							label: 'No one can get me',
							value: 'anonymous'
				  		}
					]
			  	}
			]
		},
		allHierarchyInterests: []
	}

	constructor(props) {
		super(props);

		this.toggleFilter = this.toggleFilter.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		// this.props.getAllInterests();
		this.props.getHierarchyInterests();
	}

	componentWillReceiveProps(nextProps) {
		let allInterests = nextProps.interests.map(e => {
			return { value: e._id, label: e.title }
		});
		this.setState({
			allInterests: allInterests
		});

		if (!nextProps.hierarchyInterests)
			return;
			
		let allHierarchyInterests = nextProps.hierarchyInterests.map(e => {
			return e;
		});
		allHierarchyInterests.forEach(e => {
			if (e._id) e.value = e._id;
			if (e.title) e.label = e.title;

			if (e.children && Array.isArray(e.children)) {
				e.children.forEach(e1 => {
					if (e1._id) e1.value = e1._id;
					if (e1.title) e1.label = e1.title;

					if (e1.children && Array.isArray(e1.children)) {
						e1.children.forEach(e2 => {
							if (e2._id) e2.value = e2._id;
							if (e2.title) e2.label = e2.title;
						});
					}
				});
			}
		});
		
		this.setState({
			allHierarchyInterests: allHierarchyInterests
		});
	}

	inputHelper = (key, val) => () => {
		this.setState({ [key]: val, skip: 0 });
	}

	handleChange = key => target => {
		let value;
		if (key === 'title') {
			value = target.target.value;
		} else if (key === 'location') {
			value = target.location.name;
		} else {
			value = target;
		}
		this.setState({ [key]: value });

		this.props.updateFilterValues({ [key]: value });
	}

	toggleFilter = () => {
		this.setState(state => ({
			isFilterOpened: !state.isFilterOpened
		}));
		
		this.props.toggleFilterPanel(!this.state.isFilterOpened);
	}

	onChange = (currentNode, selectedNodes) => {
		let selectedInterests = [];
		selectedInterests = selectedNodes.map(e => {
			return e;
		});

		this.props.updateFilterValues({ interests: selectedInterests });
	}
	
	onAction = ({ action, node }) => {
		// console.log(`onAction:: [${action}]`, node)
	}
	
	onNodeToggle = currentNode => {
		// console.log('onNodeToggle::', currentNode)
	}

	render() {
		let { title, location, allHierarchyInterests, /*interests, allInterests,*/ isFilterOpened, getData } = this.state;
		
		return(
			<div className={`charity-filter ${isFilterOpened ? 'open' : ''}`}>
				<div className="card-header isOnlyDesktop">
					<h3 className="main-font">Filter</h3>
					<div className="separator-15" />
				</div>
				{ !isFilterOpened && <div className="input-control-wrapper isOnlyMobile m-t-15">
						<input
							value={title}
							className="filter-title control"
							onChange={this.handleChange("title")}
							onKeyDown={this.handlekeyDownonSearch}
						/>
						<span className="icon-search"></span>
					</div> }
				<div className="card-header isOnlyMobile m-t-15" onClick={this.toggleFilter}>
					<h3 className="main-font">Filter</h3>
					<span className="caret"></span>
					<div className="separator-15" />
				</div>
				<div className="card-body">
					<div className="t_title main-font">Search</div>
					<div className="input-control-wrapper">
						<input
							value={title}
							className="filter-title control"
							onChange={this.handleChange("title")}
							onKeyDown={this.handlekeyDownonSearch}
						/>
						<span className="icon-search"></span>
					</div>

					<p className="t_date main-font">Location</p>
					<MyAutocomplete
						key={ getData ? "update-location" : "" }
						update={ this.handleChange("location") }
						errorHandler={
							<span className="globalErrorHandler" />
						}
						inputId="projectLocationField"
						address={ location }
						inputPlaceholder="Address..."
						className="radius"
						disabled={ false }
					/>

					<p className="t_interests main-font">Interests</p>
					<div className="Select-menu-outer">
						<DropdownTreeSelect
							data={allHierarchyInterests}
							onChange={this.onChange}
							onAction={this.onAction}
							onNodeToggle={this.onNodeToggle} />
						{/* <Select
							value={interests}
							onChange={this.handleChange("interests")}
							options={allInterests}
							isMulti
							isSearchable
							menuContainerStyle={{zIndex: 1000}}
						/> */}
					</div>
				</div>

			</div>
		)
	}
}

const mapStateToProps = state => ({
	interests: state.globalReducer.interests,
	hierarchyInterests: state.globalReducer.hierarchyInterests
})

const mapDispatchToProps = {
	getAllInterests,
	getHierarchyInterests
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CharityFilter)