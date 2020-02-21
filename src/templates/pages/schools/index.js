import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import UserAvatar from '../../common/userComponents/userAvatar'
import { getSingleSchool } from '../../../actions/global'
import { withRouter } from 'react-router'

class SchoolPage extends Component {
	state = {
		skip: 0
	}

	componentDidMount() {
		this.props.dispatch(
			getSingleSchool(this.props.match.params.id, this.state.skip)
		)
		document.addEventListener('scroll', this.scrollUpload, false)
	}

	componentWillUnmount() {
		document.removeEventListener('scroll', this.scrollUpload, false)
	}

	scrollUpload = () => {
		let body = document.querySelector('html'),
			counts = document.querySelectorAll(
				'ul.SchollListOfPeople li.rowForSchool'
			).length,
			scroll = body.clientHeight + body.scrollTop === body.scrollHeight,
			perPage = this.state.skip,
			elemsOnPage = perPage <= counts && counts <= perPage + 10

		if (scroll && elemsOnPage) {
			this.setState((state, props) => ({
				skip: state.skip + 10
			}));
			// this.setState({ skip: this.state.skip + 10 });	// original code
			this.props.dispatch(
				getSingleSchool(this.props.match.params.id, this.state.skip)
			)
		}
	}

	render() {
		const { singleSchool } = this.props

		return (
			<div className="SchoolPage">
				<div className="schoolInformation">
					<div className="schoolImage" />
					<div className="textBlock">
						<h3 className="schoolTitle">{singleSchool.name}</h3>
						<p className="schoolAddress">{singleSchool.address}</p>
						<p className="schoolAddress">{singleSchool.street}</p>
						<p className="schoolPhone">{singleSchool.tel}</p>
					</div>
				</div>
				<ul className="SchollListOfPeople">
					{singleSchool.students &&
						singleSchool.students.map(student => (
							<li key={student._id} className="rowForSchool">
								<NavLink
									to={`/${student._id}`}
									className="userWrapperAva">
									<UserAvatar
										size={60}
										imgUser={student.avatar}
										imgUserType={student.role}
									/>
									<span className="nameUser">
										{student.firstName +
											' ' +
											student.lastName}
									</span>
								</NavLink>
								<div className="volonteerHours">
									<div className="number">
										{student.activeHours}
									</div>
									<div className="textTitle">
										Hours volunteered
									</div>
								</div>
							</li>
						))}
				</ul>
			</div>
		)
	}
}

const mapStateToProps = ({ globalReducer }) => ({
	singleSchool: globalReducer.singleSchool
})

export default withRouter(
	connect(
		mapStateToProps,
		null,
		null,
		{
			pure: false
		}
	)(SchoolPage)
)
