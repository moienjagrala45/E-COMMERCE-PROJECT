import { useNavigate } from "react-router-dom";

function Logo({ className = "", size = "normal", clickable = true }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (clickable) {
      e.preventDefault();
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isSmall = size === "small";
  const iconHeight = isSmall ? 28 : 34;

  return (
    <div
      className={`shopease-brand-logo ${clickable ? "clickable" : ""} ${className}`}
      onClick={handleClick}
      role={clickable ? "button" : "presentation"}
      tabIndex={clickable ? 0 : -1}
      title="ShopEase Home"
    >
      <img
        src="/shopease-logo.png"
        alt="ShopEase"
        className="brand-logo-img"
        style={{
          height: `${iconHeight}px`,
          width: "auto",
          maxWidth: "42px",
          objectFit: "contain",
          display: "block",
          flexShrink: 0,
        }}
      />
      <span className="brand-wordmark">
        <span className="wordmark-shop">Shop</span>
        <span className="wordmark-ease">Ease</span>
      </span>
    </div>
  );
}

export default Logo;
