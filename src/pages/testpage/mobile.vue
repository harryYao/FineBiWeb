<template>
  <div class="container">
    <h1>Mobile TestPage</h1>
    <van-row>
      <van-col span="8">
        <van-button type="primary">主要按钮</van-button>
      </van-col>
      <van-col span="8">
        <van-button type="info">信息按钮</van-button>
      </van-col>
      <van-col span="8">
        <van-button type="default">默认按钮</van-button>
      </van-col>
      <van-col span="8">
        <van-button type="warning">警告按钮</van-button>
      </van-col>
      <van-col span="8">
        <van-button type="danger">危险按钮</van-button>
      </van-col>
    </van-row>
    <van-cell title="选择单个日期" :value="date" @click="show = true" />

    <div class="testdemo">
      <demo />
    </div>
    <van-calendar v-model="show" @confirm="onConfirm" />
  </div>
</template>

<script>
import demo from '../../components/demo'

export default {
  components: { demo },
  data() {
    return {
      date: '',
      show: false,
    };
  },
  methods: {
    onConfirm(date) {
      this.show = false;
      this.date = this.formatDate(date);
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  padding: 0.2rem;
  .van-col {
    padding: 0.2rem 0;
  }
}
</style>
