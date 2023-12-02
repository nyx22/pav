import { useEffect, useRef, useState } from "react";
import "./profile.css";
import { Link, useParams } from "react-router-dom";
import user from "./img/user.svg";
import wallet from "./img/walletBalance.svg";
import order from "./img/orderHistory.svg";
import logout from "./img/logout.svg";
import jwtDecode from "jwt-decode";
import getWalletAmount from "../../services/Order/getWalletAmount";
import { doLogout } from "../../auth";
import { addTokenToHeaders } from "../../services/utils/jwtTokenHelper";

function DropdownItem(props) {
	const handleClick = () => {
		if (props.onClick) {
			props.onClick();
		}
	};

	return (
		<Link to={props.to} className='list'>
			<li className='dropdownItem' onClick={handleClick}>
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
	console.log("decodedValue: ", decodedValue);
	const userId = decodedValue.id;
	const email = decodedValue.email;

	const [walletAmount, setWalletAmount] = useState(null);

	const getWallet = async () => {
		const res = await getWalletAmount(userId);
		if (res.data?.success) {
			setWalletAmount(res.data);
			console.log("res data from OrderAction: ", res.data);
		}
	};

	useEffect(() => {
		addTokenToHeaders();
		getWallet();
	}, []);

  const catMenu = useRef(null);
  const closeOpenMenus = (e) => {
    if (catMenu.current && isOpen && !catMenu.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  document.addEventListener("mousedown", closeOpenMenus);

	return (
		<div className='profile' ref={catMenu}>
			<div>
				<button
					onClick={() => {
						setIsOpen(!isOpen);
					}}
					className='menu-trigger'
				>
					<img src={user} alt='User' />
				</button>
			</div>
			{isOpen && (
				<div className='menu'>
					<h3>{email}</h3>
					<hr />
					<ul>
						<DropdownItem
							img={wallet}
							text={"Wallet Balance"}
							onClick={() => {
								alert("Your balance is " + walletAmount.walletAmount);
							}}
						/>
						<DropdownItem
							img={order}
							text={"Order History"}
							to={`/user/checkout/${userId}/orderHistory`}
						/>
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
