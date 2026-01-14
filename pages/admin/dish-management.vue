<template>
    <view class="page">
        <view v-for="c in categories" :key="c.id" class="section">
            <view class="section-title">{{ c.name }}</view>
            <view class="list">
                <view v-for="g in getGoods(c.id)" :key="g.id" class="item">
                    <image :src="g.image" class="item-img" mode="aspectFill" />
                    <view class="item-info">
                        <text class="item-name">{{ g.name }}</text>
                        <view class="item-meta">
                            <text class="item-price">¥{{ g.price }}</text>
                            <text class="item-desc" v-if="g.ingredients">原料: {{ g.ingredients }}</text>
                        </view>
                    </view>
                    <view class="item-actions">
                        <view class="btn delete" @tap="onDelete(g.id)">删除</view>
                    </view>
                </view>
            </view>
        </view>

        <view class="empty-tip" v-if="categories.length === 0">
            暂无分类数据
        </view>

        <!-- Add Button -->
        <view class="fab" @tap="openAdd">
            <text class="fab-icon">＋</text>
            <text class="fab-text">新增菜品</text>
        </view>

        <!-- Add Modal -->
        <view v-if="showModal" class="modal-mask">
            <view class="modal">
                <view class="modal-header">新增菜品</view>
                <scroll-view scroll-y class="modal-body">
                    <view class="form-item">
                        <text class="label">图片</text>
                        <view class="img-picker" @tap="chooseImg">
                            <image v-if="form.image" :src="form.image" class="preview-img" mode="aspectFill" />
                            <view v-else class="img-placeholder">
                                <text class="img-icon">📷</text>
                                <text class="img-text">点击上传</text>
                            </view>
                        </view>
                    </view>
                    <view class="form-item">
                        <text class="label">名称</text>
                        <input class="input" v-model="form.name" placeholder="请输入菜品名称" />
                    </view>
                    <view class="form-item">
                        <text class="label">价格</text>
                        <input class="input" type="number" v-model.number="form.price" placeholder="请输入价格" />
                    </view>
                    <view class="form-item">
                        <text class="label">分类</text>
                        <picker :range="categories" range-key="name" @change="onCatChange">
                            <view class="picker-inner">
                                <text>{{ form.categoryName || '请选择分类' }}</text>
                                <text class="picker-arrow">▼</text>
                            </view>
                        </picker>
                    </view>
                    <view class="form-item">
                        <text class="label">原材料</text>
                        <input class="input" v-model="form.ingredients" placeholder="例如：土豆、牛肉" />
                    </view>
                    <view class="form-item">
                        <text class="label">做法</text>
                        <input class="input" v-model="form.method" placeholder="例如：红烧" />
                    </view>
                </scroll-view>
                <view class="modal-footer">
                    <button class="btn-modal cancel" @tap="closeModal">取消</button>
                    <button class="btn-modal confirm" @tap="submit">确定</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed, inject, reactive, ref } from 'vue'

const store = inject('store')
const categories = computed(() => store.state.categories)
const goods = computed(() => store.state.goods)

const getGoods = (cid) => goods.value.filter(g => g.categoryId === cid)

const onDelete = (id) => {
    uni.showModal({
        title: '确认删除',
        content: '确定要删除这个菜品吗？',
        success: (res) => {
            if (res.confirm) {
                store.deleteDish(id)
                uni.showToast({ title: '已删除', icon: 'none' })
            }
        }
    })
}

const showModal = ref(false)
const form = reactive({
    name: '',
    price: '',
    categoryId: '',
    categoryName: '',
    ingredients: '',
    method: '',
    image: ''
})

const openAdd = () => {
    // Reset form
    form.name = ''
    form.price = ''
    if (categories.value.length > 0) {
        form.categoryId = categories.value[0].id
        form.categoryName = categories.value[0].name
    }
    form.ingredients = ''
    form.method = ''
    form.image = ''
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
}

const onCatChange = (e) => {
    const idx = e.detail.value
    const c = categories.value[idx]
    if (c) {
        form.categoryId = c.id
        form.categoryName = c.name
    }
}

const chooseImg = () => {
    uni.chooseImage({
        count: 1,
        success: (res) => {
            form.image = res.tempFilePaths[0]
        }
    })
}

const submit = () => {
    if (!form.name || !form.price || !form.categoryId) {
        uni.showToast({ title: '请填写名称、价格和分类', icon: 'none' })
        return
    }
    store.addDish({
        id: 'new_' + Date.now(),
        name: form.name,
        price: Number(form.price),
        categoryId: form.categoryId,
        ingredients: form.ingredients,
        method: form.method,
        image: form.image || 'https://via.placeholder.com/150',
        desc: '店长推荐'
    })
    uni.showToast({ title: '添加成功' })
    closeModal()
}
</script>

<style scoped>
.page {
    padding: 24rpx;
    padding-bottom: 160rpx;
    background: #f5f6f8;
    min-height: 100vh;
}

.section {
    margin-bottom: 30rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    padding-left: 10rpx;
    border-left: 8rpx solid #00b7c7;
}

.list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.item {
    background: #fff;
    padding: 20rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.item-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 12rpx;
    background: #eee;
    margin-right: 20rpx;
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 120rpx;
    padding: 4rpx 0;
}

.item-name {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
}

.item-meta {
    display: flex;
    flex-direction: column;
}

.item-price {
    font-size: 28rpx;
    color: #ff5d1a;
    font-weight: bold;
}

.item-desc {
    font-size: 22rpx;
    color: #999;
    margin-top: 4rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-actions {
    margin-left: 20rpx;
}

.btn.delete {
    padding: 10rpx 24rpx;
    background: #ffecec;
    color: #ff4d4f;
    font-size: 24rpx;
    border-radius: 30rpx;
}

.fab {
    position: fixed;
    bottom: 60rpx;
    right: 40rpx;
    background: #00b7c7;
    color: #fff;
    padding: 20rpx 40rpx;
    border-radius: 50rpx;
    box-shadow: 0 8rpx 20rpx rgba(0, 183, 199, 0.4);
    display: flex;
    align-items: center;
    gap: 10rpx;
    z-index: 100;
}

.fab-icon {
    font-size: 36rpx;
    font-weight: bold;
    line-height: 1;
}

.fab-text {
    font-size: 30rpx;
    font-weight: bold;
}

.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal {
    width: 640rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx;
    display: flex;
    flex-direction: column;
    max-height: 80vh;
}

.modal-header {
    font-size: 34rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 30rpx;
}

.modal-body {
    flex: 1;
    overflow-y: auto;
}

.form-item {
    margin-bottom: 30rpx;
}

.label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 12rpx;
}

.input {
    background: #f5f6f8;
    height: 80rpx;
    border-radius: 12rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333;
}

.picker-inner {
    background: #f5f6f8;
    height: 80rpx;
    border-radius: 12rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #333;
}

.picker-arrow {
    color: #ccc;
    font-size: 24rpx;
}

.img-picker {
    width: 160rpx;
    height: 160rpx;
    background: #f5f6f8;
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.preview-img {
    width: 100%;
    height: 100%;
}

.img-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

.img-icon {
    font-size: 40rpx;
}

.img-text {
    font-size: 22rpx;
    color: #999;
}

.modal-footer {
    padding-top: 30rpx;
    display: flex;
    gap: 20rpx;
}

.btn-modal {
    flex: 1;
    font-size: 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    border: none;
}

.btn-modal::after {
    border: none;
}

.btn-modal.cancel {
    background: #f5f6f8;
    color: #666;
}

.btn-modal.confirm {
    background: #00b7c7;
    color: #fff;
}
</style>
