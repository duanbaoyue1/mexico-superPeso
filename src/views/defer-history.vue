<template>
  <div class="defer-history">
    <div class="items" v-for="(item, index) in lists" :key="index">
      <div class="head fs-18">Deferment {{ index + 1 }}</div>
      <div class="flex-between">
        <span>Deferment term</span>
        <span>{{ item.extendedTerm }} days</span>
      </div>

      <div class="flex-between">
        <span>Application date</span>
        <span>{{ item.approvalDate }}</span>
      </div>

      <div class="flex-between">
        <span>Updated due date</span>
        <span>{{ item.updatedDueDate }}</span>
      </div>

      <div class="flex-between">
        <span>Repayment amount</span>
        <span>₹ {{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lists: [],
    };
  },

  mounted() {
    this.getDeferHistory();
  },

  methods: {
    async getDeferHistory() {
      let data1 = await this.$http.post('/uzeaulazu/kgwhjiyu', {
        id: this.$route.query.orderId,
      });
      let data2 = await this.$http.post('/uzeaulazu/kgwhjiyj', {
        id: this.$route.query.orderId,
      });
      this.lists = this.mergeTwoArray(data1.data.list, data2.data.list);
      console.log(this.lists);
    },
  },
};
</script>

<style lang="scss" scoped>
.defer-history {
  .items {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    border-bottom: 6px solid #f4f4f4;
    padding: 30px 20px 20px;
    &:last-child {
      border-bottom: none;
    }
    > div {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
