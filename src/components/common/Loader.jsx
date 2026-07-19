import './Loader.css';

const Loader = () => {
  return (
    <div className="preloader" role="status" aria-live="polite" aria-label="Loading website">
      <div className="preloader__stage">
        <img
          src="/ItemIstaPink.png"
          alt="ItemIsta"
          className="preloader__logo"
          draggable="false"
        />

        <p className="preloader__headline">ITEMISTA</p>
        <p className="preloader__subline">FREAKING USEFUL DEALS</p>

        <div className="preloader__line" aria-hidden="true">
          <span className="preloader__lineFill"></span>
        </div>

        <p className="preloader__text">LOADING...</p>
      </div>
    </div>
  );
};

export default Loader;
