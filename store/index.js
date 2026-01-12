import { reactive, computed } from 'vue';

const state = reactive({
  cart: [],
  shopName: '廊坊市广阳万达店'
});

export const requestStore = () => {
    
  const addToCart = (dish, spec = null, quantity = 1) => {
    // 生成唯一ID，如果有规格则包含规格ID
    const key = spec ? `${dish.id}-${spec.name}` : `${dish.id}`;
    
    const existingItem = state.cart.find(item => item._key === key);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      state.cart.push({
        ...dish,
        _key: key,
        spec: spec,
        price: spec ? spec.price : dish.price, // 使用规格价或原价
        quantity: quantity
      });
    }
  };

  const removeFromCart = (dishKey) => {
    const index = state.cart.findIndex(item => item._key === dishKey);
    if (index > -1) {
      state.cart.splice(index, 1);
    }
  };

  const updateQuantity = (dishKey, delta) => {
    const item = state.cart.find(item => item._key === dishKey);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        removeFromCart(dishKey);
      }
    }
  };

  const clearCart = () => {
    state.cart.splice(0, state.cart.length);
  };

  const totalCount = computed(() => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const totalPrice = computed(() => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

  return {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalCount,
    totalPrice
  };
};
