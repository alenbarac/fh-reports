import React from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet-loading';

import { Icon } from "leaflet";
import marker from "leaflet/dist/images/marker-icon.png";
const myIcon = new Icon({
  iconUrl: marker
});

const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const defaultZoom = 5;


function Map({ setMap, mapPosition, waterbodies, closeWaterbodies, userLocation }) {

  return (
    <>
      <MapContainer className="markercluster-map" center={mapPosition} zoom={defaultZoom} whenCreated={setMap} loadingControl={true}>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {waterbodies && (

          <MarkerClusterGroup chunkedLoading>
            {waterbodies?.map((waterbody) => {
              const { personal_reports } = waterbody;
              return (
                <Marker position={[waterbody.latitude, waterbody.longitude]} key={waterbody.id} icon={personal_reports.length ? myIcon : goldIcon}>
                  <Popup>
                    <div className="marker-title">{waterbody.waterbody_name}</div>
                    <div className="marker-link">
                      <Link to={`/waterbodies/${waterbody.id}`}>Report info</Link>
                    </div>
                    {personal_reports.length ? <div className='marker-reports'>Personal reports: {personal_reports.length}</div> : <div className='marker-reports'>Personal reports: 0</div>}
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}

        {closeWaterbodies && (
          <MarkerClusterGroup chunkedLoading>
            {closeWaterbodies?.map((waterbody) => {
              return (
                <Marker position={[waterbody.latitude, waterbody.longitude]} key={waterbody.id}>
                  <Popup>
                    <div className="marker-title">{waterbody.waterbody_name}</div>
                    <div className="marker-link">
                      <Link to={`/waterbodies/${waterbody.id}`}>Report info</Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MarkerClusterGroup>
        )}
        {userLocation && (
          <Marker position={userLocation}>
            <Popup>
              You are here. <br />
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* <Route path="/waterbodies:id">
        <Waterbody />
      </Route> */}
    </>
  );
}

export default Map;
