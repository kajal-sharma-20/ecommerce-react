import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

// Fetch wishlist items
export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchWishlistItems",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/getwishlist/${userId}`);
      return res.data.wishlist;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/addtowishlist/${userId}/${productId}`);
      thunkAPI.dispatch(fetchWishlistItems(userId)); // fetch updated wishlist
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const res = await axios.delete(`${API_URL}/removewishlist/${userId}/${productId}`);
      thunkAPI.dispatch(fetchWishlistItems(userId));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistItems.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchWishlistItems.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; });
  },
});

export default wishlistSlice.reducer;
