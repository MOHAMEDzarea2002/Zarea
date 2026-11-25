import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// نسخة من بيانات المنتج وقت الإضافة، عشان صفحة المفضلة تتعرض من غير ما نجيب كل المنتجات من الـ API
export type WishlistItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistState = {
  items: WishlistItem[];
};

const initialState: WishlistState = { items: [] };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // إضافة لو مش موجود، وشيل لو موجود
    toggleWishlist(state, action: PayloadAction<WishlistItem>) {
      const index = state.items.findIndex((i) => i._id === action.payload._id);
      if (index >= 0) state.items.splice(index, 1);
      else state.items.push(action.payload);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
