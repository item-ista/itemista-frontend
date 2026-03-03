import { RouterProvider } from 'react-router';
import router from './routes/index.jsx';
import GoogleTagManager from './components/common/GoogleTagManager.jsx';
import GoogleAnalytics from './components/common/GoogleAnalytics.jsx';
import './App.css'

function App() {
  return (
    <>
      <GoogleTagManager />
      <GoogleAnalytics />
      <RouterProvider router={router} />
    </>
  );
}

export default App
