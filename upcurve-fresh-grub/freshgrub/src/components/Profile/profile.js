import { useEffect, useRef, useState } from "react";
import "./profile.css";
import { Link, useParams } from "react-router-dom";
import user from "./img/user.svg";
import wallet from "./img/walletBalance.svg";
import order from "./img/orderHistory.svg";
import logout from "./img/logout.svg";
import orderManagement from "./img/order-management-7.svg";
import jwtDecode from "jwt-decode";
import "../OrderPage/OrderActions.css";
import getWalletAmount from "../../services/Order/getWalletAmount";
import { doLogout } from "../../auth";
import {
  addTokenToHeaders,
  authenticateUser,
  authenticateVendor,
} from "../../services/utils/jwtTokenHelper";
import { toast } from "react-toastify";

function DropdownItem(props) {
  const handleClick = () => {
    if (props.onClick) {
      props.onClick();
    }
  };

  return (
    <Link to={props.to} className="list">
      <li className="dropdownItem" onClick={handleClick}>
        <img src={props.img} alt={props.text} />
        <span> {props.text} </span>
      </li>
    </Link>
  );
}

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const localStorageData = sessionStorage.getItem("data");
  const token = JSON.parse(localStorageData).token;
  const decodedValue = jwtDecode(token);
  console.log("hello decodedValue: ", decodedValue);
  const userId = decodedValue.id;
  const email = decodedValue.email;
  const role = decodedValue.role;
  //----------------------------------------------------------
  const [walletAmount, setWalletAmount] = useState(0);

  const getWallet = async (showAlert) => {
    const res = await getWalletAmount(userId);
    if (res.data?.success) {
      setWalletAmount(res.data.walletAmount);
      if (showAlert) {
        if (role === "user")
          toast.success(
            "Your wallet balance is : \u20B9 " + res.data.walletAmount,
            {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 3000, // Automatically close after 3 seconds
              className: "custom-toast custom-toast-success ",
            }
          );
        else
          toast.success("Today's earnings : \u20B9 " + res.data.walletAmount, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000, // Automatically close after 3 seconds
            className: "custom-toast custom-toast-success  ",
          });
      }
      console.log("res data from OrderAction hellooo: ", res.data);
    }
  };

  useEffect(() => {
    addTokenToHeaders();
    getWallet();
  }, []);

  //------------------------------------------------------------
  const catMenu = useRef(null);
  const closeOpenMenus = (e) => {
    if (catMenu.current && isOpen && !catMenu.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  document.addEventListener("mousedown", closeOpenMenus);

  //-----------------------------------------------------------

  return (
    <div className="profile" ref={catMenu}>
      <div>
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className="menu-trigger"
        >
          <img src={user} alt="User" />
        </button>
      </div>
      {isOpen && (
        <div className="menu">
          <h3>{email}</h3>
          <hr />
          <ul>
            {role === "user" && (
              <>
                <DropdownItem
                  img={wallet}
                  text={"Wallet Balance"}
                  // onClick={alertWallet}
                  onClick={async () => {
                    await getWallet(true);
                  }}
                />
                <DropdownItem
                  img={order}
                  text={"Order History"}
                  to={`/user/checkout/${userId}/orderHistory`}
                />
              </>
            )}
            {role === "vendor" && (
              <>
                <DropdownItem
                  img={wallet}
                  text={"Today's Earnings"}
                  onClick={async () => {
                    await getWallet(true);
                  }}
                />
                <DropdownItem
                  img={orderManagement}
                  text={"Manage Orders"}
                  to={"/vendor/OrderStatus"}
                />
              </>
            )}
            <DropdownItem
              img={logout}
              text={"Logout"}
              onClick={doLogout}
              to={"/"}
            />
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
