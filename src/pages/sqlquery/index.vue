<template>
  <div class="sqlquery-wp">
    <div><h4>SQL的提交与展示</h4></div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input v-model="sql" type="textarea" :rows="10"></el-input>
        <div class="btn-view">
          <el-button type="primary" @click="commitSQLQuery">提交</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-scrollbar>
          <prism class="prism-wp" language="sql" :code="sql_fmt"></prism>
        </el-scrollbar>
      </el-col>
    </el-row>
    <div class="content-wp">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import sqlFormatter from "sql-formatter";
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'

import jsonp from '../../service/jsonp';
import { Base64 } from 'js-base64';

export default {
  data() {
    return {
      sql: '',
      sql_fmt: '',
      format_sql: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  computed: {
    ...mapState(['token', 'username'])
  },
  components: {
    Prism
  },
  watch: {
    sql(newval, oldval) {
      if (newval) {
        this.sql_fmt = sqlFormatter.format(newval, {
            language: "sql", // Defaults to "sql"
            indent: "    "   // Defaults to two spaces
        });
      }
    }
  },
  methods: {
    commitSQLQuery() {
      if (this.sql) {
        const url = `http://115.159.248.97:8080/pullDataWriteSql?user_name=${this.username}&writeSql=${Base64.encode(this.sql)}`;
        jsonp(url).then((data) => {
          console.log(data);
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-scrollbar {
  .el-scrollbar__wrap {
    height: 283px;
    background: #f9fbfb;
    border: 1px solid #dedede;
    padding: 0px;
  }
  .el-scrollbar__bar.is-vertical {
    background-color: #5660b6;
  }
}
/deep/.prism-wp  {
  margin: 0;
  padding: 10px;
  background: transparent;
  min-height: 240px;
}
.sqlquery-wp {
  padding: 20px;
  .btn-view {
    height: 50px;
    text-align: right;
    padding-top: 5px;
  }
}
</style>