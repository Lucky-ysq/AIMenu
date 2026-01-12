<template>
	<view class="page">
		<!-- 顶部店铺信息 + 搜索栏 -->
		<view class="header">
			<view class="header__row">
				<view class="header__info">
					<text class="header__title">{{ store.state.shopName }}</text>
					<text class="header__sub">距您 1.2km</text>
				</view>
				<view class="header__actions" @tap="onManage">
					<view class="manage-btn">
						<text class="manage-text">菜品管理</text>
					</view>
				</view>
			</view>
			<view class="header__search" @tap="onSearch">
				<text class="search__icon">🔍</text>
				<text class="search__placeholder">搜索您想吃的菜品...</text>
			</view>
		</view>

		<!-- 促销标签 -->
		<view class="promo" @tap="onPromo">
			<text class="promo__tag">促销活动</text>
			<text class="promo__pill">喜力活动价 6 元</text>
			<text class="promo__arrow">▼</text>
		</view>

		<!-- 主体：左分类 / 右商品 -->
		<view class="main">
			<!-- 左侧分类 -->
			<scroll-view class="cats" scroll-y>
				<view
					v-for="(c, idx) in categories"
					:key="c.id"
					:class="['cat-item', activeCategoryIndex === idx ? 'is-active' : '']"
					@tap="selectCategory(idx)"
				>
					<text class="cat-item__name">{{ c.name }}</text>
					<view v-if="cCount(c.id) > 0" class="cat-item__badge">{{ cCount(c.id) }}</view>
				</view>
			</scroll-view>

			<!-- 右侧商品列表（分组 + 联动） -->
			<scroll-view
				class="goods"
				scroll-y
				:scroll-into-view="goodsScrollIntoView"
				scroll-with-animation
				@scroll="onGoodsScroll"
			>
				<view v-for="c in categories" :key="c.id" :id="`cat-${c.id}`" class="goods__section">
					<view class="goods__section-title">{{ c.name }}</view>

					<view v-for="g in goodsByCategory(c.id)" :key="g.id" class="good-card">
					<view class="good-card__media" @tap="openDetail(g)">
						<image class="good-card__img" :src="g.image" mode="aspectFill" @load="onGoodImageLoad" />
					</view>
					<view class="good-card__body" @tap="openDetail(g)">
						<text class="good-card__name">{{ g.name }}</text>
						<text class="good-card__desc">{{ g.desc }}</text>
						<view class="good-card__price-row">
							<text class="good-card__price">¥{{ g.price }}/份</text>
						</view>
					</view>
					<view class="good-card__action">
						<view v-if="itemCount(g.id) === 0" class="plus-btn" @tap.stop="add(g)">
							<text class="plus-btn__text">＋</text>
						</view>
						<view v-else class="stepper" @tap.stop>
							<view class="stepper__btn" @tap.stop="dec(g)"><text class="stepper__btn-text">－</text></view>
							<text class="stepper__count">{{ itemCount(g.id) }}</text>
							<view class="stepper__btn is-plus" @tap.stop="add(g)"><text class="stepper__btn-text">＋</text></view>
						</view>
					</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 底部购物车栏 -->
		<view class="cartbar">
			<view class="cartbar__left" @tap="openCart">
				<view class="cart-icon">
					<text class="cart-icon__bag">🛍</text>
					<view v-if="store.totalCount.value > 0" class="cart-icon__badge">{{ store.totalCount.value }}</view>
				</view>
				<text class="cartbar__price">¥{{ store.totalPrice.value.toFixed(2) }}</text>
			</view>
			<view class="cartbar__right">
				<view :class="['checkout-btn', store.totalCount.value > 0 ? 'is-active' : '']" @tap="checkout">
					<text class="checkout-btn__text">选好了</text>
				</view>
			</view>
		</view>

		<!-- 详情底部弹层 -->
		<view v-if="showDetail" class="mask" @tap="closeDetail"></view>
		<view v-if="showDetail" class="sheet">
			<view class="sheet__close" @tap="closeDetail"><text class="sheet__close-text">×</text></view>
			<image class="sheet__img" :src="currentGood?.image" mode="aspectFill" />
			<view class="sheet__content">
				<text class="sheet__name">{{ currentGood?.name }}</text>
				<text class="sheet__desc">{{ currentGood?.desc }}（模拟描述）</text>
				<view class="sheet__bottom">
					<text class="sheet__price">¥{{ currentGood?.price }}/份</text>
					<view class="sheet__step">
						<view v-if="currentGood && itemCount(currentGood.id) === 0" class="sheet__add" @tap="add(currentGood)">
							<text class="sheet__add-text">加入购物车</text>
						</view>
						<view v-else class="stepper" @tap.stop>
							<view class="stepper__btn" @tap.stop="dec(currentGood)"><text class="stepper__btn-text">－</text></view>
							<text class="stepper__count">{{ currentGood ? itemCount(currentGood.id) : 0 }}</text>
							<view class="stepper__btn is-plus" @tap.stop="add(currentGood)"><text class="stepper__btn-text">＋</text></view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 已选商品底部弹层 -->
		<view v-if="showCart" class="mask" @tap="closeCart"></view>
		<view v-if="showCart" class="sheet cart-sheet">
			<!-- 头部：标题与清空 -->
			<view class="cart-header">
				<view class="cart-header__left">
					<text class="cart-header__title">已选商品</text>
					<text class="cart-header__count">（共 {{ store.totalCount.value }} 件）</text>
				</view>
				<view class="cart-header__clear" @tap="clearCart">
					<text class="clear-icon">🗑</text>
					<text class="clear-text">清空购物车</text>
				</view>
			</view>
			
			<!-- 列表区域 -->
			<scroll-view class="cart-list" scroll-y>
				<view v-for="it in store.state.cart" :key="it._key" class="cart-row">
					<image class="cart-row__img" :src="it.image" mode="aspectFill" />
					<view class="cart-row__info">
						<text class="cart-row__name">{{ it.name }}</text>
						<view class="cart-row__meta">
							<text class="cart-row__price">¥{{ it.price }}</text>
							<text class="cart-row__unit">/份</text>
						</view>
					</view>
					
					<view class="cart-row__action">
						<view class="stepper" @tap.stop>
							<view class="stepper__btn" @tap.stop="store.updateQuantity(it._key, -1)"><text class="stepper__btn-text">－</text></view>
							<text class="stepper__count">{{ it.quantity }}</text>
							<view class="stepper__btn is-plus" @tap.stop="store.updateQuantity(it._key, 1)"><text class="stepper__btn-text">＋</text></view>
						</view>
					</view>
				</view>
				<!-- 底部留白 -->
				<view style="height: 20rpx;"></view>
			</scroll-view>
			
			<!-- 底部固定栏 -->
			<!-- 注意：这里不需要重复写 .cartbar，因为 .sheet 已经有 bottom: window-bottom 
			     但通常购物车弹起时，底部的结算条应该被包含在内或者隐藏原来的 floating bar
			     这里我们把结算逻辑整合在 sheet 底部 -->
			<view class="cart-footer">
				<view class="cart-total">
					<text class="total-label">合计</text>
					<text class="total-price">¥{{ store.totalPrice.value.toFixed(2) }}</text>
				</view>
				<view class="cart-checkout-btn" @tap="checkout">
					<text>去结算</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { computed, inject, nextTick, onMounted, ref } from 'vue'

const store = inject('store')

// --- 模拟数据 ---
const categories = ref([
	{ id: 'new', name: '新锅上市' },
	{ id: 'fish', name: '烤鱼涮菜' },
	{ id: 'fried', name: '炸货' },
	{ id: 'bbq', name: '烧烤' },
	{ id: 'snack', name: '美味小食' },
	{ id: 'wine', name: '喝点小酒' }
])

// 说明：为了能明显看出“右侧滚动 + 左侧联动”，这里每个分类都放多条数据
const goods = ref([
	// 新锅上市
	{
		id: 'g1',
		categoryId: 'new',
		name: '海带苗',
		desc: '爽脆开胃，适合涮煮',
		price: 16,
		image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g2',
		categoryId: 'new',
		name: '脆竹笋',
		desc: '清爽脆嫩，口感扎实',
		price: 14,
		image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g3',
		categoryId: 'new',
		name: '金针菇',
		desc: '菌香浓郁，越煮越入味',
		price: 16,
		image: 'https://images.unsplash.com/photo-1604909053193-9b1a0a0a0c4a?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g6',
		categoryId: 'new',
		name: '土豆片',
		desc: '软糯香甜，吸汤入味',
		price: 10,
		image: 'https://images.unsplash.com/photo-1604909054034-c1af9cbd8768?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g7',
		categoryId: 'new',
		name: '贡菜',
		desc: '爽脆清香，越涮越脆',
		price: 12,
		image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g8',
		categoryId: 'new',
		name: '豆腐皮',
		desc: '豆香浓郁，口感筋道',
		price: 11,
		image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=60'
	},

	// 烤鱼涮菜
	{
		id: 'g9',
		categoryId: 'fish',
		name: '藕片',
		desc: '爽脆可口',
		price: 12,
		image: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g10',
		categoryId: 'fish',
		name: '娃娃菜',
		desc: '清甜爽口',
		price: 9,
		image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g11',
		categoryId: 'fish',
		name: '宽粉',
		desc: 'Q弹筋道，吸汁更香',
		price: 8,
		image: 'https://images.unsplash.com/photo-1604909053158-2d2a3b7d6c02?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g12',
		categoryId: 'fish',
		name: '鱼豆腐',
		desc: '鲜香软嫩',
		price: 13,
		image: 'https://images.unsplash.com/photo-1604909053115-b17b54c32dce?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g13',
		categoryId: 'fish',
		name: '腐竹',
		desc: '豆香浓郁，越煮越入味',
		price: 15,
		image: 'https://images.unsplash.com/photo-1604909053055-17e4430ebdc8?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g14',
		categoryId: 'fish',
		name: '生菜',
		desc: '清爽解腻',
		price: 8,
		image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=60'
	},

	// 炸货
	{
		id: 'g15',
		categoryId: 'fried',
		name: '炸鸡柳',
		desc: '外酥里嫩',
		price: 18,
		image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g16',
		categoryId: 'fried',
		name: '炸薯条',
		desc: '香脆可口',
		price: 15,
		image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g17',
		categoryId: 'fried',
		name: '炸洋葱圈',
		desc: '外酥内甜',
		price: 14,
		image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g18',
		categoryId: 'fried',
		name: '炸鸡米花',
		desc: '一口一个',
		price: 16,
		image: 'https://images.unsplash.com/photo-1626082929543-1f3fdd7f7f8a?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g19',
		categoryId: 'fried',
		name: '炸年糕',
		desc: '糯叽叽更香',
		price: 12,
		image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g20',
		categoryId: 'fried',
		name: '炸蘑菇',
		desc: '菌香酥脆',
		price: 15,
		image: 'https://images.unsplash.com/photo-1625944523994-2b83cd8b67f5?auto=format&fit=crop&w=1200&q=60'
	},

	// 烧烤
	{
		id: 'g21',
		categoryId: 'bbq',
		name: '羊肉串',
		desc: '孜然香浓',
		price: 6,
		image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g22',
		categoryId: 'bbq',
		name: '鸡翅',
		desc: '外焦里嫩',
		price: 12,
		image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g23',
		categoryId: 'bbq',
		name: '烤香肠',
		desc: '咸香多汁',
		price: 8,
		image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g24',
		categoryId: 'bbq',
		name: '烤玉米',
		desc: '香甜软糯',
		price: 10,
		image: 'https://images.unsplash.com/photo-1598514982077-efb9c2c8f3c2?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g25',
		categoryId: 'bbq',
		name: '烤茄子',
		desc: '蒜香浓郁',
		price: 14,
		image: 'https://images.unsplash.com/photo-1625944523994-2b83cd8b67f5?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g26',
		categoryId: 'bbq',
		name: '烤韭菜',
		desc: '香气十足',
		price: 6,
		image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=60'
	},

	// 美味小食
	{
		id: 'g27',
		categoryId: 'snack',
		name: '毛豆',
		desc: '下酒小菜',
		price: 10,
		image: 'https://images.unsplash.com/photo-1532634896-26909d0d4bfe?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g28',
		categoryId: 'snack',
		name: '拍黄瓜',
		desc: '清爽解腻',
		price: 9,
		image: 'https://images.unsplash.com/photo-1625944524083-7daaf79cd13e?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g29',
		categoryId: 'snack',
		name: '花生米',
		desc: '香脆可口',
		price: 8,
		image: 'https://images.unsplash.com/photo-1598514982060-9a79b62f06b4?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g30',
		categoryId: 'snack',
		name: '凉拌木耳',
		desc: '爽脆弹牙',
		price: 11,
		image: 'https://images.unsplash.com/photo-1604909053178-d6d3c6c2a5e4?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g31',
		categoryId: 'snack',
		name: '凉拌海带丝',
		desc: '酸辣开胃',
		price: 10,
		image: 'https://images.unsplash.com/photo-1526318896989-ef7c0a0f4a87?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g32',
		categoryId: 'snack',
		name: '小酥肉',
		desc: '酥香不腻',
		price: 18,
		image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=60'
	},

	// 喝点小酒
	{
		id: 'g33',
		categoryId: 'wine',
		name: '喜力啤酒',
		desc: '冰爽畅饮（活动价）',
		price: 6,
		image: 'https://images.unsplash.com/photo-1514361892635-eae31a0f8d98?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g34',
		categoryId: 'wine',
		name: '青岛啤酒',
		desc: '经典口味',
		price: 8,
		image: 'https://images.unsplash.com/photo-1514361892635-eae31a0f8d98?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g35',
		categoryId: 'wine',
		name: '可乐',
		desc: '冰镇更爽',
		price: 5,
		image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g36',
		categoryId: 'wine',
		name: '雪碧',
		desc: '气泡十足',
		price: 5,
		image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g37',
		categoryId: 'wine',
		name: '酸梅汤',
		desc: '解腻佳品',
		price: 7,
		image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60'
	},
	{
		id: 'g38',
		categoryId: 'wine',
		name: '柠檬水',
		desc: '清爽回甘',
		price: 6,
		image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=60'
	}
])

const activeCategoryIndex = ref(0)
const activeCategory = computed(() => categories.value[activeCategoryIndex.value])

const goodsByCategory = (categoryId) => goods.value.filter(g => g.categoryId === categoryId)

// --- 底部浮层状态 ---
const showDetail = ref(false)
const showCart = ref(false)
const currentGood = ref(null)

const itemCount = (goodId) => {
	// 购物车里同一个菜品可能有不同规格；此 demo 没规格，按 id 汇总
	return store.state.cart
		.filter(i => String(i.id) === String(goodId))
		.reduce((sum, i) => sum + i.quantity, 0)
}

const cCount = (categoryId) => {
	const ids = goods.value.filter(g => g.categoryId === categoryId).map(g => g.id)
	return store.state.cart
		.filter(i => ids.includes(i.id))
		.reduce((sum, i) => sum + i.quantity, 0)
}

const selectCategory = (idx) => {
	activeCategoryIndex.value = idx
	// 点击左侧分类：滚动右侧到对应分组
	const cid = categories.value[idx]?.id
	if (cid) {
		isProgrammaticScroll.value = true
		goodsScrollIntoView.value = `cat-${cid}`
		// 给 scroll-into-view 动画一点时间，期间不做“scroll -> 高亮”反推
		setTimeout(() => {
			isProgrammaticScroll.value = false
		}, 350)
	}
}

// 右侧滚动联动左侧（精确测量版）
const goodsScrollIntoView = ref('')
const isProgrammaticScroll = ref(false)
const sectionRanges = ref([]) // [{ id, top, bottom }]

const buildSectionRanges = async () => {
	await nextTick()
	return new Promise((resolve) => {
		const q = uni.createSelectorQuery()
		// 在页面上下文中查询，避免组件/页面上下文差异
		q.select('.goods').boundingClientRect()
		q.selectAll('.goods__section').boundingClientRect()
		q.exec((res) => {
			const goodsRect = res?.[0]
			const sections = res?.[1] || []
			if (!goodsRect || !sections.length) {
				sectionRanges.value = []
				resolve(false)
				return
			}
			// 把 sections 的 viewportTop 转成以 scroll-view 内容顶部为 0 的 scrollTop 区间
			const baseTop = goodsRect.top
			const ranges = sections
				.map((s) => {
					const id = String(s.id || '')
					const top = Math.max(0, s.top - baseTop)
					return { id, top, height: s.height }
				})
				.filter(r => r.id.startsWith('cat-'))
				.sort((a, b) => a.top - b.top)

			sectionRanges.value = ranges.map((r, i) => ({
				id: r.id,
				top: r.top,
				bottom: i === ranges.length - 1 ? Number.POSITIVE_INFINITY : ranges[i + 1].top
			}))
			resolve(true)
		})
	})
}

onMounted(async () => {
	await buildSectionRanges()
})

const onGoodsScroll = (e) => {
	if (isProgrammaticScroll.value) return
	const st = Number(e?.detail?.scrollTop || 0)
	if (!sectionRanges.value.length) return

	// 让标题「接近顶部」时就切换，高亮更跟手
	const probe = st + 16
	const hit = sectionRanges.value.find(r => probe >= r.top && probe < r.bottom)
	if (!hit) return

	const catId = hit.id.replace('cat-', '')
	const idx = categories.value.findIndex(c => c.id === catId)
	if (idx >= 0 && idx !== activeCategoryIndex.value) activeCategoryIndex.value = idx
}

const add = (g) => {
	if (!g) return
	store.addToCart(g, null, 1)
}

const dec = (g) => {
	if (!g) return
	// 找到对应 key（此 demo 无规格，用 id）
	const item = store.state.cart.find(i => String(i.id) === String(g.id))
	if (item) store.updateQuantity(item._key, -1)
}

const openDetail = (g) => {
	currentGood.value = g
	showCart.value = false
	showDetail.value = true
}
const closeDetail = () => {
	showDetail.value = false
}

const openCart = () => {
	if (store.totalCount.value <= 0) return
	showDetail.value = false
	showCart.value = true
}
const closeCart = () => {
	showCart.value = false
}

const clearCart = () => {
	uni.showModal({
		title: '提示',
		content: '确认清空已选商品？',
		success: (res) => {
			if (res.confirm) {
				store.clearCart()
				showCart.value = false
			}
		}
	})
}

const checkout = () => {
	if (store.totalCount.value <= 0) {
		uni.showToast({ title: '请先选择商品', icon: 'none' })
		return
	}
	showCart.value = false
	showDetail.value = false
	uni.navigateTo({ url: '/pages/checkout/checkout' })
}

const onSearch = () => uni.showToast({ title: '搜索：占位', icon: 'none' })
const onMore = () => uni.showToast({ title: '更多：占位', icon: 'none' })
const onPromo = () => uni.showToast({ title: '促销：占位', icon: 'none' })

// 图片加载会导致布局高度变化：节流重算分组区间，保证联动精准
let __rangeTimer = null
const onGoodImageLoad = () => {
	if (__rangeTimer) clearTimeout(__rangeTimer)
	__rangeTimer = setTimeout(() => {
		buildSectionRanges()
	}, 120)
}

const onManage = () => {
	uni.showToast({ title: '菜品管理：功能开发中', icon: 'none' })
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: #f5f6f8;
	padding-bottom: 120rpx; /* 给底部购物车栏留空间 */
}

.header {
	padding: 20rpx 28rpx 24rpx;
	background: #fff;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.header__row {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
}

.header__title {
	font-size: 38rpx;
	font-weight: 800;
	color: #111;
}

.header__sub {
	margin-top: 6rpx;
	font-size: 24rpx;
	color: #666;
	display: block;
}

.header__actions {
	display: flex;
}

.manage-btn {
	background-color: #f0f0f0;
	padding: 10rpx 20rpx;
	border-radius: 30rpx;
}

.manage-text {
	font-size: 24rpx;
	color: #333;
	font-weight: bold;
}

.header__search {
	display: flex;
	align-items: center;
	height: 72rpx;
	background: #f5f6f8;
	border-radius: 36rpx;
	padding: 0 24rpx;
}

.search__icon {
	font-size: 30rpx;
	margin-right: 12rpx;
	color: #999;
}

.search__placeholder {
	font-size: 28rpx;
	color: #999;
}

.promo {
	background: #fff;
	padding: 0 28rpx 18rpx;
	display: flex;
	align-items: center;
	gap: 14rpx;
}

.promo__tag {
	font-size: 22rpx;
	color: #8a5a00;
	background: #fbe5b8;
	padding: 6rpx 12rpx;
	border-radius: 10rpx;
}

.promo__pill {
	font-size: 22rpx;
	color: #8a5a00;
	background: #fde8cf;
	padding: 6rpx 12rpx;
	border-radius: 999rpx;
}

.promo__arrow {
	margin-left: auto;
	font-size: 22rpx;
	color: #b3b7bd;
}

.main {
	display: flex;
	height: calc(100vh - 210rpx);
}

.cats {
	width: 200rpx;
	background: #f3f4f6;
}

.cat-item {
	position: relative;
	padding: 30rpx 18rpx;
	color: #8b9198;
	font-size: 26rpx;
	border-left: 6rpx solid transparent;
}

.cat-item.is-active {
	background: #fff;
	color: #222;
	font-weight: 700;
	border-left-color: #00b7c7;
}

.cat-item__badge {
	position: absolute;
	right: 12rpx;
	top: 18rpx;
	min-width: 36rpx;
	height: 36rpx;
	padding: 0 10rpx;
	border-radius: 18rpx;
	background: #00b7c7;
	color: #fff;
	font-size: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.goods {
	flex: 1;
	background: #fff;
	padding: 18rpx 18rpx 0;
}

.goods__section {
	padding-bottom: 8rpx;
}

.goods__section-title {
	font-size: 28rpx;
	font-weight: 700;
	color: #111;
	margin: 8rpx 0 18rpx;
}

.good-card {
	background: #fff;
	border-radius: 18rpx;
	margin-bottom: 18rpx;
	padding-bottom: 18rpx;
	position: relative;
}

.good-card__img {
	width: 100%;
	height: 280rpx;
	border-radius: 18rpx;
	background: #eef1f4;
}

.good-card__body {
	padding: 18rpx 6rpx 0;
}

.good-card__name {
	font-size: 32rpx;
	font-weight: 700;
	color: #111;
	display: block;
}

.good-card__desc {
	margin-top: 8rpx;
	font-size: 24rpx;
	color: #9aa0a6;
	display: block;
}

.good-card__price-row {
	margin-top: 10rpx;
}

.good-card__price {
	font-size: 28rpx;
	color: #ff5d1a;
	font-weight: 700;
}

.good-card__action {
	position: absolute;
	right: 12rpx;
	bottom: 18rpx;
}

.plus-btn {
	width: 52rpx;
	height: 52rpx;
	border-radius: 52rpx;
	background: #00b7c7;
	display: flex;
	justify-content: center;
	align-items: center;
}

.plus-btn__text {
	color: #fff;
	font-size: 36rpx;
	font-weight: 700;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	/* 视觉居中：全角“＋”在部分字体下会略偏上 */
	transform: translateY(-1rpx);
}

.stepper {
	display: flex;
	align-items: center;
	gap: 14rpx;
}

.stepper__btn {
	width: 48rpx;
	height: 48rpx;
	border-radius: 48rpx;
	border: 1px solid #d8dde3;
	background: #fff;
	display: flex;
	align-items: center;
	justify-content: center;
}

.stepper__btn.is-plus {
	border-color: transparent;
	background: #00b7c7;
}

.stepper__btn-text {
	font-size: 36rpx;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #5a6570;
	font-weight: 700;
	transform: translateY(-1rpx);
}

.stepper__btn.is-plus .stepper__btn-text {
	color: #fff;
}

.stepper__count {
	min-width: 26rpx;
	text-align: center;
	font-size: 24rpx;
	color: #111;
}

.cartbar {
	position: fixed;
	left: 0;
	right: 0;
	bottom: var(--window-bottom);
	height: 110rpx;
	padding: 0 22rpx 10rpx;
	background: transparent;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	z-index: 10;
}

.cartbar__left {
	flex: 1;
	height: 90rpx;
	border-radius: 45rpx;
	background: #2b2f33;
	padding: 0 24rpx;
	display: flex;
	align-items: center;
	gap: 18rpx;
}

.cart-icon {
	position: relative;
	width: 58rpx;
	height: 58rpx;
	border-radius: 29rpx;
	background: #000;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cart-icon__bag {
	color: #fff;
	font-size: 28rpx;
}

.cart-icon__badge {
	position: absolute;
	right: -10rpx;
	top: -10rpx;
	min-width: 34rpx;
	height: 34rpx;
	padding: 0 8rpx;
	border-radius: 17rpx;
	background: #00b7c7;
	color: #fff;
	font-size: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.cartbar__price {
	color: #fff;
	font-size: 32rpx;
	font-weight: 700;
}

.cartbar__right {
	width: 240rpx;
	margin-left: 18rpx;
}

.checkout-btn {
	height: 90rpx;
	border-radius: 45rpx;
	background: #505559;
	display: flex;
	align-items: center;
	justify-content: center;
}

.checkout-btn.is-active {
	background: #00b7c7;
}

.checkout-btn__text {
	color: #fff;
	font-size: 30rpx;
	font-weight: 700;
}

.mask {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.45);
	z-index: 50;
}

.sheet {
	position: fixed;
	left: 0;
	right: 0;
	bottom: var(--window-bottom);
	background: #fff;
	border-top-left-radius: 26rpx;
	border-top-right-radius: 26rpx;
	z-index: 60;
	padding-bottom: calc(env(safe-area-inset-bottom) + 18rpx);
}

.sheet__close {
	position: absolute;
	right: 16rpx;
	top: 16rpx;
	width: 60rpx;
	height: 60rpx;
	border-radius: 30rpx;
	background: rgba(0,0,0,0.08);
	display: flex;
	align-items: center;
	justify-content: center;
}

.sheet__close-text {
	font-size: 36rpx;
	color: #333;
}

.sheet__img {
	width: 100%;
	height: 420rpx;
	border-top-left-radius: 26rpx;
	border-top-right-radius: 26rpx;
	background: #eef1f4;
}

.sheet__content {
	padding: 20rpx 26rpx 24rpx;
}

.sheet__name {
	font-size: 38rpx;
	font-weight: 800;
	color: #111;
	display: block;
}

.sheet__desc {
	margin-top: 10rpx;
	font-size: 26rpx;
	color: #8f96a3;
	display: block;
}

.sheet__bottom {
	margin-top: 28rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.sheet__price {
	font-size: 34rpx;
	font-weight: 800;
	color: #ff5d1a;
}

.sheet__add {
	padding: 16rpx 26rpx;
	border-radius: 40rpx;
	background: #00b7c7;
}

.sheet__add-text {
	color: #fff;
	font-size: 28rpx;
	font-weight: 700;
}

.cart-sheet {
	background-color: #fff;
	border-radius: 24rpx 24rpx 0 0;
	display: flex;
	flex-direction: column;
	max-height: 80vh; 
	/* z-index and bottom positioning inherited from .sheet */
}

.cart-header {
	padding: 30rpx 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #fff; /* Sticky header feel */
	border-bottom: 2rpx solid #f5f5f5;
}

.cart-header__left {
	display: flex;
	align-items: baseline;
}

.cart-header__title {
	font-size: 32rpx;
	font-weight: 800;
	color: #333;
}

.cart-header__count {
	font-size: 24rpx;
	color: #999;
	margin-left: 8rpx;
}

.cart-header__clear {
	display: flex;
	align-items: center;
	opacity: 0.8;
}

.clear-icon {
	font-size: 28rpx;
	margin-right: 6rpx;
}

.clear-text {
	font-size: 26rpx;
	color: #666;
}

.cart-list {
	padding: 0 30rpx;
	max-height: 50vh; 
}

.cart-row {
	width: 90%;
	display: flex;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #f9f9f9;
}

.cart-row:last-child {
	border-bottom: none;
}

.cart-row__img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 12rpx;
	background-color: #eee;
	margin-right: 20rpx;
}

.cart-row__info {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 90rpx;
}

.cart-row__name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.cart-row__meta {
	display: flex;
	align-items: baseline;
}

.cart-row__price {
	font-size: 32rpx;
	font-weight: bold;
	color: #ff5d1a;
}

.cart-row__unit {
	font-size: 22rpx;
	color: #999;
}

.cart-row__action {
	margin-left: 20rpx;
}

.cart-footer {
	padding: 20rpx 30rpx;
	border-top: 2rpx solid #f5f5f5;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #fff;
}

.cart-total {
	display: flex;
	align-items: baseline;
}

.total-label {
	font-size: 28rpx;
	color: #333;
	margin-right: 12rpx;
}

.total-price {
	font-size: 40rpx;
	font-weight: 800;
	color: #111;
}

.cart-checkout-btn {
	background-color: #00b7c7;
	color: #fff;
	padding: 0 60rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
	font-size: 30rpx;
	font-weight: bold;
	box-shadow: 0 6rpx 16rpx rgba(0, 183, 199, 0.3);
}

/* Original Inherited Styles for Override */
.sheet__title-row, .sheet__list, .sheet__footer {
	display: none; 
}
/* Re-enable display for new classes that might clash with old selectors in css block (tho we replaced template) */
.cart-header, .cart-list, .cart-footer {
	display: flex;
}
.cart-list { display: block; }
</style>
