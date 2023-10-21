import { getOrders } from "../../services";

export const checkUserPurchases = async (date, location, uuid) => {
  const userPurchases = await getOrders(uuid);
  const hasPurchase = userPurchases.some(order => {
    return (
      order.scheduled?._seconds === Math.floor(date.getTime() / 1000) &&
      order.local === location
    );
  });

  sessionStorage.setItem('hasPurchase', JSON.stringify(hasPurchase));

  return hasPurchase;
};
