<template>
  <div class="define-table">
    <el-table size="small" border :data="data" style="width: 100%" v-if="data.length > 0">
      <el-table-column label="个股名称" width="70">
        <template slot-scope="scope">
          <div @click="toNewPage(scope.row)">
            {{scope.row.name}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="个股代码" width="70"> </el-table-column>
      <el-table-column prop="firstGetTime" label="选出时间" width="60"> </el-table-column>
      <el-table-column label="最高涨幅" width="65">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.maxPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="至今涨幅" width="65">
        <template slot-scope="scope">
          <div v-html="$options.filters.percentFilter(scope.row.currentPriceChangeRate, 2, true)"></div>
        </template>
      </el-table-column>
      <el-table-column label="流通市值" width="70">
        <template slot-scope="scope">
          <span>{{ (scope.row.freeMarket / 100000000).toFixed(2) }}亿</span>
        </template>
      </el-table-column>
      <el-table-column label="昨日交易" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.yesterdayAmount }}亿</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="no-data" v-else-if="isFirst">
      <img :src="require('@/assets/img/no-data@2x.png')" />
      <div>数据正在运算中，请稍后…</div>
    </div>
    <div v-else class="no-data">
      <img :src="require('@/assets/img/no-data@2x.png')" />
      <div>当日没有选出标的</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
    },
    isFirst: {
      type: Boolean,
    },
  },
  methods: {
    toNewPage(val){
      if (this.$route.query.wy !=1 && val.name.indexOf('*') ==-1) {
        let str;
        if (val.code.substr(0, 1) == 6) {
          str = "sh"
        } else {
          str = "sz"
        }
        window.location.href = 'cailianshe://stock_detail?stock_id=' + str + val.code
      }
    }
  }
};
</script>

