import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

// Fetch cart items for a user
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, thunkAPI) => {
    try {
      const res = await axios.get(
        `${API_URL}/getcartitems/${userId}`
      );
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Add item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${API_URL}/addtocart/${userId}/${productId}`,
        { quantity: 1 } // default quantity
      );
      // After adding, fetch updated cart
      thunkAPI.dispatch(fetchCartItems(userId));
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${API_URL}/removecart/${userId}/${productId}`
      );
      return res.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Remove failed" }
      );
    }
  }
);

// Update quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      await axios.put(
        `${API_URL}/updatecart/${userId}/${productId}`,
        { quantity }
      );
      const cart = await axios.get(
        `${API_URL}/getcartitems/${userId}`
      );
      return cart.data.cart;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

//  Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },

  //  Add the clearCart reducer here
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Add to cart failed";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Remove failed";
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
      });
  },
});

// Export the clearCart action
export const { clearCart } = cartSlice.actions;

export default cartSlice.reducer;
