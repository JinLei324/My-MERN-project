import React, { Component} from 'react'
import { connect } from 'react-redux'
import Card from '../../common/Card'

class GamePage extends Component {
	state={
		games: [
			{id: 1, title: "Kibble Vocab", description: "Kibble vocab is a vocabulary game where each correct answer = 5 pieces of kibbles for your local animal shelter!", background: "/images/ui-icon/games/kibble.png", url: "vocabulary"},
			{id: 2, title: "", background: "", url: ""},
			{id: 3, title: "", background: "", url: ""},
			{id: 4, title: "", background: "", url: ""},
			{id: 5, title: "", background: "", url: ""}
		]
	}

	componentDidMount() {
		document.querySelector('html').scrollTop = 0
	}

	componentWillUnmount() {
	}

	gotoGame = url => e => {
		this.props.history.push(`/games/${url}`)
	}

	render() {
		const {
			games
		} = this.state

		return (
			<Card className="games-page">
				<h2>Games for Good</h2>
				<h4>Why just game when you can game for good?</h4>
				<p>Play games, earn items, then donate to your local nonprofit organization!</p>
				<div className="games-wrapper">
					{games.map(game => (
						<div className="game-panel" key={game.id}>
							<div className="game-body" onClick={this.gotoGame(game.url)}>
								<div className="game-img">
								{ game.background !== "" && <img src={game.background} alt="Game" /> }
								</div>
								<div className="game-text">
								<h4>{ game.title }</h4>
								<p>{ game.description }</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="separator-50"></div>
			</Card>
		)
	}
}

const mapStateToProps = state => ({
	isAuth: state.authentication.isAuth,
	userId: state.authentication.userId
})

export default connect(
	mapStateToProps
)(GamePage)
