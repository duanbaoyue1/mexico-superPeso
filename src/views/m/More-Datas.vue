<template>
  <div class="back">
    <div class="detail-data content-area">
      <header>
        <div class="info">
          <div>{{ typeInfo.title }}</div>
          <div>{{ typeInfo.btnDesc }}</div>
        </div>
      </header>
      <div class="best-detail" v-if="bestInfo">
        <div>
          <div class="percent">
            <span :style="{ color: bestInfo.monthWinRate > 0 ? '#ea413c' : '#0cad00' }">{{ bestInfo.monthWinRate }}</span>
            <span>%</span>
          </div>
          <div class="tips">近一个月个股胜率<img @click="openBoxWin" :src="require('@/assets/img/tips@2x.png')" /></div>
        </div>
        <div>
          <div class="percent">
            <span v-html="$options.filters.percentFilter(bestInfo.monthDayYieldRate, 2, true)"></span>
          </div>
          <div class="tips">近一个月平均日收益<img @click="openBoxWinYield" :src="require('@/assets/img/tips@2x.png')" /></div>
        </div>
      </div>
    </div>

    <div class="define-table content-area">
      <header></header>
      <el-table size="small" border :data="tableData" style="width: 100%" max-height="500" v-if="tableData.length > 0">
        <el-table-column label="日期" width="65">
          <template slot-scope="scope">
            {{ scope.row.date.replace(/-/g, '') }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="个股名称" width="70">
          <template slot-scope="scope">
            <div @click="toNewPage(scope.row)">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="个股代码" width="70"> </el-table-column>
        <el-table-column prop="firstGetTime" label="选出时间" width="60"> </el-table-column>

        <el-table-column label="次日开盘" width="65">
          <template slot-scope="scope">
            <div v-html="$options.filters.percentFilter(scope.row.nextOpenChangeRate, 2, true)"></div>
          </template>
        </el-table-column>

        <el-table-column label="次日最高" width="65">
          <template slot-scope="scope">
            <div v-html="$options.filters.percentFilter(scope.row.nextHighChangeRate, 2, true)"></div>
          </template>
        </el-table-column>

        <el-table-column label="三日最高" width="70">
          <template slot-scope="scope">
            <div v-html="$options.filters.percentFilter(scope.row.threeHighChangeRate, 2, true)"></div>
          </template>
        </el-table-column>
        <el-table-column label="一周最高" width="70">
          <template slot-scope="scope">
            <div v-html="$options.filters.percentFilter(scope.row.weekHighChangeRate, 2, true)"></div>
          </template>
        </el-table-column>

        <el-table-column label="至今最高" width="65">
          <template slot-scope="scope">
            <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
          </template>
        </el-table-column>
        <el-table-column label="至今涨幅" width="65">
          <template slot-scope="scope">
            <div v-html="$options.filters.percentFilter(scope.row.currentPriceChangeRate, 2, true)"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <risk-tips class="risk"></risk-tips>
  </div>
</template>

<script>
import TableData from '@/components/m/table-data.vue';
import typeConfig from '@/config/typeConfig.js';
import RiskTips from '@/components/m/risk-tips.vue';
export default {
  components: {
    TableData,
    RiskTips,
  },
  data() {
    return {
      bestInfo: '',
      // 类型配置数据
      typeInfo: typeConfig[this.$route.query.type],
      proId: this.$route.query.proId,
      token: this.$route.query.token,
      // 产品类型
      type: this.$route.query.type,
      // 列表数据
      tableData: [],
    };
  },

  mounted() {
    document.title = this.typeInfo.title;
    this.getTableData();
    this.getBestInfo();
  },

  methods: {
    getBestInfo() {
      this.$http.get(`/core/api/best_times/best_info/`).then((res) => {
        this.bestInfo = res.data;
      });
    },
    toNewPage(val) {
      if (this.$route.query.wy != 1 && val.name.indexOf('*') == -1) {
        let str;
        if (val.code.substr(0, 1) == 6) {
          str = 'sh';
        } else {
          str = 'sz';
        }
        window.location.href = 'cailianshe://stock_detail?stock_id=' + str + val.code;
      }
    },
    getTableData() {
      this.$http.get(`/core/api/best_times/month_list/`).then((res) => {
        if (res.data) {
          this.tableData = res.data.items || [];
        }
      });
    },
  },
};
</script>

<style lang="scss">
html {
  background-color: #cf0f0a;
}
.back {
  background-image: url('../../assets/img/back@2x.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  padding: 13px !important;
  background-color: #cf0f0a;
}

.content-area {
  border-radius: 5px;
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
}

.risk {
  margin-top: 10px;
}

.define-table {
  header {
    background-image: url(../../assets/img/last-month@2x.png);
    background-size: contain;
    width: 171px;
    height: 39px;
    display: block;
    margin: 0 auto;
    margin-top: -10px;
    margin-bottom: 10px;
  }
}

.detail-data {
  border-radius: 5px;
  padding: 10px;
  background: #fff;
  margin-bottom: 10px;
  background-image: url(../../assets/img/ditu@2x.png);
  background-size: contain;
  width: 350px;
  height: 168px;
  box-sizing: border-box;

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 22px;

    .info {
      div {
        font-size: 15px;
        font-weight: 500;
        color: #000000;
        line-height: 21px;
        margin-bottom: 14px;
        text-align: center;

        &:last-child {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          line-height: 24px;
          margin-bottom: 0;
        }
      }
    }
  }

  .best-detail {
    display: flex;
    flex: 1;
    > div {
      flex: 1;
      text-align: center;

      .percent {
        font-size: 20px;
        font-weight: 600;
        color: #e60100;
        line-height: 28px;
        margin-bottom: 5px;
      }
      .tips {
        font-size: 14px;
        font-weight: 400;
        color: #969696;

        height: 17px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 12px;
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
