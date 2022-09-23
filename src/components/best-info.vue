<template>
  <div class="best-info">
    <div>
      近期最强牛股: <span style="color: #EB333B">{{ bestInfo.bestStockName }}</span>
    </div>
    <div>
      选出后最高涨幅:
      <span v-html="$options.filters.percentFilter(bestInfo.highestGain, 2, true)"></span>
    </div>
    <div>
      近一个月个股胜率<img @click="openBoxWin" :src="require('@/assets/img/tips@2x.png')" />
      <span class="percent">
        <span :style="{ color: bestInfo.monthWinRate > 0 ? '#ea413c' : '#0cad00' }">{{ bestInfo.monthWinRate }}%</span>
      </span>
    </div>
    <div>
      近一个月平均日收益<img @click="openBoxWinYield" :src="require('@/assets/img/tips@2x.png')" />
      <span class="percent">
        <span v-html="$options.filters.percentFilter(bestInfo.monthDayYieldRate, 2, true)"></span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bestInfo: {
      type: Object
    }
  },

  methods: {
    openBoxWin() {
      this.$dm.alert('<ul><li style="color: #EA413C">1、统计范围：选取策略所有股票</li><li>2、统计选出后至今的最高价 </li><li>3、统计近一个月的胜率</li></ul>', '近一月个股胜率', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'alert-confirm',
        customClass: 'tips-toast',
        center: false
      });
    },
    openBoxWinYield() {
      this.$dm.alert('<ul><li style="color: #EA413C">1、统计范围：选取策略所有股票</li><li>2、统计选出后至今的最高价 </li><li>3、将所有收益平均到每一天</li></ul>', '近一月平均日收益', {
        dangerouslyUseHTMLString: true,
        showClose: false,
        confirmButtonText: '我知道了',
        confirmButtonClass: 'alert-confirm',
        customClass: 'tips-toast',
        center: false
      });
    }
  },
  mounted() {
    console.log(this.videos);
  }
};
</script>

<style lang="scss" scoped>
.best-info {
  display: flex;
  justify-content: space-between;

  > div {
    font-size: 15px;
    font-family: MicrosoftYaHei;
    color: #bbbcbe;
    line-height: 20px;
    display: flex;
    align-items: center;
    img {
      width: 12px;
      height: 12px;
      margin-left: 5px;
      cursor: pointer;
    }
    > span {
      margin-left: 10px;
    }
  }
}
</style>
