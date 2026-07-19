/**
 * Safepay Checkout Button - Vanilla JS Integration (React 19 Compatible)
 * We avoid using safepay.Button.driver('react') because it uses findDOMNode,
 * which is removed in React 19. Instead, we use the Vanilla JS .render() 
 * method with a React ref.
 */
import * as safepayModule from '@sfpy/checkout-components';
import { useEffect, useRef } from 'react';

// Safepay might be exported as a default or as the module itself in Vite/ESM
const safepay = safepayModule.default || safepayModule;

const SafepayCheckoutButton = (props) => {
  const containerRef = useRef(null);
  const buttonInstanceRef = useRef(null);

  useEffect(() => {
    if (!safepay || !safepay.Button || !containerRef.current) return;

    // cleanup previous instance if it exists
    const cleanup = async () => {
      if (buttonInstanceRef.current) {
        try {
          await buttonInstanceRef.current.close();
        } catch (e) {
          // ignore cleanup errors
        }
        buttonInstanceRef.current = null;
      }
    };

    const renderButton = async () => {
      await cleanup();
      
      // Ensure container is empty before rendering
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      try {
        const button = safepay.Button({
          env: props.env,
          client: props.client,
          style: props.style,
          orderId: props.orderId,
          source: props.source,
          payment: props.payment,
          onPayment: props.onPayment,
          onCancel: props.onCancel,
        });

        buttonInstanceRef.current = button;
        await button.render(containerRef.current);
      } catch (error) {
        console.error('Safepay Button render error:', error);
      }
    };

    renderButton();

    return () => {
      // In React 19 / StrictMode, we need to be careful with cleanup
      // but closing the instance is generally the right way.
    };
  }, [props.orderId, props.payment?.amount, props.env]);

  if (!safepay || !safepay.Button) {
    return (
      <div style={{ 
        border: '1px solid #fee2e2', 
        background: '#fef2f2', 
        color: '#991b1b', 
        padding: '16px', 
        borderRadius: '12px',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        ⚠️ Safepay SDK could not be initialized. Please refresh.
      </div>
    );
  }

  return <div ref={containerRef} id="safepay-button-container" style={{ width: '100%', minHeight: '50px' }}></div>;
};

export default SafepayCheckoutButton;
