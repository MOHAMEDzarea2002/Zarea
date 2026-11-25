import { configureStore } from '@reduxjs/toolkit';
import categoriesReducer from '../features/categories/categoriesSlice';
import productsReducer from '../features/products/productsSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';

const WISHLIST_KEY = 'zarea-wishlist';
const CART_KEY = 'zarea-cart';

type WishlistState = ReturnType<typeof wishlistReducer>;
type CartState = ReturnType<typeof cartReducer>;

// بنقرأ من الـ localStorage بأمان، ولو الداتا بايظة بنرجع undefined
function loadState<T extends { items: unknown[] }>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.items) ? (parsed as T) : undefined;
  } catch {
    return undefined;
  }
}

function saveState(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // الـ storage ممكن يكون متقفل (private mode)، ومنكسرش التطبيق عشانه
  }
}

// لو مفيش داتا محفوظة، بناخد الحالة الابتدائية من الـ reducer نفسه
const preloadedState = {
  cart: loadState<CartState>(CART_KEY) ?? cartReducer(undefined, { type: '@@zarea/init' }),
  wishlist:
    loadState<WishlistState>(WISHLIST_KEY) ?? wishlistReducer(undefined, { type: '@@zarea/init' }),
};

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    wishlist: wishlistReducer,
  },
  preloadedState,
});

// نحفظ بس لما الـ wishlist أو الـ cart يتغيروا فعلاً
let prevWishlist = store.getState().wishlist;
let prevCart = store.getState().cart;

store.subscribe(() => {
  const { wishlist, cart } = store.getState();

  if (wishlist !== prevWishlist) {
    saveState(WISHLIST_KEY, wishlist);
    prevWishlist = wishlist;
  }
  if (cart !== prevCart) {
    saveState(CART_KEY, cart);
    prevCart = cart;
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
