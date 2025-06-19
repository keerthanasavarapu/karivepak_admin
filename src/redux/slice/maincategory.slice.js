import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from "../../Services/api/baseURL"; // Corrected import path

// Async thunk to fetch main categories
export const fetchMainCategories = createAsyncThunk(
  'maincategory/fetchMainCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseURL}/api/maincategory`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        },
      });
   
      return Array.isArray(response.data) ? response.data : response.data.categories || [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const mainCategorySlice = createSlice({
  name: 'maincategory',
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMainCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchMainCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mainCategorySlice.reducer;