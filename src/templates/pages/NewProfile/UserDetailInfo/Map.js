import React from 'react'
import icon from './profile-mark.png'
// import demoFancyMapStyles from './demoFancyMapStyles.json'
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'

export default withGoogleMap(({ lat, lng, chooseLocationFromMap }) => {
	
	return (
		<GoogleMap
			defaultZoom={12}
    		defaultCenter={{ lat: lat, lng: lng }}
			// onClick={chooseLocationFromMap}
			// defaultZoom={7}
			// defaultCenter={{ lat, lng }}
			// defaultOptions={{
			// 	styles: demoFancyMapStyles,
			// 	streetViewControl: false,
			// 	scaleControl: false,
			// 	mapTypeControl: false,
			// 	panControl: false,
			// 	zoomControl: false,
			// 	rotateControl: false,
			// 	fullscreenControl: false
			// }}
		>
			<Marker
				position={{ lat, lng }}
				icon={{
					url: icon,
					size: { height: 48, width: 36 }
				}}
			/>
		</GoogleMap>
	)

})