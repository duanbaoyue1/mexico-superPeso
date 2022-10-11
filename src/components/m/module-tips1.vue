<template>
  <div class="module-tips">
    <div class="module">
      <header>策略原理讲解及策略介绍</header>
      <p>一只票不会无缘无故涨停，底部起涨往往酝酿一波主升浪行情。但一味地打板极易追涨杀跌导致巨亏！如果在缩量回调的时候低吸介入，进可攻退可守，分仓操作更稳健。</p>
      <img class="pick" :src="require('@/assets/img/pick1@2x.png')" />
      <p class="em">热点板块</p>
      <p class="color-333 block">本策略选出来的标的主要集中在中小盘，也是游资最集中的流通盘范围，一旦炒作一个版块，涨得最多的就是小盘股，所以在策略中选票一定要结合热点选，热点龙头拉得快涨得多。</p>
      <p class="em">涨停基因</p>
      <p class="color-333 block">曾经被市场炒作过的票往往众所周知，所以一旦该票重启大涨，就会很快被市场关注，主力只需要点火即可，后续市场大量资金会来合力推升。如果近期有涨停并暴力大跌洗盘的更佳。</p>

      <p class="em">技术面好</p>
      <p class="color-333 block">推荐使用同花顺并购买Level2功能，主要是看大单金额和大单净量数据，大单净量代表大单金额占流通市值的百分比，强势涨停当天大单净量越大代表主力越坚决，控盘度越高，早上快速封板并且封板后无量最佳。随后三天内如果感觉缩量和跌幅到位后即可参与进去。</p>

      <p class="em">基本面</p>
      <p class="color-333 block">结合公司的市值、PE、股东数近期增减、增长预期等综合分析析，市值和交易额太小就不要大额参与，估值过高就要考虑安全边际，股东数增减代表近期主力动作。总之分仓操作才是安全的交易方式。</p>
      <img class="pick" :src="require('@/assets/img/pick2@2x.png')" />

      <p><span>选出时间：</span><span class="color-666">系统策略实时选出标的精准时间。</span></p>
      <p><span>最高收益：</span><span class="color-666">标的选出后，曾经最高的涨幅。</span></p>
      <p><span>实时收益：</span><span class="color-666">标的选出后，最新股价的涨幅。</span></p>
      <p><span>流通市值：</span><span class="color-666">流通市值小的标的一定不要大额交易。</span></p>
      <p><span>昨日交易：</span><span class="color-666">昨日的交易金额，可根据金额判断资金容量。</span></p>
    </div>
    <div class="tips">
      <header>风险提示</header>
      <p>财联社·舞阳免责声明：本平台所提供信息仅供一般参考，不代表本平台推荐或提供任何投资建议。</p>
      <p>投资有风险。本产品所有集合股票收益走势，均不代表真实收益或对未来收益之预期，计算未纳入印花税、交易费用、分红等因素的计算：所荐个股盈亏仅作统计参考之用，不建议投资者逐一操作，或作为直接投资之依据。</p>
      <p>投资者须注意，投资的价值及其所得收益均可升可跌，甚至变得毫无价值。任何投资产品的过往表现并非未来表现的可靠指标，不应依赖任何预测、预期及模拟作为未来结果的指标。投资者应基于投资经验、投资目标、财务来源等仔细考量每一项投资的适合度，自行作出投资决定。</p>
    </div>
  </div>
</template>

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
  .tips {
    color: #fff;
    font-size: 11px;
    header {
      font-weight: 500;
      color: #ffffff;
      line-height: 17px;
      margin-bottom: 4px;
    }
    p {
      margin-bottom: 20px;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
