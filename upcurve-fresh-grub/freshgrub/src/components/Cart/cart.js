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
        // console.log("res data: ", res.data?.cartItems);
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

  const updateTotalItemsFromChild = () => {
    // setTotalItems(totalItem + 1);
    console.log("called from child");
    setModify(modify + 1);
  };

  const [modify, setModify] = useState(0);

  useEffect(() => {
    addTokenToHeaders();
  }, []);

  useEffect(() => {
    getItems();
    // }, [totalItem, cartItems]);
  }, [modify]);
  const navigate = useNavigate();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cartBody1">
      <header>
        <div
          className="continue-shopping1"
          onClick={() => {
            navigate(-1);
          }}
        >
          <i className="fa-solid fa-arrow-left fa-2xl arrow-icon"></i>
          <h3>Continue Adding items</h3>
        </div>
      </header>
      <hr />
      <section className="main-cart-section1">
        <h3>Your Cart</h3>
        <p className="total-items1">
          <h5>
            You Have{" "}
            <span className="total-items-count1">
              {totalItem ? totalItem : 0}
            </span>{" "}
            Items In Your Cart
          </h5>
        </p>

        {/* --------------------------------------------------------------------------------------------- */}
        <div className="cart-items1">
          <div className="cart-items-container1">
            {cartItems.cartItems.map((item) => (
              <Item
                key={item.id}
                {...item}
                updateParent={updateTotalItemsFromChild}
              />
            ))}
          </div>
        </div>

        <div className="card-total1">
          <h3>
            cart Total :<span>{payablePrice}</span>
          </h3>
          <Link to={`/user/checkout/${userId}`}>
            {console.log("parice", payablePrice === 0)}
            <button disabled={!payablePrice} style={{background:"orange",fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',}}>Checkout</button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Cart;
