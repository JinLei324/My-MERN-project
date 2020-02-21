import React, { Component} from 'react'
import { connect } from 'react-redux'
import {
	submitAnswer,
	getQuestion,
	getGameStats
} from '../../../../actions/game'

import {
	eventTodayTotalStats
} from '../../../../helpers/websocket'

import { signIn} from '../../../common/authModals/modalTypes'
import Card from '../../../common/Card'
import Button from '../../../common/Button'
import { toggleNotification } from '../../../../actions/notificationActions'


class GameVocabularyPage extends Component {
	state = {
		selectedAnswerId:"",
		correctCount: 0,
		selectedImage: '/images/ui-icon/games/0.png',
		showPlayMethod: false,
		showDialog: false,
		zipCode: '',
		setZipCode: '',
		isCorret: false,
		totalOfToday: 0
	}

	static getDerivedStateFromProps(props, state) {
		return state
	}
	componentDidMount() {
		this.props.getGameStats()
		this.props.getQuestion()
		eventTodayTotalStats((data) => {
			if (data.message.length > 0)
		 		this.setState({totalOfToday: data.message[0].totalofToday})
		})		
	}

	componentWillUnmount() {
	}

	clickAnswer = selectedAnswer => {
		if(this.state.selectedAnswerId !== '')
			return;
		if(this.state.setZipCode === ''){			
			this.props.toggleNotification({
				isOpen: true,
				resend: false,
				firstTitle: 'Message',
				secondTitle: 'Please submit your zipcode',
				buttonText: 'Ok'
			})
			return;
		}
			
		this.setState({selectedAnswerId: selectedAnswer._id})
		
		var thisObj = this
		setTimeout(function(){
			thisObj.props.submitAnswer({
				answer: selectedAnswer._id,
				zipcode: thisObj.state.setZipCode,
				cb: () => {
					thisObj.setState({selectedAnswerId: ''});	
				}
			})
		}, 2000);

		if(selectedAnswer.isRightAnswer){			
			this.setState({correctCount: this.state.correctCount + 1, isCorret: true}, () => {
				this.changeBonusImage()
			})
		} else{
			this.setState({isCorret: false});
		}
	}

	changeBonusImage() {
		this.setState({selectedImage: '/images/ui-icon/games/' + this.state.correctCount % 10 +'.png'});		
	}

	clickTab(){
		this.setState({showPlayMethod: !this.state.showPlayMethod})
	}

	onDialogClick(){
		this.setState({showDialog: !this.state.showDialog})
	}

	submitZipCode = e=>{
		this.setState({setZipCode : this.state.zipCode})
	}

	zipChange = e=> {
		this.setState({
			zipCode: e.target.value
		})
	}

	render() {
		const {
			isAuth,
			selectedAnswerId,
			isCorret,
			selectedImage,
			zipCode,
			setZipCode,
			totalOfToday
		} = this.state
		let {showPlayMethod, showDialog} = this.state
		let {question, gameStats} = this.props
		return (
			<div className="game-vocabulary-page">
				<div className="game-panel how-to-play">
					<Card className={`how-to-play-content ${
										showPlayMethod ? 'active' : ''
									}`} padding="30px 10px 10px 10px">
						<div className="play-title" onClick={() => this.clickTab()}>
							<h3 className="title">How to Play</h3>
							<div className="arrowBlock">
								<span className="arrow" />
							</div>
						</div>
						<div className="method-content" >
							<h5>Click on the right answer from the different choices.</h5>
							<h5>If you get the answer right it will turn orange and you get a harder question. If you get it wrong, it will turn black and you'll get an easier question.</h5>
							<h5>For each answer you get right, we will donate 5 pieces of kibble to your local animal shelter base on location.</h5>
							<div className="footer">
								<p className ="footer-text">Help us spread the world!!!</p>
								<div className="a2a_kit a2a_default_style" data-a2a-url="https://OneGivv.com" data-a2a-title="OneGivv">
									<a className="a2a_button_facebook" href="/">
										<div className="btn-fb">
											Share on Facebook
										</div>
									</a>
								</div>
							</div>
						</div>						
					</Card>
				</div>
				<div className="game-panel game-layer">
					<Card padding="0px">
						<div className="game-layer-mask">
							<div className="mask-left-bottom"></div>
							<div className="mask-right-top"></div>
							<div className="star text-center" onClick={() => this.onDialogClick()}>
								Stats
							</div>
							<div className="woman desktop-display">
							</div>
							{setZipCode === '' && <div className="submit-input">
								<div className="text text-center">Before continuing please input your zip code so we can send kibble to your local animal shelter!</div>
								<div className="input-box">
									<input className="input-text" value={zipCode} onChange={this.zipChange}></input>
									<button className={'button-main-class'} onClick={this.submitZipCode}>Submit</button>
								</div>
							</div>}
							<div className={`stats-dialog text-center ${ showDialog ? 'active' : ''}`}>
								{!isAuth && <Button
										onClick={() =>
											this.props.history.push(`?modal=${signIn}`)
										}
										className="signInButton"
										label="Sign in"
										padding="5px 16px"
								/>} 
								<div className="header">									
									<span className="title">Stats</span>
								</div>
								<p className="your-stats">Your Stats: {isAuth && gameStats && gameStats.today && 'kibble given in total'} 
									{!isAuth && 'sign in to see total'} 
								</p>
								<p className="week-stats">U.S. Stats: {gameStats && gameStats.week} kibble given this week</p>
								<p className="year-stats">U.S. Stats: {gameStats && gameStats.year} kibble given in total this year</p>
							</div>	
						</div>
						<div className="game-main">
							<h3 className="title desktop-display">Kibble Vocab</h3>
							<h3 className="title mobile-display text-center">Kibble Vocab</h3>
							<div className="game-content text-center">
								<h4 className="quiz">{question && question.text}</h4>
								<div className={`${isCorret ? 'correct-string' : 'incorrect-string'}`}>
									{selectedAnswerId !== '' && isCorret && 'Correct'} 
									{selectedAnswerId !== '' && !isCorret && 'Incorrect'}
								</div>
								<div className="answer-box">
									{question && question.answer && question.answer.map((e, i) => {
										return (<Button
											key={e._id}
											className={`answer ${
													selectedAnswerId === e._id && e.isRightAnswer ? 'selected' : ''
												}`}
											padding = "2px 20px"
											inverse={true}
											label={e.text}
											onClick={() => this.clickAnswer(e)}
										/>);
									})}
								</div>
							</div>

							<div className="kibble-content mobile-display text-center">
								<img className="bonus-img" src={selectedImage} alt="" />
								<span className="text">You have now donated {question && question.kibble} pieces of kibble</span>
								<span className="text">Today: {totalOfToday} pieces of kibble have been donated!</span>
							</div>
						</div>
					</Card>
				</div>
				<div className="game-panel bonus-layer desktop-display">
					<Card padding="30px 5%">						
						<h5 className="kibble-title">Today: {totalOfToday} pieces of kibble have been donated!</h5>
						<div className="kibble-content">
							<span className="text">You have now donated <br></br> {question && question.kibble} pieces of kibble</span>
							{/* {correctCount >= 5 && <div className="bonus-top">
								<span className="bonus-label">{parseInt((correctCount / 5)) * 50}</span>
							</div>} */}
							<img className="bonus-img" src={selectedImage} alt="" />
						</div>
					</Card>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	isAuth: state.authentication.isAuth,
	userId: state.authentication.userId,
	user: state.authentication.user,
	question: state.game.question,
	gameStats: state.game.stats
})


const mapDispatchToProps = {
	getQuestion,
	submitAnswer,
	getGameStats,
	toggleNotification
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(GameVocabularyPage)
