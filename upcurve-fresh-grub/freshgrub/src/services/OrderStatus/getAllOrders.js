// import { myAxios } from "../utils/axiosAuth.js";

// const getAllOrders = async (userId) => {
//   try {
//     const response = await myAxios.get(
//       `/user/checkout/${userId}/ordersForVendor`
//     );
//     console.log(response.data + " from vendor orderr call");
//     console.log(userId + "from GetAllOrders for vednor");
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

// export default getAllOrders;

import { myAxios } from "../utils/axiosAuth.js";

const getAllOrders = async (userId, pageNumber, pageSize, tab) => {
  try {
    console.log(
      "Request URL: " +
        myAxios.defaults.baseURL +
        `/user/checkout/${userId}/ordersForVendor?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    const response = await myAxios.get(
      `/user/checkout/${userId}/ordersForVendor`,
      {
        params: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          type: tab,
        },
      }
    );
    console.log(response.data + " Heloo  from vendor orderr call");
    console.log("page number is " + pageNumber + " Page size is " + pageSize);
    // console.log(userId + "from GetAllOrders for vednor");
    return response;
  } catch (err) {
    throw err;
  }
};

export default getAllOrders;
