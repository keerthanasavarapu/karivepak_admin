"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, orderURL } from "../../../../Services/api/baseURL";

const HandlingFeeManager = () => {
  const [fee, setFee] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);

  // Fetch current fee on mount
  useEffect(() => {
    fetchCurrentFee();
  }, []);

  const fetchCurrentFee = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/handling-fee/get`);
      console.log("Fetched handling fee:", res.data);
      setCurrentFee(res.data.fee);
    } catch (error) {
      console.error("Error fetching handling fee:", error);
      toast.error(error.response?.data?.error || "Failed to fetch handling fee");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fee || isNaN(fee)) {
      toast.error("Please enter a valid number");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${baseURL}/api/handling-fee/set`, { fee: Number(fee) });
      toast.success("Handling fee updated successfully!");
      setCurrentFee(res.data.data.fee);
      setFee("");
    } catch (error) {
      console.error("Error updating handling fee:", error);
      toast.error(error.response?.data?.error || "Failed to update handling fee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-auto max-w-md mx-auto mt-50 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
        Handling Fee Manager
      </h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <>
          <div className="mb-4 text-center">
            <p className="text-gray-600 text-sm">Current Active Fee:</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{currentFee !== null ? currentFee : "Not Set"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              placeholder="Enter new handling fee"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
            >
              {loading ? "Updating..." : "Update Fee"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default HandlingFeeManager;
