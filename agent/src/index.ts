import { orderApi } from "./lib/index.js";

const data = {
  customerName: "Trường đẹp trai",
  customerPhone: "0329257844",
  customerAddress: "xóm mây, vạn phú, thái nguyên",
  customerEmail: null,
  items: [{ productId: 2, quantity: 1 }],
  note: null,
};

try {
  const result = await orderApi.createOrder(data);
  console.log(result);
} catch (error) {
  console.error(error);
}
