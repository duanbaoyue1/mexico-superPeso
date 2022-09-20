<template>
  <div class="module-tips">
    <div class="module">
      <header>策略原理讲解及选股技巧</header>
      <p>通常情况下，主力大资金拉升股票不会连续，基本上是拉升一两天，回调几天后再拉升！这样温和上涨可以节省拉升所需资金，逐步抬高散户持股成本，清洗浮筹。我们只需要在回调的时候低吸即可，博弈后续拉升行情。</p>
      <img class="pick" :src="require('@/assets/img/pick1@2x.png')" />
      <p class="em">热点板块</p>
      <p class="color-333 block">热点版块更容易吸纳市场资金，合力推升股价，也更容易出现个股行情的持续性，避免买入后长期趴着不动。所以选择热点版块中的个股，有快速反弹再次起涨、后续涨幅大的特点。</p>
      <p class="em">回调达标</p>
      <p class="color-333 block">股价回调达标后再介入，可以尽可能避免大幅回撤，一旦被深套就进退两难。所以在股价回调到大涨当天的一半、振幅明显缩小、交易量缩小到接近大涨当天的一半，如果主力资金出现回流的情况就再好不过了。</p>

      <p class="em">技术面好</p>
      <p class="color-333 block">推荐使用同花顺并购买Level2功能，可以统计主力的大单。技术面好的特点：1、历史经常出现涨停甚至出现连续涨停的牛股行情，这种票一旦回归就是王者归来。2、最近几个月持续缓慢上涨，右侧行情更具确定性。3、大单金额越大越好，大单净量越大越好。</p>

      <p class="em">基本面</p>
      <p class="color-333 block">结合公司的市值、PE、股东数近期增减、增长预期等综合分析，市值和交易额太小就不要大额参与，估值过高就要考虑安全边际，股东数增减代表近期主力动作。总之分仓操作才是安全的交易方式。</p>
      <img class="pick" :src="require('@/assets/img/pick2@2x.png')" />

      <p><span>选出时间：</span><span class="color-666">系统策略实时选出标的精准时间。</span></p>
      <p><span>最高涨幅：</span><span class="color-666">标的选出后，曾经最高的涨幅。</span></p>
      <p><span>实时涨幅：</span><span class="color-666">标的选出后，最新股价的涨幅。</span></p>
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
