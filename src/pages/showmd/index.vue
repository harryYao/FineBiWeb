<template>
  <div class="showmd-main">
    <!-- <el-row>
      <el-col :md="3" :lg="6" :xl="8" class="hidden-sm-and-down">&nbsp;</el-col>
      <el-col :sm="24" :md="18" :lg="12" :xl="8">
        
      </el-col>
      <el-col :md="3" :lg="6" :xl="8" class="hidden-sm-and-down">&nbsp;</el-col>
    </el-row> -->
    <div v-html="html" ></div>
  </div>
</template>
<script>
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
    let text = this.md.toString()
    this.html = converter.makeHtml(text)
  }
}
</script>
<style lang="less" scoped>
</style>
