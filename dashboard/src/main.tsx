import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import { store } from './app/store';
import { fetchMe } from './features/auth/authThunk';
import AppRoutes from './routes/AppRoutes';
import './index.css';

// نجيب بيانات المستخدم مرة واحدة عند فتح الداشبورد
store.dispatch(fetchMe());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
