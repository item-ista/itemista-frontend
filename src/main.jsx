import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { AddressProvider } from './context/AddressContext.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <OrderProvider>
              <AddressProvider>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </AddressProvider>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
