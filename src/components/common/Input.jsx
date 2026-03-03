import './Input.css';

const Input = ({ label, error, ...props }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input {...props} />
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default Input;
