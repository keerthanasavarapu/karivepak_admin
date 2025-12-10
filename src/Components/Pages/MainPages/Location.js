import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { GOOGLE_MAP_API_KEY } from "../../../Services/api/baseURL";
import { baseURL } from "../../../Services/api/baseURL";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";



const StoreLocationForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedCoords, setSelectedCoords] = useState({ lat: "", lng: "" });
  const [stores, setStores] = useState([]);
  const [editId, setEditId] = useState(null);

  const autocompleteRef = useRef(null);
  const autocompleteInstance = useRef(null);

  // ✅ Load Google Maps script
  const loadGoogleMapsScript = (callback) => {
    if (window.google && window.google.maps) {
      callback();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = callback;
      document.body.appendChild(script);
    }
  };

  // ✅ Initialize Google Places Autocomplete when modal opens
  useEffect(() => {
    if (showModal) {
      loadGoogleMapsScript(() => {
        const google = window.google;
        if (autocompleteRef.current) {
          autocompleteInstance.current = new google.maps.places.Autocomplete(
            autocompleteRef.current,
            { types: ["geocode"] }
          );
          autocompleteInstance.current.addListener("place_changed", () => {
            const place = autocompleteInstance.current.getPlace();
            if (!place.geometry) return;
            const { lat, lng } = place.geometry.location;
            setAddress(place.formatted_address);
            setSelectedCoords({ lat: lat(), lng: lng() });
          });
        }
      });
    }
  }, [showModal]);

  // ✅ Fetch all stores
  const fetchStores = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/pickup-locations`);
      setStores(res.data);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleEditStore = (store) => {
    setEditId(store._id);
    setStoreName(store.name);
    setAddress(store.address);
    setSelectedCoords({ lat: store.latitude, lng: store.longitude });
    setShowModal(true);
  };

  // ✅ Add new store
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!storeName || !address || !selectedCoords.lat) {
      Swal.fire("⚠️ Missing Fields", "Please fill all fields and select a valid location.", "warning");
      return;
    }

    const payload = {
      name: storeName,
      address,
      latitude: selectedCoords.lat,
      longitude: selectedCoords.lng,
    };

    try {
      if (editId) {
        //  UPDATE
        await axios.put(`${baseURL}/api/pickup-locations/${editId}`, payload);
        Swal.fire(" Updated", "Store location updated successfully!", "success");
      } else {
        // ➕ CREATE
        await axios.post(`${baseURL}/api/pickup-locations`, payload);
        Swal.fire(" Success", "Store location saved successfully!", "success");
      }

      // Reset all states
      setEditId(null);
      setStoreName("");
      setAddress("");
      setSelectedCoords({ lat: "", lng: "" });
      setShowModal(false);
      fetchStores();
    } catch (err) {
      console.error(err);
      Swal.fire("❌ Error", "Failed to save store location", "error");
    }
  };


  // ✅ Activate store (toggle ON)
  const handleToggleStore = async (storeId) => {
    try {
      await axios.put(`${baseURL}/api/pickup-locations/${storeId}/activate`);
      fetchStores();
    } catch (err) {
      console.error("Failed to activate store:", err);
      Swal.fire("❌ Error", "Failed to activate store", "error");
    }
  };



  const handleDeleteStore = async (storeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This store will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.put(`${baseURL}/api/pickup-locations/${storeId}/soft-delete`);
      Swal.fire("🗑 Deleted!", "Store deleted successfully!", "success");
      fetchStores();
    } catch (err) {
      console.error("Failed to delete store:", err);
      Swal.fire("❌ Error", "Failed to delete store", "error");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Store Location</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Store
        </button>
      </div>

      {/* ✅ Store List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store._id}
            className={`border rounded-xl shadow p-4 transition ${store.isActive ? "bg-green-50 border-green-400" : "bg-white"
              }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg text-gray-800">{store.name}</h3>

              <div className="flex items-center space-x-3">
                {/* ✅ Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={store.isActive}
                    onChange={() => handleToggleStore(store._id)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
                {/* ✏️ Edit Icon */}
                <button
                  onClick={() => handleEditStore(store)}
                  className="text-blue-500 hover:text-blue-700 transition"
                  title="Edit store"
                >
                  <FaEdit width={60} height={40}/>
                </button>


                {/* ✅ Delete Icon */}
                <button
                  onClick={() => handleDeleteStore(store._id)}
                  className="text-red-500 hover:text-red-700 transition"
                  title="Delete store"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{store.address}</p>
            <p className="text-xs text-gray-400 mt-2">
              📍 Lat: {store.latitude.toFixed(5)}, Lng:{" "}
              {store.longitude.toFixed(5)}
            </p>
          </div>
        ))}
      </div>

      {/* ✅ Add Store Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => {
                setShowModal(false);
                setEditId(null);
                setStoreName("");
                setAddress("");
                setSelectedCoords({ lat: "", lng: "" });
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>


            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Add New Store
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 outline-none"
                  placeholder="Enter store name"
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm mb-1">
                  Store Address
                </label>
                <input
                  ref={autocompleteRef}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 outline-none"
                  placeholder="Search and select address"
                />
              </div>

              {selectedCoords.lat && (
                <div className="text-sm text-gray-500 bg-gray-50 p-2 rounded-md">
                  📍 Latitude: <b>{selectedCoords.lat}</b> | Longitude:{" "}
                  <b>{selectedCoords.lng}</b>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Save Store
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreLocationForm;
