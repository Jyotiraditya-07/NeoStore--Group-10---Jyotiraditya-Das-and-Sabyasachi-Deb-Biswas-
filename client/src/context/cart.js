import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setcart] = useState([]);
  useEffect(() => {
    let existedCartItem = localStorage.getItem("cart");
    if (existedCartItem) setcart(JSON.parse(existedCartItem));
  }, []);
  return (
    <CartContext.Provider value={[cart, setcart]}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);
export { CartProvider, useCart };
