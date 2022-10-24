<template>
  <div class="module-tips">
    <div class="module">
      <header>策略原理讲解及详细介绍</header>
      <p>主力操盘运作流程主要有四个：建仓、洗盘、拉升、出货。但在拉主升浪之前，主力往往会拉上影线试盘，试探对手盘的抛压。如果抛压小就开启主升浪行情，也是我们买入的最好时机。</p>
      <img class="pick" :src="require('@/assets/img/pick1@2x.png')" />
      <p class="em">建仓特征</p>
      <p class="color-333 block">有建仓动作后的拉升才具有逻辑，建仓期往往是至少长达半年的横盘，如果有砸盘黄金坑最佳。这样主力和散户的建仓成本绝大多数都在底部，筹码峰很集中。另外如果股东数出现大幅下降，就确切验证了主力的存在。</p>
      <p class="em">炒作逻辑</p>
      <p class="color-333 block">曾经被市场炒作过的票往往众所周知，所以一旦该票重启大涨，就会很快被市场关注，主力只需要点火即可，后续市场大量资金会来合力推升。所以在选票的时候，可以预判该股的炒作逻辑，高成功率。</p>

      <p class="em">买入时机</p>
      <p class="color-333 block">Level2功能可以分析主力动机。如果是早上快速封板，封板后无成交量，L2功能显示大额资金流入，并且因为行情大跌导致被动开板，这种情况可以考虑当天介入。如果当日回调幅度很大，涨幅跌到3%以下可以考虑当天介入。如果当日收盘涨幅仍然很高，可以考虑只建底仓，或者次日、隔日缩量回踩才介入。</p>

      <p class="em">基本面</p>
      <p class="color-333 block">结合公司的市值、PE、股东数近期增减、增长预期等综合分析，估值过高就要考虑安全边际，股东数增减代表近期主力动作。总之分仓操作才是安全的交易方式。</p>
      <img class="pick" :src="require('@/assets/img/pick2@2x.png')" />

      <p><span>选出时间：</span><span class="color-666">系统策略实时选出标的精准时间。</span></p>
      <p><span>最高收益：</span><span class="color-666">标的选出后，曾经最高的涨幅。</span></p>
      <p><span>实时收益：</span><span class="color-666">标的选出后，最新股价的涨幅。</span></p>
      <p><span>流通市值：</span><span class="color-666">流通市值小的标的一定不要大额交易。</span></p>
      <p><span>昨日交易：</span><span class="color-666">昨日的交易金额，可根据金额判断资金容量。</span></p>
    </div>
    <risk-tips></risk-tips>
  </div>
</template>

<script>
import RiskTips from './risk-tips.vue';
export default {
  components: {
    RiskTips,
  },
};
</script>
<style lang="scss" scoped>
.module-tips {
  .module {
    width: 351px;
    background: #ffffff;
    border-radius: 5px;
    margin-bottom: 15px;
    padding: 0 15px 15px;
    box-sizing: border-box;
    header {
      width: 200px;
      height: 30px;
      background: #ffe0d6;
      border-radius: 0px 0px 5px 5px;
      margin: 0 auto 10px;
      text-align: center;
      font-size: 15px;
      font-weight: 500;
      color: #cf0f0a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    p {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 17px;
      margin-bottom: 0;
      margin-top: 0;
    }
    .pick {
      height: 24px;
      margin-top: 10px;
      margin-bottom: 5px;
    }
    .em {
      margin-bottom: 2px;
      font-weight: 500;
      color: #ea413c;
    }
    .block {
      text-indent: 20px;
      margin-bottom: 10px;
    }
  }
}
</style>
