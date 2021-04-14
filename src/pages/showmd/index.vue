<template>
  <div class="showmd-main">
    <div v-html="html" v-highlight></div>
  </div>
</template>


<script>
// 当前markdown的插件是  https://github.com/showdownjs/showdown     11.6k
// 另一个markdown插件是  https://github.com/markedjs/marked         24.7k
// 这还要个整合后的控件 https://github.com/ravenq/markdown-it-vue  效果酷炫 http://www.aqcoder.com/markdown

import showdown from 'showdown'
import readme from '../../../README.md'

export default {
  data () {
    return {
      md: readme,
      html: ''
    }
  },
  components: {
    showdown
  },
  mounted () {
    let converter = new showdown.Converter()
    this.html = converter.makeHtml(this.md)
  }
}
</script>
<style lang="less" scoped>
</style>
