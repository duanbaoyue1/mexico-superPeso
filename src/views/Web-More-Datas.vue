<template>
  <div class="back">
    <heard />
    <top-head :bought="bought" :typeInfo="typeInfo" @to-buy="toBuyP"></top-head>
    <div class="content-area width-container">
      <div class="define-table">
        <el-table size="small" border :data="tableData" style="width: 100%" v-if="tableData.length > 0">
          <el-table-column label="日期" width="109">
            <template slot-scope="scope">
              {{ scope.row.date.replace(/-/g, '') }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="个股名称" width="150"> </el-table-column>
          <el-table-column prop="code" label="个股代码" width="150"> </el-table-column>
          <el-table-column prop="firstGetTime" label="选出时间" width="130"> </el-table-column>

          <el-table-column label="次日开盘" width="100">
            <template slot-scope="scope">
              <div v-html="$options.filters.percentFilter(scope.row.nextOpenChangeRate, 2, true)"></div>
            </template>
          </el-table-column>

          <el-table-column label="次日最高" width="100">
            <template slot-scope="scope">
              <div v-html="$options.filters.percentFilter(scope.row.nextHighChangeRate, 2, true)"></div>
            </template>
          </el-table-column>

          <el-table-column label="三日最高" width="100">
            <template slot-scope="scope">
              <div v-html="$options.filters.percentFilter(scope.row.threeHighChangeRate, 2, true)"></div>
            </template>
          </el-table-column>
          <el-table-column label="一周最高" width="100">
            <template slot-scope="scope">
              <div v-html="$options.filters.percentFilter(scope.row.weekHighChangeRate, 2, true)"></div>
            </template>
          </el-table-column>

          <el-table-column label="至今最高" width="100">
            <template slot-scope="scope">
              <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
            </template>
          </el-table-column>
          <el-table-column label="至今涨幅" width="100">
            <template slot-scope="scope">
              <div v-html="$options.filters.percentFilter(scope.row.currentPriceChangeRate, 2, true)"></div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="define-pagination">
        <el-pagination large layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="handleCurrentChange" hide-on-single-page> </el-pagination>
      </div>
    </div>
    <login ref="login" v-if="loginShow" />
    <payment-List ref="paymentList" :type="proId" />
  </div>
</template>

<script>
import paymentList from '@/components/paymentList.vue'; //支付
import login from '@/components/login.vue';
import heard from '@/components/heard.vue';
import typeConfig from '@/config/typeConfig.js';
import TopHead from '@/components/top-head.vue';
export default {
  components: {
    paymentList,
    login,
    heard,
    TopHead,
  },
  data() {
    return {
      // 类型配置数据
      typeInfo: typeConfig[this.$route.query.type],
      proId: this.$route.query.proId,
      token: this.$route.query.token,
      // 产品类型
      type: this.$route.query.type,
      // 列表数据
      tableData: [],
      total: 50,
      pageSize: 20,
      pageIndex: 1,
      loginShow: false, // 登录显示
      logins: false,
      bought: false,
    };
  },

  mounted() {
    this.getTableData();
    this.getUserBoughtInfo((data) => {
      this.bought = data.bought;
      this.logins = data.logins;
      this.endDate = data.endDate;
    });
  },

  methods: {
    toBuyP() {
      // 未登录
      if (this.logins == false) {
        this.loginShow = true;
      } else {
        setTimeout(() => {
          this.$refs.paymentList.showPayInfoDialog();
        });
      }
    },
    handleCurrentChange(value) {
      this.pageIndex = value;
      this.getTableData();
    },

    getTableData() {
      this.$http.get(`/core/api/best_times/full_list/?page=${this.pageIndex}&page_size=${this.pageSize}`).then((res) => {
        if (res.data) {
          this.tableData = res.data.items || [];
          this.total = res.data.total;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.back {
  background: #0f0f12;
}
.content-area {
  background: #15171e;
  padding: 30px;
  margin-bottom: 10px;
  box-sizing: border-box;
  margin-top: -50px !important;
}
.define-pagination {
  margin-top: 10px;
  text-align: center;
}
</style>
