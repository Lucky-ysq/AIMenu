import { reactive, computed } from 'vue';

const state = reactive({
  cart: [],
  shopName: '廊坊市广阳万达店',
  categories: [
    { id: 'new', name: '新锅上市' },
    { id: 'fish', name: '烤鱼涮菜' },
    { id: 'fried', name: '炸货' },
    { id: 'bbq', name: '烧烤' },
    { id: 'snack', name: '美味小食' },
    { id: 'wine', name: '喝点小酒' }
  ],
  goods: [
    // 新锅上市
    {
      id: 'g1',
      categoryId: 'new',
      name: '海带苗',
      desc: '爽脆开胃，适合涮煮',
      price: 16,
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=60',
      ingredients: '海带苗',
      method: '洗净切段，涮煮'
    },
    {
      id: 'g2',
      categoryId: 'new',
      name: '脆竹笋',
      desc: '清爽脆嫩，口感扎实',
      price: 14,
      image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1200&q=60',
      ingredients: '竹笋',
      method: '切片焯水'
    },
    {
      id: 'g3',
      categoryId: 'new',
      name: '金针菇',
      desc: '菌香浓郁，越煮越入味',
      price: 16,
      image: 'https://images.unsplash.com/photo-1604909053193-9b1a0a0a0c4a?auto=format&fit=crop&w=1200&q=60',
      ingredients: '金针菇',
      method: '洗净去根'
    },
    {
      id: 'g6',
      categoryId: 'new',
      name: '土豆片',
      desc: '软糯香甜，吸汤入味',
      price: 10,
      image: 'https://images.unsplash.com/photo-1604909054034-c1af9cbd8768?auto=format&fit=crop&w=1200&q=60',
      ingredients: '土豆',
      method: '切片'
    },
    {
      id: 'g7',
      categoryId: 'new',
      name: '贡菜',
      desc: '爽脆清香，越涮越脆',
      price: 12,
      image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=60',
      ingredients: '干贡菜',
      method: '泡发切段'
    },
    {
      id: 'g8',
      categoryId: 'new',
      name: '豆腐皮',
      desc: '豆香浓郁，口感筋道',
      price: 11,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60',
      ingredients: '豆腐皮',
      method: '切丝或块'
    },

    // 烤鱼涮菜
    {
      id: 'g9',
      categoryId: 'fish',
      name: '藕片',
      desc: '爽脆可口',
      price: 12,
      image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60',
      ingredients: '莲藕',
      method: '切片'
    },
    {
      id: 'g10',
      categoryId: 'fish',
      name: '娃娃菜',
      desc: '清甜爽口',
      price: 9,
      image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=1200&q=60',
      ingredients: '娃娃菜',
      method: '洗净掰开'
    },
    {
      id: 'g11',
      categoryId: 'fish',
      name: '宽粉',
      desc: 'Q弹筋道，吸汁更香',
      price: 8,
      image: 'https://images.unsplash.com/photo-1604909053158-2d2a3b7d6c02?auto=format&fit=crop&w=1200&q=60',
      ingredients: '红薯宽粉',
      method: '泡发'
    },
    {
      id: 'g12',
      categoryId: 'fish',
      name: '鱼豆腐',
      desc: '鲜香软嫩',
      price: 13,
      image: 'https://images.unsplash.com/photo-1604909053115-b17b54c32dce?auto=format&fit=crop&w=1200&q=60',
      ingredients: '鱼肉糜、淀粉',
      method: '成型煮熟'
    },
    {
      id: 'g13',
      categoryId: 'fish',
      name: '腐竹',
      desc: '豆香浓郁，越煮越入味',
      price: 15,
      image: 'https://images.unsplash.com/photo-1604909053055-17e4430ebdc8?auto=format&fit=crop&w=1200&q=60',
      ingredients: '干腐竹',
      method: '冷水泡发'
    },
    {
      id: 'g14',
      categoryId: 'fish',
      name: '生菜',
      desc: '清爽解腻',
      price: 8,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=60',
      ingredients: '生菜',
      method: '洗净'
    },

    // 炸货
    {
      id: 'g15',
      categoryId: 'fried',
      name: '炸鸡柳',
      desc: '外酥里嫩',
      price: 18,
      image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=60',
      ingredients: '鸡胸肉',
      method: '裹粉油炸'
    },
    {
      id: 'g16',
      categoryId: 'fried',
      name: '炸薯条',
      desc: '香脆可口',
      price: 15,
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=60',
      ingredients: '土豆',
      method: '切条油炸'
    },
    {
      id: 'g17',
      categoryId: 'fried',
      name: '炸洋葱圈',
      desc: '外酥内甜',
      price: 14,
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1200&q=60',
      ingredients: '洋葱',
      method: '裹粉圈炸'
    },
    {
      id: 'g18',
      categoryId: 'fried',
      name: '炸鸡米花',
      desc: '一口一个',
      price: 16,
      image: 'https://images.unsplash.com/photo-1626082929543-1f3fdd7f7f8a?auto=format&fit=crop&w=1200&q=60',
      ingredients: '鸡腿肉',
      method: '切丁裹粉炸'
    },
    {
      id: 'g19',
      categoryId: 'fried',
      name: '炸年糕',
      desc: '糯叽叽更香',
      price: 12,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60',
      ingredients: '年糕条',
      method: '油炸刷酱'
    },
    {
      id: 'g20',
      categoryId: 'fried',
      name: '炸蘑菇',
      desc: '菌香酥脆',
      price: 15,
      image: 'https://images.unsplash.com/photo-1625944523994-2b83cd8b67f5?auto=format&fit=crop&w=1200&q=60',
      ingredients: '平菇',
      method: '裹面糊炸'
    },

    // 烧烤
    {
      id: 'g21',
      categoryId: 'bbq',
      name: '羊肉串',
      desc: '孜然香浓',
      price: 6,
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60',
      ingredients: '羊腿肉',
      method: '炭火烧烤'
    },
    {
      id: 'g22',
      categoryId: 'bbq',
      name: '鸡翅',
      desc: '外焦里嫩',
      price: 12,
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60',
      ingredients: '鸡中翅',
      method: '腌制烧烤'
    },
    {
      id: 'g23',
      categoryId: 'bbq',
      name: '烤香肠',
      desc: '咸香多汁',
      price: 8,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=60',
      ingredients: '肉肠',
      method: '改刀烧烤'
    },
    {
      id: 'g24',
      categoryId: 'bbq',
      name: '烤玉米',
      desc: '香甜软糯',
      price: 10,
      image: 'https://images.unsplash.com/photo-1598514982077-efb9c2c8f3c2?auto=format&fit=crop&w=1200&q=60',
      ingredients: '甜玉米',
      method: '刷酱烧烤'
    },
    {
      id: 'g25',
      categoryId: 'bbq',
      name: '烤茄子',
      desc: '蒜香浓郁',
      price: 14,
      image: 'https://images.unsplash.com/photo-1625944523994-2b83cd8b67f5?auto=format&fit=crop&w=1200&q=60',
      ingredients: '长茄子、蒜蓉',
      method: '剖开加蒜蓉烤'
    },
    {
      id: 'g26',
      categoryId: 'bbq',
      name: '烤韭菜',
      desc: '香气十足',
      price: 6,
      image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=60',
      ingredients: '宽叶韭菜',
      method: '刷油烧烤'
    },

    // 美味小食
    {
      id: 'g27',
      categoryId: 'snack',
      name: '毛豆',
      desc: '下酒小菜',
      price: 10,
      image: 'https://images.unsplash.com/photo-1532634896-26909d0d4bfe?auto=format&fit=crop&w=1200&q=60',
      ingredients: '新鲜毛豆',
      method: '盐水煮'
    },
    {
      id: 'g28',
      categoryId: 'snack',
      name: '拍黄瓜',
      desc: '清爽解腻',
      price: 9,
      image: 'https://images.unsplash.com/photo-1625944524083-7daaf79cd13e?auto=format&fit=crop&w=1200&q=60',
      ingredients: '黄瓜、蒜泥',
      method: '拍碎凉拌'
    },
    {
      id: 'g29',
      categoryId: 'snack',
      name: '花生米',
      desc: '香脆可口',
      price: 8,
      image: 'https://images.unsplash.com/photo-1598514982060-9a79b62f06b4?auto=format&fit=crop&w=1200&q=60',
      ingredients: '花生',
      method: '油炸'
    },
    {
      id: 'g30',
      categoryId: 'snack',
      name: '凉拌木耳',
      desc: '爽脆弹牙',
      price: 11,
      image: 'https://images.unsplash.com/photo-1604909053178-d6d3c6c2a5e4?auto=format&fit=crop&w=1200&q=60',
      ingredients: '黑木耳',
      method: '焯水凉拌'
    },
    {
      id: 'g31',
      categoryId: 'snack',
      name: '凉拌海带丝',
      desc: '酸辣开胃',
      price: 10,
      image: 'https://images.unsplash.com/photo-1526318896989-ef7c0a0f4a87?auto=format&fit=crop&w=1200&q=60',
      ingredients: '海带丝',
      method: '凉拌'
    },
    {
      id: 'g32',
      categoryId: 'snack',
      name: '小酥肉',
      desc: '酥香不腻',
      price: 18,
      image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=60',
      ingredients: '猪瘦肉',
      method: '挂糊炸'
    },

    // 喝点小酒
    {
      id: 'g33',
      categoryId: 'wine',
      name: '喜力啤酒',
      desc: '冰爽畅饮（活动价）',
      price: 6,
      image: 'https://images.unsplash.com/photo-1514361892635-eae31a0f8d98?auto=format&fit=crop&w=1200&q=60',
      ingredients: '麦芽、水',
      method: '发酵'
    },
    {
      id: 'g34',
      categoryId: 'wine',
      name: '青岛啤酒',
      desc: '经典口味',
      price: 8,
      image: 'https://images.unsplash.com/photo-1514361892635-eae31a0f8d98?auto=format&fit=crop&w=1200&q=60',
      ingredients: '麦芽、大米',
      method: '发酵'
    },
    {
      id: 'g35',
      categoryId: 'wine',
      name: '可乐',
      desc: '冰镇更爽',
      price: 5,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60',
      ingredients: '水、糖浆',
      method: '调配'
    },
    {
      id: 'g36',
      categoryId: 'wine',
      name: '雪碧',
      desc: '气泡十足',
      price: 5,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60',
      ingredients: '水、柠檬香精',
      method: '调配'
    },
    {
      id: 'g37',
      categoryId: 'wine',
      name: '酸梅汤',
      desc: '解腻佳品',
      price: 7,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60',
      ingredients: '乌梅、山楂',
      method: '熬煮'
    },
    {
      id: 'g38',
      categoryId: 'wine',
      name: '柠檬水',
      desc: '清爽回甘',
      price: 6,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60',
      ingredients: '柠檬、水',
      method: '冷泡'
    }
  ]
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

  const addDish = (dish) => {
    state.goods.push(dish);
  };

  const deleteDish = (id) => {
    const index = state.goods.findIndex(g => g.id === id);
    if (index > -1) {
      state.goods.splice(index, 1);
    }
    // Also remove from cart if present
    const cartItemsToRemove = state.cart.filter(item => String(item.id) === String(id));
    cartItemsToRemove.forEach(item => {
      removeFromCart(item._key);
    });
  };

  const totalCount = computed(() => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const totalPrice = computed(() => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

  return {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addDish,
    deleteDish,
    totalCount,
    totalPrice
  };
};
