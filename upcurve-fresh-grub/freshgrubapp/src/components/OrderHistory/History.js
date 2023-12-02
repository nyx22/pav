import { useParams } from "react-router-dom";
import "./History.css";
import { useEffect, useState } from "react";
import getOrderHistory from "../../services/Order/getOrderHistory";
import Item from "./item";
import jwtDecode from "jwt-decode";
import Loading from "../Loading/loading";

const History = () => {
  const localStorageData = sessionStorage.getItem("data");
  const token = JSON.parse(localStorageData).token;
  const decodedValue = jwtDecode(token);
  console.log("decodedValue: ", decodedValue);
  const userId = decodedValue.id;

  // const userId = useParams().userId;

  const [loading, setLoading] = useState(true);

  const [orderedItems, setOrderedItems] = useState([]);

  const getOrderedItems = async () => {
    try {
      const res = await getOrderHistory(userId);
      if (res.data?.success) {
        setOrderedItems(res.data);
        console.log("order history data: ", res.data?.cartItems);
        console.log(orderedItems);
      }
    } catch (error) {
      console.error("Error fetching ordered items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  if(userId){
    getOrderedItems();
  }
  },[userId]);

  if (loading) {
    return <Loading />;
  }

  const groupedItems = new Map();

  orderedItems.cartItems.forEach((item) => {
    const [year, month, date] = item.date;
    const [hour, minute, second] = item.time;

    const formattedDatetime = `${date}-${month}-${year} ${hour}:${minute}:${second}`;

    if (!groupedItems.has(formattedDatetime)) {
      groupedItems.set(formattedDatetime, []);
    }
    groupedItems.get(formattedDatetime).push(item);
  });

  const sortedGroups = Array.from(groupedItems.entries()).sort(
    ([datetimeA], [datetimeB]) => {
      return new Date(datetimeB) - new Date(datetimeA);
    }
  );

  const maxItems = 10;

  if (!orderedItems || orderedItems.cartItems.length === 0) {
    return (
      <div class="orderBody">
        <h1 className="noItems">Seems like you haven't ordered anything :( </h1>
      </div>
    );
  }

  return (
    <div class="orderBody">
      <p class="heading">Order History</p>
      {sortedGroups.slice(0, maxItems).map(([datetime, items]) => (
        <div key={datetime} className="container">
          <div className="summary">
            <p classNames="date">{datetime}</p>
            {/* <p classNames="totalPrice">Total: &#8377; 400</p> */}
          </div>
          {items
            .sort(
              (a, b) =>
                new Date(`${b.date} ${b.time}`) -
                new Date(`${a.date} ${a.time}`)
            )
            .map((item) => (
              <Item key={item._id} {...item} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default History;
