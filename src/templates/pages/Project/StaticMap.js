import React from 'react'
import icon from '../ProjectForm/component/mapIconPinMon.png'
import icon2 from '../ProjectForm/component/mapIconPinVol.png'
import demoFancyMapStyles from '../ProjectForm/component/demoFancyMapStyles.json'
import { GoogleMap, Marker, Circle, withGoogleMap } from 'react-google-maps'
import { DONATION, PICKUP } from '../../../helpers/projectTypes'

export default withGoogleMap(({ lat, lng, range, projectType }) => {
	return (
		<GoogleMap
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
			{projectType === (PICKUP) &&
				<Circle defaultCenter={{ lat, lng }}  options={{
				fillColor: "#1AAAFF",
				strokeColor: "#1AAAFF"
			}} defaultRadius={range * 100} />
			}
			<Marker
				position={{ lat, lng }}
				icon={{
					url: projectType === (DONATION) ? icon : icon2,
					size: { height: 48, width: 36 }
				}}
			/>
		</GoogleMap>
	)
})