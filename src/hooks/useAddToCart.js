import { useState } from "react";
import { useCart } from "../context/CartContext";

/**
 * Handles add-to-cart logic with flying item animation.
 * @param {object} product - The product to add to cart.
 */
export function useAddToCart(product) {
  const { addToCart } = useCart();
  const [flyingItem, setFlyingItem] = useState(null);

  const handleAddToCart = (e) => {
    if (flyingItem) return;

    const buttonRect = e.currentTarget.getBoundingClientRect();
    const cartIcon = document.getElementById("global-cart-icon");

    if (cartIcon) {
      const cartRect = cartIcon.getBoundingClientRect();

      setFlyingItem({
        id: Date.now(),
        image: product.image,
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: cartRect.left + cartRect.width / 2,
        endY: cartRect.top + cartRect.height / 2,
      });

      addToCart(product);

      setTimeout(() => {
        setFlyingItem(null);
      }, 1000);
    } else {
      addToCart(product);
    }
  };

  return { flyingItem, handleAddToCart };
}
