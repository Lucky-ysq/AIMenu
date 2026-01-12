<template>
	<view class="page">
		<!-- 标题由 pages.json 的 navigationBarTitleText 提供 -->
		<view class="status">
			<view class="status__icon-box">
				<text class="status__icon">✔</text>
			</view>
			<text class="status__title">预点成功</text>
			<text class="status__desc">感谢您提前预点菜，需要到门店落座以后进行下单，才可以制作</text>
		</view>

		<!-- 门店信息卡 -->
		<view class="card">
			<view class="shop">
				<view class="shop__left">
					<view class="shop__name-row">
						<text class="shop__name">{{ store.state.shopName }}</text>
						<text class="shop__arrow">›</text>
					</view>
					<text class="shop__addr">新华路50号</text>
				</view>
				<view class="shop__right" @tap="callShop">
					<view class="phone-btn">
						<text class="phone-btn__icon">📞</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 菜品信息卡 -->
		<view class="card">
			<view class="section-title">菜品信息</view>
			<view class="divider"></view>

			<view v-for="it in store.state.cart" :key="it._key" class="dish">
				<image class="dish__img" :src="it.image" mode="aspectFill" />
				<view class="dish__mid">
					<text class="dish__name">{{ it.name }}</text>
					<text class="dish__count">x {{ it.quantity }}</text>
				</view>
				<view class="dish__right">
					<text class="dish__price">¥{{ (it.price * it.quantity).toFixed(0) }}</text>
				</view>
			</view>

			<view class="sum">
				<view class="sum__row">
					<text class="sum__label">折扣</text>
					<text class="sum__discount">¥0.00</text>
					<text class="sum__label">小计</text>
					<text class="sum__total">¥{{ store.totalPrice.value.toFixed(2) }}</text>
				</view>
			</view>
		</view>

		<!-- 底部操作栏 -->
		<view class="bottom">
			<view class="bottom__btn is-outline" @tap="goBack">
				<text class="bottom__btn-text is-outline">继续加菜</text>
			</view>
			<view class="bottom__btn is-primary" @tap="seatScan">
				<text class="bottom__btn-text">已落座扫码下单</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { inject, onMounted } from 'vue'

const store = inject('store')

onMounted(() => {
	if (!store || store.totalCount.value <= 0) {
		uni.showToast({ title: '暂无已选菜品', icon: 'none' })
	}
})

const goBack = () => {
	uni.navigateBack({ delta: 1 })
}

const seatScan = () => {
	// 这里不做支付/下单，仅做占位
	uni.showToast({ title: '占位：扫码下单', icon: 'none' })
}

const callShop = () => {
	// 这里用占位电话，实际可从门店信息里返回
	uni.makePhoneCall({
		phoneNumber: '010-00000000',
		fail: () => {
			uni.showToast({ title: '无法拨号（开发环境）', icon: 'none' })
		}
	})
}
</script>

<style scoped>
.page {
	min-height: 100vh;
	background: #f5f6f8;
	padding: 26rpx 24rpx 140rpx;
}

.status {
	padding: 30rpx 40rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
}

.status__icon-box {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: #00b7c7;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 24rpx;
	box-shadow: 0 8rpx 16rpx rgba(0, 183, 199, 0.3);
}

.status__icon {
	color: #fff;
	font-size: 50rpx;
}

.status__title {
	font-size: 40rpx;
	font-weight: 800;
	color: #111;
}

.status__desc {
	margin-top: 16rpx;
	font-size: 26rpx;
	color: #8f96a3;
	line-height: 1.5;
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 24rpx 24rpx;
	margin-top: 24rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.03);
}

.shop {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.shop__name-row {
	display: flex;
	align-items: center;
	gap: 10rpx;
}

.shop__name {
	font-size: 34rpx;
	font-weight: 800;
	color: #111;
}

.shop__arrow {
	font-size: 38rpx;
	color: #c4c8cf;
}

.shop__addr {
	margin-top: 10rpx;
	font-size: 26rpx;
	color: #8f96a3;
	display: block;
}

.phone-btn {
	width: 84rpx;
	height: 84rpx;
	border-radius: 42rpx;
	background: #00b7c7;
	display: flex;
	align-items: center;
	justify-content: center;
}

.phone-btn__icon {
	font-size: 34rpx;
	color: #fff;
	line-height: 1;
}

.section-title {
	font-size: 32rpx;
	font-weight: 900;
	color: #111;
}

.divider {
	height: 1px;
	background: #eff1f3;
	margin: 18rpx 0;
}

.dish {
	display: flex;
	align-items: center;
	padding: 18rpx 0;
}

.dish__img {
	width: 92rpx;
	height: 92rpx;
	border-radius: 14rpx;
	background: #eef1f4;
}

.dish__mid {
	flex: 1;
	margin-left: 18rpx;
}

.dish__name {
	font-size: 30rpx;
	font-weight: 800;
	color: #111;
	display: block;
}

.dish__count {
	margin-top: 10rpx;
	font-size: 26rpx;
	color: #8f96a3;
	display: block;
}

.dish__right {
	min-width: 120rpx;
	display: flex;
	justify-content: flex-end;
}

.dish__price {
	font-size: 36rpx;
	font-weight: 900;
	color: #111;
}

.sum {
	margin-top: 10rpx;
	padding-top: 8rpx;
}

.sum__row {
	display: flex;
	align-items: baseline;
	justify-content: flex-end;
	gap: 16rpx;
}

.sum__label {
	font-size: 26rpx;
	color: #9aa0a6;
}

.sum__discount {
	font-size: 30rpx;
	font-weight: 800;
	color: #ff7a00;
}

.sum__total {
	font-size: 40rpx;
	font-weight: 900;
	color: #111;
}

.bottom {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	padding: 24rpx 30rpx calc(env(safe-area-inset-bottom) + 24rpx);
	background: #fff;
	display: flex;
	gap: 24rpx;
	box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);
	z-index: 100;
}

.bottom__btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx; /* Pill shape */
	display: flex;
	align-items: center;
	justify-content: center;
}

.bottom__btn.is-outline {
	background: #fff;
	border: 2rpx solid #c4c8cf;
}

.bottom__btn.is-primary {
	background: #00b7c7;
	box-shadow: 0 4rpx 12rpx rgba(0, 183, 199, 0.3);
}

.bottom__btn-text {
	font-size: 30rpx;
	font-weight: 700;
	color: #fff;
}

.bottom__btn-text.is-outline {
	color: #5a6570;
}
</style>
