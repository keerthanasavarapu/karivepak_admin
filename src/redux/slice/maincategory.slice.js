import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from "../../Services/api/baseURL";

// Async thunk to fetch main categories
export const fetchMainCategories = createAsyncThunk(
  'maincategory/fetchMainCategories',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn("No token found in localStorage");
        return rejectWithValue("No authentication token found");
      }

      const parsedToken = JSON.parse(token);
      console.log("Using token:", parsedToken);

      const response = await axios.get(`${baseURL}/api/maincategory`, {
        headers: {
          Authorization: `Bearer ${parsedToken}`,
        },
      });

      console.log("Fetched main categories:", response.data);

      return Array.isArray(response.data)
        ? response.data
        : response.data.categories || [];
    } catch (err) {
      console.error("Error fetching main categories:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Redux slice for main categories
const mainCategorySlice = createSlice({
  name: 'maincategory',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMainCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchMainCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
      });
  },
});

export default mainCategorySlice.reducer;
