<template>
  <div class="select-item" :class="{ 'has-value': !!value }">
    <div class="value-wrapper" @click="toggleChoose">
      <span>
        {{ value || placeHolder }}
      </span>
      <m-icon class="icon" :class="{ open: this.openSelect }" type="right" :width="8" :height="12" />
    </div>

    <van-action-sheet v-model="openSelect" :title="title" close-on-click-action>
      <div class="pop-content">
        <div class="items" :class="'column_' + columns">
          <div class="item" v-for="item in items" :class="{ active: item.value == value }" @click="chooseValue(item)">
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    itemAttrs: {
      type: [String, Number],
      default: '',
    },
    placeHolder: {
      type: String,
      default: 'Por favor, elija',
    },
    columns: {
      type: Number,
      default: 2,
    },
    defaultOpen: {
      type: Boolean,
      default: false,
    },
  },

  created() {
    this.value = this.defaultValue;
    this.openSelect = this.defaultOpen;
  },

  watch: {
    defaultOpen() {
      this.openSelect = this.defaultOpen;
    },
    defaultValue: {
      handler() {
        this.value = this.defaultValue;
      },
      deep: true,
    },
  },

  data() {
    return {
      openSelect: false,
      value: '',
    };
  },

  methods: {
    chooseValue(item) {
      console.log(item);
      this.value = item.value;
      this.toggleChoose();
      this.$emit('choose', { attr: this.itemAttrs, value: item.value });
    },
    toggleChoose() {
      this.openSelect = !this.openSelect;
    },
  },
};
</script>

<style lang="scss" scoped>
.select-item {
  border-radius: 8px;
  border: 1px solid #eee;
  &.has-value {
    .value-wrapper {
      color: #333333;
    }
  }

  .value-wrapper {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    line-height: 20px;
    display: flex;
    padding: 16px;
    align-items: center;
    justify-content: space-between;
    .icon {
      transition: all 0.3s;
      &.open {
        transform: rotate(90deg);
      }
    }
  }

  .pop-content {
    max-height: 400px;
    overflow-y: auto;
    .items {
      margin-top: 40px;
      margin-left: 24px;
      margin-right: 24px;
      margin-bottom: 64px;
      &.column_2 {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
          width: 156px;
        }
      }
      .item {
        margin-bottom: 16px;
        text-align: center;
        position: relative;
        border-radius: 8px;
        font-size: 16px;
        font-family: Roboto-Regular, Roboto;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        padding: 10px 0;
        background: #f3f3f3;

        span {
          position: relative;
        }

        &.active {
          font-weight: bold;
          color: #333333;
          background: #43e0a2;
        }
      }
    }
  }

  .select-items {
    display: none;
    margin-top: 20px;
    margin-bottom: -20px;
    flex-wrap: wrap;
    justify-content: space-between;
    &.show {
      display: flex;
    }
    &.col-one {
      .items {
        width: 280px;
      }
    }
    .items {
      border-radius: 20px;
      border: 1px solid #e4e4e4;
      font-size: 16px;
      line-height: 20px;
      font-weight: 400;
      color: #999999;
      padding: 10px 0px;
      margin-bottom: 20px;
      text-align: center;
      width: 130px;

      &.active {
        border: 2px solid #1143a4;
        font-weight: 500;
        color: #1143a4;
      }
    }
  }
}
</style>
