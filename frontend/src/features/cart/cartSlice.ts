import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// بنخزن نسخة من بيانات المنتج وقت الإضافة (للعرض فقط)
// الـ backend هو اللي بيحسب السعر الحقيقي من الداتابيز وقت الطلب
export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  stock: number;
};

// العنصر الواحد في الـ cart = منتج + مقاس + لون
type CartKey = Pick<CartItem, 'productId' | 'size' | 'color'>;

type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const isSame = (a: CartKey, b: CartKey) =>
  a.productId === b.productId && a.size === b.size && a.color === b.color;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const existing = state.items.find((i) => isSame(i, incoming));

      if (existing) {
        existing.stock = incoming.stock;
        existing.quantity = Math.min(existing.quantity + incoming.quantity, incoming.stock);
      } else {
        state.items.push({
          ...incoming,
          quantity: Math.min(incoming.quantity, incoming.stock),
        });
      }
    },
    removeFromCart(state, action: PayloadAction<CartKey>) {
      state.items = state.items.filter((i) => !isSame(i, action.payload));
    },
    updateQuantity(state, action: PayloadAction<CartKey & { quantity: number }>) {
      const item = state.items.find((i) => isSame(i, action.payload));
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
