<template>
  <div class="multi-recommend">
    <div class="order-items">
      <div class="order-item" :class="{ active: !order.unChecked }" v-for="(order, index) in list" :key="order.id" @click="checkLoan(index)">
        <div class="reloan" v-if="order.isReloan">Volver a prestar</div>

        <div class="info">
          <img :src="order.productImgUrl" />
          <div class="name">
            <div class="product">{{ order.productName }}</div>
            <div class="info-item">
              Compañía de préstamo:
              {{ order.companyName }}
            </div>
            <div class="info-item">
              Tasa de interés :
              {{ order.interest }}% / Day
            </div>
            <div class="info-item">
              Monto del préstamo :
              <span class="number">
                <span class="fs-12">$</span>
                {{ order.minAmount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="select-all">
      <button class="cancel" @click="hide">Cancelar</button>
      <button @click="selectAll">Seleccionar todo</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['list'],
  methods: {
    checkLoan(index) {
      // if (this.checkedNums == 1 && !this.loans[index].unChecked) return;
      this.$set(this.list, index, { ...this.list[index], unChecked: !this.list[index].unChecked });
      this.updateHome();
    },

    selectAll() {
      for (let index = 0; index < this.list.length; index++) {
        this.$set(this.list, index, { ...this.list[index], unChecked: false });
      }
      this.updateHome();
    },

    hide() {
      this.$emit('hide');
    },
    updateHome() {
      this.$emit(
        'update',
        this.list.filter(t => !t.unChecked)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.multi-recommend {
  width: 375px;
  background: #fff;
  box-sizing: border-box;
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  bottom: 0;
  margin-bottom: 88px;

  .select-all {
    width: 375px;
    height: 88px;
    background: #ffffff;
    box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.08);
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    button {
      width: 231px;
      height: 48px;
      background: #416cef;
      border: 1px solid #416cef;
      border-radius: 8px;
      font-size: 18px;
      font-family: Roboto-Black, Roboto;
      font-weight: 900;
      color: #ffffff;
      line-height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      &.cancel {
        border: 1px solid #999999;
        margin-right: 16px;
        width: 96px;
        font-weight: 400;
        color: #999999;
        background: transparent;
      }
    }
  }

  .order-items {
    height: 100%;
    overflow-y: scroll;
    .order-item {
      position: relative;
      padding: 16px;
      margin: 24px 16px;
      border-radius: 16px;
      margin-top: 0;
      background: #fff;
      border: 1px solid #eee;
      &.active {
        border: 1px solid #333;
      }

      .reloan {
        position: absolute;
        width: 86px;
        height: 20px;
        border-radius: 10px;
        border: 1px solid #ffbd5c;
        top: 16px;
        right: 16px;
        font-size: 10px;
        padding: 0 6px;
        font-family: Roboto-Medium, Roboto;
        font-weight: 500;
        color: #ffbd5c;
        line-height: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .status {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-bottom: 16px;
        .icon {
          margin-right: 16px;
        }
      }

      .info {
        display: flex;
        color: #999999;
        img {
          display: block;
          width: 40px;
          height: 40px;
          margin-right: 16px;
        }
        .info-item {
          margin-top: 8px;
          font-size: 10px;
          color: #999999;
          display: flex;
          justify-content: space-between;
          .number {
            font-size: 16px;
            font-family: Roboto-Bold, Roboto;
            font-weight: bold;
            color: #ff4b3f;
            line-height: 18px;
          }
        }
        .name {
          font-size: 14px;
          font-family: Roboto-Regular, Roboto;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          .product {
            font-size: 14px;
            font-family: Roboto-Black, Roboto;
            font-weight: 900;
            color: #000000;
            line-height: 20px;
          }

          .label {
            font-size: 10px;
            font-family: Roboto-Regular, Roboto;
            font-weight: 400;
            color: #999999;
            line-height: 12px;
            margin-right: 8px;
          }
          > div {
            &:first-child {
              margin-bottom: 10px;
            }
          }
        }
      }
    }
  }
}
</style>
