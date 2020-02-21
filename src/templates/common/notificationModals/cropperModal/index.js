import React from 'react'
import AvatarCropper from '../../authModals/components/avatarCropper'

const CropperModal = ({ imageUrl, closeCropper }) => (
	<div className="CropperModal">
		<AvatarCropper imageUrl={imageUrl} closeCropper={closeCropper} />
	</div>
)

export default CropperModal
