import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@react-hook/media-query';
import { CRow, CCol, CButton, CCard, CCardBody, CCardTitle, CSpinner } from '@coreui/react';
import Map from '../../components/Map/Map';
import HomeReportTable from './HomeReportTable';

import apiClient from '../../helpers/api';
import IconPin from './../../icons/icon-pin-secondary.svg';

import albertaProvince from '../../img/alberta-province.jpg'
import bcProvince from '../../img/bc-province.jpg'
import manitobaProvince from '../../img/manitoba-province.jpg'
import ontarioProvince from '../../img/ontario-province.jpg'
import saskatchewanProvince from '../../img/sascatchewan-province.jpg'
import { useGlobalContext } from '../../context';

const defaultCenter = [55.544388, -100.490929];
const bColumbiaPosition = [51.03586, -125.10323];
const albertaPosition = [53.76953, -113.771498];
const manitobaPosition = [57.225501, -96.38301];
const ontarioPosition = [48.907475, -83.852855];
const saskatchewanPosition = [53.462021, -104.755083];

const Home = () => {
  const [map, setMap] = useState([]);
  const [mapPosition, setMapPosition] = useState(defaultCenter);
  const [provinceData, setProvinceData] = useState(null);
  const [province, setProvince] = useState(null);
  const [waterbodies, setWaterbodies] = useState(null);
  const [closeWaterbodies, setCloseWaterbodies] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const { loading, setLoading } = useGlobalContext();

  const mobileView = useMediaQuery('only screen and (max-width: 576px)')
  const ref = useRef(null);
  const handleScroll = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getProvinces = () => {
    setLoading(true)
    apiClient
      .get('/provinces')
      .then((response) => {
        setProvinceData(response.data);
        setLoading(false)
      })
      .catch((error) => console.error(error));
  };

  const getWaterbodies = () => {
    apiClient
      .get('/waterbodies')
      .then((response) => {
        setWaterbodies(response.data);
      })
      .catch((error) => console.error(error));
  };

  const getWaterbodiesByLocation = (lat, lng) => {
    apiClient
      .get(`/location_waterbodies/${lat}/${lng}`)
      .then((response) => {
        setCloseWaterbodies((prevCloseWaterbodies) => response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleMapChange = (province) => {
    if (!waterbodies) {
      getWaterbodies();
    }
    setProvince((prevProvince) => province);
    if (province.provinceName === 'Alberta') {
      map.flyTo(albertaPosition, 8);
    } else if (province.provinceName === 'British Columbia') {
      map.flyTo(bColumbiaPosition, 7);
    } else if (province.provinceName === 'Manitoba') {
      map.flyTo(manitobaPosition, 6);
    } else if (province.provinceName === 'Ontario') {
      map.flyTo(ontarioPosition, 6);
    } else if (province.provinceName === 'Saskatchewan') {
      map.flyTo(saskatchewanPosition, 7);
    }
  };

  const handleFindWaterbody = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.flyTo([coords.latitude, coords.longitude], 8);
        setUserLocation([coords.latitude, coords.longitude]);
      },
      (blocked) => {
        if (blocked) {
          alert('Your browser navigation is disabled - Enable and click again');
        }
      }
    );
  };

  useEffect(() => {
    getProvinces();
    getWaterbodies(); //temp before we get the waterbody coords
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {

        getWaterbodiesByLocation(coords.latitude, coords.longitude);
        if (map.length !== 0) {
          map.flyTo([coords.latitude, coords.longitude], 8);
        }
      },
      (blocked) => {
        if (blocked) {
          getWaterbodies();
        }
      }
    );
  }, []);
  return (
    <>
      <CRow className="no-gutters">
        <CCol md={3}>
          <div className="provinceList">
            <div className="provinceList__header">
              <div className="d-grid ">
                <CButton className="provinceList__btn mt-2" onClick={() => handleFindWaterbody()}>
                  <div className="flex align-items-center text-uppercase">
                    <span>Find waterbody nearby</span>
                    <img className="provinceList__btn-icon" src={IconPin} alt="" />
                  </div>
                </CButton>
              </div>
              <h6 className="mt-3">Or select your province:</h6>
            </div>
            {loading ? (
              <div className="spinner-container--component"><CSpinner /></div>
            ) :
              <div className="provinceList__wrapper">
                {provinceData && (
                  <div className="provinceList__container styled-scrollbars">
                    {provinceData.data.map((province) => {
                      const { id, provinceName, regions } = province;
                      const waterBodyCount = regions.map((region) => {
                        return region.waterbodies.length;
                      });
                      let image;
                      switch (id) {
                        case 13:
                          image = albertaProvince // code block
                          break;
                        case 12:
                          image = bcProvince
                          break;
                        case 11:
                          image = manitobaProvince
                          break;
                        case 15:
                          image = ontarioProvince
                          break;

                        case 14:
                          image = saskatchewanProvince
                          break;
                        default:
                          image = albertaProvince
                      }
                      const waterbodiesByProvince = waterBodyCount.reduce((a, b) => a + b, 0);
                      return (
                        <div className="provinceList__item" key={id}>
                          <CCard className="mb-3 border-warning">
                            <CRow className="no-gutters">
                              <CCol md={5}>
                                <div className="province__list-img">
                                  <img src={image} className="img-fluid rounded-start" alt="..." />
                                </div>
                              </CCol>
                              <CCol md={7}>
                                <CCardBody>
                                  <CCardTitle>{provinceName}</CCardTitle>
                                  <div className="provinceList__item-detail">Regions: {regions.length}</div>
                                  <div className="provinceList__item-detail">Waterbodies: {waterbodiesByProvince}</div>
                                  <CButton className="mt-2 provinceList__item-btn" color="secondary" size="sm" shape="rounded-0" onClick={() => {
                                    handleMapChange(province)
                                    mobileView ? handleScroll() : ''
                                  }
                                  }>
                                    Explore
                                  </CButton>

                                </CCardBody>
                              </CCol>
                            </CRow>
                          </CCard>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            }

          </div>
        </CCol>

        <CCol md={9} ref={ref}>
          <Map map={map} setMap={setMap} mapPosition={mapPosition} setMapPosition={setMapPosition} waterbodies={waterbodies} closeWaterbodies={closeWaterbodies} userLocation={userLocation} />
        </CCol>
      </CRow>
      <HomeReportTable province={province} />
    </>

  )
}

export default Home