<template>
  <div class="container">
    <h3>testpage</h3>
    <ul>
      <li>1. 自定义页面的嵌入极大的扩展了FineBI系统的展示能力</li>
      <li>2. 相比web组件内嵌页面的方式，路由方式打开自定义页面，加载速度极快</li>
      <li>3. Setting中目录id -> 对应路由即可，配置方便简易</li>
    </ul>
    <br />
    <div>count: {{count}}</div>
    <el-button type="private" @click="count++">Add</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
};
</script>

<style lang="less">
.container {
  padding: 20px;
  text-align: left;
  line-height: 30px;
}
</style>
