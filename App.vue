<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* tabBar 文案放大（各端实现不同，这里先覆盖微信小程序常见结构） */
	/* #ifdef MP-WEIXIN */
	.wx-tabbar .wx-tabbar__label,
	.weui-tabbar__label {
		font-size: 30rpx !important;
		font-weight: 700;
	}
	/* #endif */
</style>
