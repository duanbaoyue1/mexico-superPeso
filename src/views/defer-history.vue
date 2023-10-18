<template>
  <div class="defer-history content-area">
    <div class="items" v-for="(item, index) in lists" :key="index">
      <div class="flex-between">
        <span>Fecha de la solicitud</span>
        <span>{{ item.approvalDate }}</span>
      </div>
      <div class="flex-between">
        <span>Monto del reembolso</span>
        <span class="color-red fw-900">$ {{ item.amount }}</span>
      </div>
      <!-- <div class="flex-between">
        <span>Deferment term</span>
        <span>{{ item.extendedTerm }} days</span>
      </div> -->
      <div class="flex-between">
        <span>Actualizar la fecha de vencimiento del reembolso</span>
        <span>{{ item.updatedDueDate }}</span>
      </div>
      <div class="pay" @click="goPayHis(item)">Ver el historial de pagos de reembolsos >></div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.setTabBar({
      show: true,
      fixed: true,
      transparent: false,
      backgroundColor: '#f9f9f9',
      title: 'Historial de reembolso diferido',
    });
  },

  data() {
    return {
      lists: [],
    };
  },

  mounted() {
    document.body.style.backgroundColor = '#f9f9f9';
    this.getDeferHistory();
  },

  beforeDestroy() {
    this.setTabBar({
      backgroundColor: '#fff',
    });
  },

  methods: {
    goPayHis(item) {
      this.innerJump('pay-history', { type: 'bill', id: item.id });
    },
    async getDeferHistory() {
      let res = await this.$http.post('/api/extension/history', {
        id: this.$route.query.orderId,
      });
      this.lists = res.data.list;
    },
  },
};
</script>

<style lang="scss" scoped>
.defer-history {
  padding-top: 24px;
  background: #f9f9f9;
  margin-top: 16px;

  .items {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
    line-height: 18px;
    padding: 24px 16px;
    background: #ffffff;
    border-radius: 8px;
    margin-left: 16px;
    margin-right: 16px;
    margin-bottom: 16px;
    .pay {
      font-size: 14px;
      font-family: Roboto-Regular, Roboto;
      font-weight: 500;
      color: #ff4b3f;
      line-height: 24px;
      margin-top: 8px;
    }
    &:last-child {
      border-bottom: none;
    }
    .head {
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #333333;
      line-height: 24px;
    }
    .flex-between {
      span {
        &:first-child {
          color: #999999;
          max-width: 220px;
        }
      }
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
