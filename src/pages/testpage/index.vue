<template>
  <div class="container">
    <h3>testpage</h3>
    <demo />
    <br />
    <div>count: {{count}}</div>
    <el-button type="private" @click="count++">Add</el-button>
  </div>
</template>

<script>
import demo from '../../components/demo'
export default {
  data() {
    return {
      count: 0
    }
  },
  components: { demo }
};
</script>

<style lang="less" scoped>
.container {
  text-align: left;
}
</style>
