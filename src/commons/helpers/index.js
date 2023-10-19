export const formattedOrders = (orders, WEEK_DAYS) => {
  return orders.map((order) => {
    const currentDate = new Date(order.scheduled._seconds * 1000 + order.scheduled._nanoseconds / 1000000);
    const localDate = new Date(currentDate.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const formattedDate = `${("0" + localDate.getDate()).slice(-2)}/${("0" + (localDate.getMonth() + 1)).slice(-2)}/${localDate.getFullYear()} - ${WEEK_DAYS[localDate.getDay()]}`;
    return { ...order, formattedDate };
  });
}

export const sortedOrders = (orders) => {
  return orders.sort((a, b) => {
    const dateA = new Date(a.scheduled._seconds * 1000 + a.scheduled._nanoseconds / 1000000);
    const dateB = new Date(b.scheduled._seconds * 1000 + b.scheduled._nanoseconds / 1000000);
    return dateB - dateA;
  });
}
