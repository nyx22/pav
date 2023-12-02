import { myAxios } from "../utils/axiosAuth.js";

const updateStatus = async (userId, orderid, status) => {
  try {
    console.log("hello from api statusUpdate");
    const response = await myAxios.post(
      `/user/checkout/${userId}/updateOrderStatus`,
      {},
      {
        params: {
          orderId: orderid,
          newStatus: status,
        },
      }
    );
    console.log(response.data + " from update orderStatus api call");
    return response;
  } catch (err) {
    throw err;
  }
};

export default updateStatus;
