export default {
  onShareAppMessage(res) {
    // 发送给朋友
    const userId = this.getUserId()
    const shareTitle = '全国临期商品大数据智能交易平台' // 默认分享标题
    const sharePath = '/pages/home/index' // 默认分享首页
    let path = res.from === 'button' ? res.target.dataset.path : this.sharePath
    let title = res.from === 'button' ? res.target.dataset.title : shareTitle
    let imageUrl = res.from === 'button' ? res.target.dataset.image : 'https://qlk-main-1301592076.cos.ap-shanghai.myqcloud.com/2021/08/29/1630246768_3652866-src.jpg'

    // 分享路径优先级：当前页面data设置的sharePath > button设置的path > 默认首页
    path = path || sharePath
    title = title || shareTitle
    imageUrl = imageUrl || sharePath
    path += `${path.indexOf('?') === -1 ? '?' : '&'}shareUserId=${userId}`

    return {
      title: title,
      imageUrl: imageUrl,
      path: path
    }
  },

  onShareTimeline(res) {
    // 分享到朋友圈
    return {
      title: '全国临期商品大数据智能交易平台',
      imageUrl: 'https://qlk-main-1301592076.cos.ap-shanghai.myqcloud.com/2021/07/31/1627745590_7075083-src.png'
    }
  }
}
