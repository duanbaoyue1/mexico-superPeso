<template>
  <div class="select-item" :class="{ 'has-value': !!value }">
    <div class="value-wrapper" @click="toggleChoose">
      <span>
        {{ value || placeHolder }}
      </span>
      <m-icon class="icon" :class="{ open: this.openSelect }" type="right" :width="8" :height="12" />
    </div>
    <div class="select-items" :class="{ 'col-one': columns == 1, show: !!this.openSelect }">
      <div class="items" v-for="item in items" :key="item.value" :class="{ active: value == item.value }" @click="chooseValue(item)">
        <div v-html="item.label"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Number,
      default: 2,
    },
    itemAttrs: {
      type: String,
      default: '',
    },
    placeHolder: {
      type: String,
      default: 'Please select',
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
  border-radius: 14px;
  border: 1px solid #cccccc;
  padding: 20px;
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
    align-items: center;
    justify-content: space-between;
    .icon {
      transition: all 0.3s;
      &.open {
        transform: rotate(90deg);
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
