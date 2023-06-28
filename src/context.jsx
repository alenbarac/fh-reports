import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSanctum } from 'react-sanctum';
import apiClient from './helpers/api';

const AdminContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const { authenticated, user, signIn } = useSanctum();
  const [showMessage, setShowMessage] = useState(false);
  const [provinceData, setProvinceData] = useState([]);
  const [provinceUpdated, setProvinceUpdated] = useState(false);
  const [regionAdded, setRegionAdded] = useState(false);
  const [regionUpdated, setRegionUpdated] = useState(false);
  const [regionDeleted, setRegionDeleted] = useState(false);
  const [waterbodyAdded, setWaterbodyAdded] = useState(false);
  const [adminProvinceCollection, setAdminProvinceCollection] = useState({})
  const [adminRegions, setAdminRegions] = useState([{ id: null, province_id: null, region_name: "" }])
  const [regionCollection, setRegionCollection] = useState([{ id: null, province_id: null, region_name: "" }])
  const [provinceWaterbodies, setProvinceWaterbodies] = useState([{ id: null, region_id: null, waterbody_name: "", longitude: null, latidude: null, waterbody_unlisted: false }])
  const [path, setPath] = useState('');


  const getProvinces = async () => {
    setLoading(true);
    await apiClient
      .get('/admin/provinces')
      .then((response) => {
        setLoading(false)
        setProvinceData(response.data);
        setLoading(false);

      })

      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (authenticated) {
      getProvinces();
    }
  }, [])


  const getAllRegions = async () => {
    setLoading(true);
    await apiClient
      .get('/regions')
      .then((response) => {
        setLoading(false)
        setRegionCollection(response.data);
        setLoading(false);
      })

      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (authenticated) {
      getAllRegions();
    }
  }, [])

  const getAdminProvinceData = async () => {
    setLoading(true);
    await apiClient
      .get(`/admin/provinces/${path}`)
      .then((response) => {
        const data = response.data.data;
        const provinceData = data.provinces;
        setAdminProvinceCollection(provinceData);
        setAdminRegions(data.regions);
        setLoading(false);
        console.log('admin provice data')
      })
      .catch((error) => console.error(error, 'admin province'));
  }

  useEffect(() => {
    if (authenticated && path) {
      getAdminProvinceData()
    }
  }, [path]);


  const addRegion = (province_id, region_name) => {
    setAdminRegions([...adminRegions, { province_id, region_name }]);
    setTimeout(() => {
      setRegionAdded(true);
    }, 100)
    setTimeout(() => {
      setRegionAdded(false);
    }, 500)
  }

  const updateRegion = (id, updatedRegion) => {
    setAdminRegions(adminRegions.map((region) => region.id === id ? updatedRegion : region));
    setTimeout(() => {
      setRegionUpdated(true);
    }, 100)
    setTimeout(() => {
      setRegionUpdated(false);
    }, 500)
  }

  const addProvinceWaterbody = (region_id, waterbody_name, longitude, latitude, waterbody_unlisted) => {
    setProvinceWaterbodies([...provinceWaterbodies, { region_id, waterbody_name, longitude, latitude, waterbody_unlisted }]);
    setTimeout(() => {
      setWaterbodyAdded(true);
    }, 100)
    setTimeout(() => {
      setWaterbodyAdded(false);
    }, 500)
  }


  return (
    <AdminContext.Provider
      value={{
        loading,
        setLoading,
        showMessage,
        setPath,
        setShowMessage,
        getAdminProvinceData,
        provinceUpdated,
        regionAdded,
        regionDeleted,
        regionUpdated,
        setProvinceUpdated,
        setRegionAdded,
        setRegionDeleted,
        setRegionUpdated,
        adminRegions,
        setAdminRegions,
        adminProvinceCollection,
        addRegion,
        updateRegion,
        addProvinceWaterbody,
        waterbodyAdded,
        setWaterbodyAdded,
        regionCollection,
        getAllRegions
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AdminContext);
};

export { AdminContext, AppProvider };