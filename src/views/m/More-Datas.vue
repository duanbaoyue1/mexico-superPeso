<template>
  <div class="back">
    <div class="content-area">
      <div class="define-table">
        <el-table size="small" border :data="tableData" style="width: 100%" v-if="tableData.length > 0">
          <el-table-column label="日期" width="65">
            <template slot-scope="scope">
              {{ scope.row.date.replace(/-/g, '') }}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="个股名称" width="70"> </el-table-column>
          <el-table-column prop="code" label="个股代码" width="70"> </el-table-column>
          <el-table-column prop="getTime" label="选出时间" width="60"> </el-table-column>

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

      <div class="define-pagination">
        <el-pagination small layout="prev, pager, next" :total="total" :page-size="pageSize" @current-change="handleCurrentChange" hide-on-single-page> </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import TableData from '@/components/m/table-data.vue';
import typeConfig from '@/config/typeConfig.js';
export default {
  components: {
    TableData,
  },
  data() {
    let self = this;
    return {
      // 类型配置数据
      typeInfo: typeConfig[this.$route.query.type],
      proId: this.$route.query.proId,
      token: this.$route.query.token,
      // 产品类型
      type: this.$route.query.type,
      // 列表数据
      tableData: [],
      dataDate: '2022-10-10',
      total: 50,
      pageSize: 20,
      pageIndex: 1,
    };
  },

  mounted() {
    this.getTableData();
  },

  methods: {
    handleCurrentChange(value) {
      console.log(value);
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
html {
  background-color: #cf0f0a;
}
.back {
  background-image: url('../../assets/img/back@2x.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: top;
  padding: 13px 13px 13px !important;
  background-color: #cf0f0a;
  padding-bottom: 63px !important;
}

.content-area {
  border-radius: 5px;
  background: #fff;
  padding: 10px;
  margin-bottom: 10px;
}
.define-pagination {
  margin-top: 10px;
  text-align: center;
}
</style>
