import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';
import router from './routes/index.jsx';
import GoogleTagManager from './components/common/GoogleTagManager.jsx';
import GoogleAnalytics from './components/common/GoogleAnalytics.jsx';
import Loader from './components/common/Loader.jsx';
import './App.css'

function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    let timeoutId;

    const hideLoader = () => {
      timeoutId = window.setTimeout(() => {
        setShowPreloader(false);
      }, 1100);
    };

    if (document.readyState === 'complete') {
      hideLoader();
    } else {
      window.addEventListener('load', hideLoader, { once: true });
    }

    return () => {
      window.removeEventListener('load', hideLoader);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  if (showPreloader) {
    return <Loader />;
  }

  return (
    <>
      <GoogleTagManager />
      <GoogleAnalytics />
      <RouterProvider router={router} />
    </>
  );
}

export default App
