<template>
  <view class="container">
    <!-- Top Tabs -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 0 }" 
        @click="activeTab = 0"
      >
        <text>当前订单</text>
        <view class="indicator" v-if="activeTab === 0"></view>
      </view>
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 1 }" 
        @click="activeTab = 1"
      >
        <text>历史订单</text>
        <view class="indicator" v-if="activeTab === 1"></view>
      </view>
    </view>

    <!-- Content: Current Order (Empty State) -->
    <view v-if="activeTab === 0" class="empty-state">
      <view class="infinity-icon">
        <!-- CSS Infinity Loop Representation -->
        <view class="circle left"></view>
        <view class="circle right"></view>
      </view>
      <text class="empty-text">暂无订单，小妖带您去吃条烤鱼吧</text>
      <button class="action-btn" @click="goToOrder">去点餐</button>
    </view>

    <!-- Content: History Order -->
    <view v-else class="order-list">
      <view class="order-card" v-for="(item, index) in historyOrders" :key="index">
        <!-- Card Header -->
        <view class="card-header">
          <view class="shop-info">
            <view class="tag">点餐</view>
            <text class="shop-name">{{ item.shopName }}</text>
          </view>
          <text class="status">{{ item.status }}</text>
        </view>
        <view class="time-info">{{ item.time }}</view>
        
        <view class="divider"></view>

        <!-- Card Body -->
        <view class="card-body">
          <!-- Left: Scrollable Images -->
          <scroll-view scroll-x class="thumbs-scroll" :show-scrollbar="false">
            <view class="thumbs-wrapper">
              <image 
                v-for="(img, idx) in item.images" 
                :key="idx" 
                src="/static/logo.png" 
                mode="aspectFill" 
                class="food-thumb"
              ></image>
              <!-- Add dummy boxes if images are missing to mimic screenshot -->
            </view>
          </scroll-view>

          <!-- Right: Summary Info (Fixed Width) -->
          <view class="summary-info">
            <view class="info-row">
              <text class="count">共{{ item.count }}件</text>
            </view>
            <view class="info-row">
              <text class="currency">¥</text>
              <text class="price">{{ item.price }}</text>
            </view>
          </view>
        </view>

        <!-- Card Footer -->
        <view class="card-footer">
          <button class="invoice-btn">开发票</button>
        </view>
      </view>

      <view class="list-end">
        <text>以上是所有订单，已经到底啦</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref(1) // Default to history tab based on user flow

const historyOrders = ref([
  {
    shopName: '石家庄勒泰店',
    time: '2026-01-02 18:20:47',
    status: '已完成',
    count: 3,
    price: '34.00',
    images: [1, 2, 3] // Dummy array for loop
  },
  {
    shopName: '济南市K88名泉广场店',
    time: '2025-09-30 19:58:20',
    status: '已完成',
    count: 2,
    price: '24.00',
    images: [1, 2]
  },
  {
    shopName: '北京市王府井百货大楼店',
    time: '2025-08-30 18:46:20',
    status: '已完成',
    count: 2,
    price: '21.80',
    images: [1, 2]
  }
])

const goToOrder = () => {
  uni.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 20rpx;
}

.tabs {
  display: flex;
  background-color: #fff;
  padding: 20rpx 0;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    color: #666;
    position: relative;
    padding-bottom: 10rpx;
    
    &.active {
      color: #333;
      font-weight: bold;
      font-size: 32rpx;
    }
    
    .indicator {
      position: absolute;
      bottom: 0;
      width: 40rpx;
      height: 6rpx;
      background-color: #00d0bf; /* Teal color */
      border-radius: 3rpx;
    }
  }
}

/* Empty State Styles */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  
  .infinity-icon {
    width: 120rpx;
    height: 60rpx;
    position: relative;
    margin-bottom: 40rpx;
    
    /* Creating an infinity-like shape with CSS circles */
    .circle {
      position: absolute;
      width: 60rpx;
      height: 60rpx;
      border: 8rpx solid #00d0bf;
      border-radius: 50%;
      box-sizing: border-box;
      
      &.left {
        left: 0;
      }
      &.right {
        right: 0;
        left: auto; /* override left */
        margin-left: -10rpx; /* Overlap slightly if needed, but here we want them side by side */
      }
    }
    /* Simplified visual: just two circles next to each other to mimic loop */
    display: flex;
    justify-content: center;
    gap: -10rpx; 
    
    /* Actually let's use a simpler approach for the icon given plain CSS limitations */
    /* This block below overrides the .circle .left/right absolute positioning for the flex approach */
    .circle {
      position: static; 
      margin: 0 -4rpx; /* Overlap */
    }
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .action-btn {
    background-color: #00d0bf;
    color: #fff;
    font-size: 32rpx;
    padding: 10rpx 80rpx;
    border-radius: 10rpx;
    border: none;
    line-height: 2.5; 
  }
}

/* Order List Styles */
.order-list {
  padding: 20rpx;
}

.order-card {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10rpx;
    
    .shop-info {
      display: flex;
      align-items: center;
      
      .tag {
        background-color: #fdf5e6;
        color: #ff9900;
        font-size: 20rpx;
        padding: 4rpx 10rpx;
        border-radius: 8rpx;
        margin-right: 12rpx;
      }
      
      .shop-name {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
      }
    }
    
    .status {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .time-info {
    font-size: 24rpx;
    color: #ccc;
    margin-bottom: 20rpx;
  }
  
  .divider {
    height: 1rpx;
    background-color: #f0f0f0;
    margin-bottom: 20rpx;
    /* Dashed border effect */
    background: none;
    border-top: 1px dashed #eee;
  }
  
  .card-body {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .thumbs-scroll {
      flex: 1;
      width: 0; /* Important for flex child with overflow */
      overflow: hidden;
      margin-right: 20rpx;
      
      .thumbs-wrapper {
        display: flex;
        flex-wrap: nowrap;
        
        .food-thumb {
          width: 100rpx;
          height: 100rpx;
          border-radius: 8rpx;
          margin-right: 16rpx;
          background-color: #eee; /* Placeholder color */
          flex-shrink: 0;
        }
      }
    }
    
    .summary-info {
      /* Fixed width to prevent squeezing */
      flex: 0 0 160rpx; 
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      
      .info-row {
        margin-bottom: 8rpx;
        
        .count {
          font-size: 24rpx;
          color: #999;
        }
        
        .currency {
          font-size: 24rpx;
          color: #333;
          font-weight: bold;
        }
        
        .price {
          font-size: 36rpx;
          color: #333;
          font-weight: bold;
        }
      }
    }
  }
  
  .card-footer {
    display: flex;
    justify-content: flex-end;
    
    .invoice-btn {
      background-color: #fff;
      border: 1px solid #ddd;
      color: #666;
      font-size: 24rpx;
      padding: 0 30rpx;
      height: 56rpx;
      line-height: 54rpx;
      border-radius: 28rpx;
      margin: 0;
    }
  }
}

.list-end {
  text-align: center;
  padding: 30rpx;
  
  text {
    font-size: 24rpx;
    color: #ccc;
  }
}
</style>