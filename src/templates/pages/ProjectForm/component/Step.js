import React from 'react'
import Card from '../../../common/Card'

export const Step = ({ step, label, className }) => (
	<div className={`${className} step-wrapper`}>
		<div className="step">
			<p className="main-font text">{step}</p>
		</div>
		{label && <p className="label main-font text">{label}</p>}
	</div>
)

export const ChooseType = ({
	className,
	chooseType,
	activeType,
	disabled,
	multi,
	types
}) => (
		<Card className={`${className} type-wrapper`} padding="0">
			{types.map(
				(e, i) =>
					<button
						key={`type-${e.index}`}
						className={`wrapper animation-click-effect ${(multi
							? activeType.includes(e.index)
							: activeType === e.index) && 'active'}`}
						onClick={event => {
							event.preventDefault()
							chooseType(e.index)
						}}
						disabled={disabled}
						>
						<span className="label">{e.label}</span>
					</button>
			)}
		</Card>
	)
