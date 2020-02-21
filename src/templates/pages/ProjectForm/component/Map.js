import React from 'react'
import icon from './mapIconPinMon.png'
import icon2 from './mapIconPinVol.png'
import demoFancyMapStyles from './demoFancyMapStyles.json'
import { GoogleMap, Marker, Circle, withGoogleMap } from 'react-google-maps'

const myMap = ({ lat, lng, range, chooseLocationFromMap }) => {
	return (
		<GoogleMap
			onClick={chooseLocationFromMap}
			defaultZoom={12}
			center={{ lat, lng }}
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
			<Circle center={{ lat, lng }} options={{
				fillColor: "#1AAAFF",
				strokeColor: "#1AAAFF"
			}} radius={range * 100} />
			<Marker
				position={{ lat, lng }}
				icon={{
					url: true ? icon2 : icon,
					size: { height: 48, width: 36 }
				}}
			/>
		</GoogleMap>
	)
}

export default withGoogleMap(myMap)
