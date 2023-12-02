import { myAxios } from "../utils/axiosAuth.js";

const getOrderHistory = async (userId) => {
  try {
    const response = await myAxios.get(`/user/checkout/${userId}/orderHistory`);
    console.log(response.data);
    // console.log(userId + "from service");
    return response;
  } catch (err) {
    throw err;
  }
};

export default getOrderHistory;
