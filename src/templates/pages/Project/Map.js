import React from 'react'
import icon from '../ProjectForm/component/mapIconPinMon.png'
import icon2 from '../ProjectForm/component/mapIconPinVol.png'
import demoFancyMapStyles from '../ProjectForm/component/demoFancyMapStyles.json'
import { GoogleMap, Marker, withGoogleMap } from 'react-google-maps'

export default withGoogleMap(({ lat, lng, chooseLocationFromMap }) => {
	return (
		<GoogleMap
			onClick={chooseLocationFromMap}
			defaultZoom={12}
			defaultCenter={{ lat, lng }}
			defaultOptions={{
				styles: demoFancyMapStyles,
				streetViewControl: false,
				scaleControl: false,
				mapTypeControl: false,
				panControl: false,
				zoomControl: false,
				rotateControl: false,
				fullscreenControl: false
			}}>
			<Marker
				position={{ lat, lng }}
				icon={{
					url: true ? icon2 : icon,
					size: { height: 48, width: 36 }
				}}
			/>
		</GoogleMap>
	)
})