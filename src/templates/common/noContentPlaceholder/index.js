import React from 'react'
import Button from '../Button'

const emptyPlaceholder = props => {
	return (
		<div className="emptyPlaceholder">
			<h2>{props.titleMain}</h2>
			{props.onClickAction && (
				<Button
					onClick={props.onClickAction}
					padding="12px 26px"
					className="placeholderButton"
					label={props.titileButton}
					solid
				/>
			)}
		</div>
	)
}

export default emptyPlaceholder
