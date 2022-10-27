<template>
  <div class="module-tips">
    <div class="module">
      <!-- <header>策略原理讲解及详细介绍</header>
      <p>在市场恐慌情绪泛滥的情况下，众多交易者会不计成本割掉手中的筹码，如果此时主力空翻多大单接盘，就是一种情绪反转的征兆。后续市场冷静后，该标的往往会提前表现，走出一波行情。</p>
      <img class="pick" :src="require('@/assets/img/pick1@2x.png')" />
      <p class="em">大跌后反转</p>
      <p class="color-333 block">因市场行情太差带动个股一起下跌，或者因个股突发短期利空影响，就会导致股价持续走低。在跌幅过大或者关键性支撑位时，AI算法计算大跌后反转时机。</p>
      <p class="em">大涨后回调</p>
      <p class="color-333 block">昨日大涨甚至涨停，次日回调后，仍存在资金介入，AI算法计算大涨后回调时机。</p>

      <p class="em">技术面好</p>
      <p class="color-333 block">标的股价活性强的，最好是白马蓝筹股。屏蔽小盘股可以规避主力通过对倒制造大资金流入的假象。</p>

      <p class="em">基本面</p>
      <p class="color-333 block">结合公司的市值、PE、股东数近期增减、增长预期等综合分析，市值和交易额太小则基本面较差，估值过高就要考虑安全边际，股东数增减代表近期主力动作。</p> -->
      <img class="pick" :src="require('@/assets/img/pick2@2x.png')" />

      <p><span>选出时间：</span><span class="color-666">系统策略实时选出标的精准时间。</span></p>
      <p><span>最高涨幅：</span><span class="color-666">标的选出后，曾经最高的涨幅。</span></p>
      <p><span>至今涨幅：</span><span class="color-666">标的选出后，最新股价的涨幅。</span></p>
      <p><span>流通市值：</span><span class="color-666">流通股本x最新股价。</span></p>
      <p><span>昨日交易：</span><span class="color-666">昨日交易资金量。</span></p>
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
