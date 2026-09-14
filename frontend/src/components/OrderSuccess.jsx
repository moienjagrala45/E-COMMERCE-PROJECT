import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  let order = location.state?.order;

  if (!order) {
    const savedOrder = localStorage.getItem("latestOrder");

    if (savedOrder) {
      try {
        order = JSON.parse(savedOrder);
      } catch (error) {
        console.error("Order parsing error:", error);
      }
    }
  }

  const goToShop = () => {
    navigate("/home", {
      replace: true,
      state: { scrollTo: "products" },
    });
  };

  if (!order) {
    return (
      <section className="thankyou-page">
        <div className="thankyou-card">
          <div className="thankyou-badge">ShopEase</div>
          <h1>We could not find this order</h1>
          <p className="thankyou-lead">
            Your payment may still be processing. Browse the store while we
            keep your next favorites ready.
          </p>
          <button className="thankyou-shop-btn" onClick={goToShop}>
            Continue Shopping →
          </button>
        </div>
      </section>
    );
  }

  const shippingAddress = order.shippingAddress || {};

  let savedUserName = "";

  try {
    savedUserName = JSON.parse(localStorage.getItem("user") || "{}")?.name;
  } catch {
    savedUserName = "";
  }

  const customerName =
    shippingAddress.fullName || savedUserName || "there";
  const firstName = String(customerName).trim().split(" ")[0];

  const totalPrice = Number(
    order.totalPrice ?? order.totalAmount ?? order.total ?? 0
  );

  const orderId = order._id || order.id || "N/A";
  const shortOrderId =
    String(orderId).length > 10
      ? `#${String(orderId).slice(-8).toUpperCase()}`
      : `#${orderId}`;

  const deliveryCity = [shippingAddress.city, shippingAddress.state]
    .filter(Boolean)
    .join(", ");

  const estimatedDelivery = (() => {
    const start = new Date();
    start.setDate(start.getDate() + 4);
    const end = new Date();
    end.setDate(end.getDate() + 7);

    const format = (date) =>
      date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

    return `${format(start)} – ${format(end)}`;
  })();

  return (
    <section className="thankyou-page">
      <div className="thankyou-card">
        <div className="thankyou-confetti" aria-hidden="true">
          <span>✦</span>
          <span>◆</span>
          <span>✦</span>
        </div>

        <div className="thankyou-icon">✓</div>

        <p className="thankyou-kicker">Payment confirmed</p>

        <h1>
          Thank you, {firstName}!
        </h1>

        <p className="thankyou-lead">
          Your ShopEase order is confirmed and our team is already preparing
          it with care. Sit back — we will handle packing, shipping, and
          delivery updates from here.
        </p>

        <div className="thankyou-highlight">
          <div>
            <span>Order reference</span>
            <strong>{shortOrderId}</strong>
          </div>
          <div>
            <span>Amount paid</span>
            <strong className="thankyou-amount">₹{totalPrice.toFixed(2)}</strong>
          </div>
        </div>

        <div className="thankyou-journey">
          <h2>What happens next</h2>

          <ol>
            <li>
              <strong>We received your payment</strong>
              <p>Your Razorpay payment was successful and the order is locked in.</p>
            </li>
            <li>
              <strong>We pack it with care</strong>
              <p>Items are checked, packed, and prepared to leave our warehouse.</p>
            </li>
            <li>
              <strong>It is on the way</strong>
              <p>
                Expected delivery{deliveryCity ? ` to ${deliveryCity}` : ""}:{" "}
                <em>{estimatedDelivery}</em>
              </p>
            </li>
          </ol>
        </div>

        <div className="thankyou-perks">
          <article>
            <h3>Secure &amp; verified</h3>
            <p>Your payment was processed securely through Razorpay.</p>
          </article>
          <article>
            <h3>Easy returns</h3>
            <p>Changed your mind? Reach us from Contact and we will help.</p>
          </article>
          <article>
            <h3>We are here</h3>
            <p>Questions about this order? Share your reference ID with support.</p>
          </article>
        </div>

        <p className="thankyou-note">
          Keep this order reference handy. You can always come back to ShopEase
          to discover something new — we have more picks waiting for you.
        </p>

        <button className="thankyou-shop-btn" onClick={goToShop}>
          Continue Shopping →
        </button>

        <button
          className="thankyou-help-btn"
          onClick={() => navigate("/contact")}
        >
          Need help with this order?
        </button>
      </div>
    </section>
  );
}

export default OrderSuccess;
