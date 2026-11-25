
import { useEffect } from 'react';

import AppRoutes from './routes/AppRoutes';
import { useDispatch } from 'react-redux';
import { fetchMe } from './features/auth/authThunk';
function App() {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <div className='overflow-hidden'>
      <AppRoutes />
    </div>
  );
}

export default App
