import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router';
import { ChevronLeft, Star, Camera, X, Loader2, Check } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useOrder } from '../../hooks/useOrder';
import { useNotification } from '../../hooks/useNotification';
import { reviewService } from '../../services/reviewService';
import './AddReview.css';

const AddReview = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const { getOrderById } = useOrder();
  const { showSuccess, showError } = useNotification();

  const [order, setOrder] = useState(null);
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState([]); // { file, preview }
  const [submitting, setSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!orderId || !productId || !user) {
        setLoading(false);
        return;
      }

      const foundOrder = getOrderById(orderId);
      if (!foundOrder) {
        setLoading(false);
        return;
      }
      setOrder(foundOrder);

      // Find the product from order items
      const orderItem = foundOrder.items?.find(
        (item) => item.id === productId || item.product_id === productId
      );
      if (orderItem) {
        setProduct(orderItem);
      }

      // Check if already reviewed
      const reviewed = await reviewService.hasUserReviewed(user.id, orderId, productId);
      setAlreadyReviewed(reviewed);
      setLoading(false);
    };

    init();
  }, [orderId, productId, user, getOrderById]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      showError('Maximum 5 images allowed');
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      showError('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      showError('Please write a review');
      return;
    }

    try {
      setSubmitting(true);

      // Upload images first
      const uploadedUrls = [];
      for (const img of images) {
        const url = await reviewService.uploadReviewImage(user.id, img.file);
        uploadedUrls.push(url);
      }

      // Get customer name from user metadata or order
      const customerName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        order?.customer_name ||
        user?.email?.split('@')[0] ||
        'Customer';

      // Submit review
      await reviewService.submitReview({
        productId,
        userId: user.id,
        orderId,
        rating,
        reviewText: reviewText.trim(),
        images: uploadedUrls,
        customerName,
      });

      showSuccess('Review submitted successfully!');
      navigate(`/orders/${orderId}`);
    } catch (err) {
      console.error('Submit review error:', err);
      showError('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-review-page">
        <div className="ar-loading">
          <Loader2 className="spinner" size={40} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!order || !product) {
    return (
      <div className="add-review-page">
        <div className="ar-error">
          <h2>Order or Product not found</h2>
          <Link to="/orders" className="ar-back-link">Back to Orders</Link>
        </div>
      </div>
    );
  }

  if (alreadyReviewed) {
    return (
      <div className="add-review-page">
        <div className="ar-already-reviewed">
          <div className="ar-check-icon">
            <Check size={48} />
          </div>
          <h2>Already Reviewed</h2>
          <p>You have already submitted a review for this product from this order.</p>
          <Link to={`/orders/${orderId}`} className="ar-back-link">Back to Order</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="add-review-page">
      <div className="ar-header">
        <button className="ar-back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h1>Write a Review</h1>
      </div>

      {/* Product Preview Card */}
      <div className="ar-product-card">
        <div className="ar-product-img">
          <img src={product.image || '/placeholder-product.jpg'} alt={product.name} />
        </div>
        <div className="ar-product-info">
          <h3 className="ar-product-name">{product.name || product.title}</h3>
          <p className="ar-product-price">Rs. {product.price?.toLocaleString()}</p>
          {product.quantity && (
            <span className="ar-product-qty">Qty: {product.quantity}</span>
          )}
        </div>
      </div>

      <form className="ar-form" onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="ar-rating-section">
          <label className="ar-label">Your Rating</label>
          <div className="ar-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`ar-star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={36}
                  fill={star <= (hoverRating || rating) ? '#FFC107' : 'none'}
                  color={star <= (hoverRating || rating) ? '#FFC107' : '#ddd'}
                />
              </button>
            ))}
          </div>
          <span className="ar-rating-text">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </span>
        </div>

        {/* Review Text */}
        <div className="ar-text-section">
          <label className="ar-label" htmlFor="review-text">Your Review</label>
          <textarea
            id="review-text"
            className="ar-textarea"
            placeholder="Share your experience with this product... What did you like? What could be better?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            maxLength={1000}
          />
          <span className="ar-char-count">{reviewText.length}/1000</span>
        </div>

        {/* Image Upload */}
        <div className="ar-images-section">
          <label className="ar-label">Add Photos (Optional)</label>
          <p className="ar-images-hint">Add up to 5 photos to help other buyers</p>
          
          <div className="ar-images-grid">
            {images.map((img, index) => (
              <div key={index} className="ar-image-preview">
                <img src={img.preview} alt={`Upload ${index + 1}`} />
                <button
                  type="button"
                  className="ar-image-remove"
                  onClick={() => removeImage(index)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="ar-image-upload-btn">
                <Camera size={24} />
                <span>Add Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  hidden
                />
              </label>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="ar-submit-btn"
          disabled={submitting || rating === 0 || !reviewText.trim()}
        >
          {submitting ? (
            <>
              <Loader2 className="spinner" size={20} />
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddReview;
