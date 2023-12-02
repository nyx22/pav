import "./cart.css";
import getAllItemsInCart from "../../services/Cart/getAllCartItems";
import { useEffect, useState } from "react";
import {
  Link,
  Router,
  useParams,
  useHistory,
  useNavigate,
} from "react-router-dom";
import Item from "./item";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";
import Loading from "../Loading/loading";

const Cart = () => {
  const userId = useParams().userId;

  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(null);
  const [totalItem, setTotalItems] = useState();

  const [payablePrice, setPayablePrice] = useState(0);
  const getItems = async () => {
    try {
      const res = await getAllItemsInCart(userId);
      if (res.data?.success) {
        setCartItems(res.data);
        console.log("res data: ", res.data?.cartItems);
        setTotalItems(
          res.data?.cartItems.reduce((acc, item) => acc + item?.qty, 0)
        );
        //Calculate payablePrice
        const totalPrice = res.data?.cartItems.reduce(
          (acc, item) => acc + item?.qty * item?.item[0]?.price,
          0
        );
        setPayablePrice(totalPrice);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  //   const getItems = async () => {
  //     const res = await getAllItemsInCart(userId);
  //     if (res.data?.success) {
  //       setCartItems(res.data);
  //       console.log("res data: ", res.data?.cartItems);
  //       setTotalItems(
  //         res.data?.cartItems.reduce((acc, item) => acc + item?.qty, 0)
  //       );
  //     }
  //   };

  //   const payablePrice = cartItems?.cartItems.reduce(
  //     (acc, item) => acc + item?.qty * item?.item[0]?.price,
  //     0
  //   );

  const updateTotalItemsFromChild = () => {
    setTotalItems(totalItem + 1);
  };

  useEffect(() => {
    addTokenToHeaders();
  }, []);

  useEffect(() => {
    getItems();
  }, [totalItem]);

  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cartBody">
      {console.log(cartItems)}
      <header>
        <div
          className="continue-shopping"
          onClick={() => {
            navigate(-1);
          }}
        >
          <i className="fa-solid fa-arrow-left fa-2xl arrow-icon"></i>
          <h3>Continue Adding items</h3>
        </div>
      </header>
      <hr />
      <section className="main-cart-section">
        <h3>Your Cart</h3>
        <p className="total-items">
          <h5>
            You Have{" "}
            <span className="total-items-count">
              {totalItem ? totalItem : 0}
            </span>{" "}
            Items In Your Cart
          </h5>
        </p>

        {/* --------------------------------------------------------------------------------------------- */}
        <div className="cart-items">
          <div className="cart-items-container">
            {cartItems.cartItems.map((item) => (
              <Item
                key={item.id}
                {...item}
                updateParent={updateTotalItemsFromChild}
              />
            ))}
          </div>
        </div>

        <div className="card-total">
          <h3>
            cart Total :<span>{payablePrice}</span>
          </h3>
          <Link to={`/user/checkout/${userId}`}>
            {console.log("parice", payablePrice === 0)}
            <button disabled={!payablePrice}>Checkout</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Cart;
