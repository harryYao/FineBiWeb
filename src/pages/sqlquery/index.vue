<template>
  <div class="sqlquery-wp" v-loading="loading2">
    <div class="header-bar">
      <h4>SQL自助查询</h4>
      <el-link type="primary" href="/static/file/dic.html" target="_blank">查看数据字典</el-link>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input v-model="sql" type="textarea" placeholder="请输入查询语句" :rows="10" resize="none"></el-input>
        <div class="btn-view">
          <el-input class="purpose-input" placeholder="请输入用途" v-model="purpose"></el-input>
          <!-- <el-button @click="clearTime">清除刷新</el-button> -->
          <el-button type="primary" @click="commitSQLQuery" :disabled="loading2 || loading ">提交</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <el-scrollbar>
          <prism class="prism-wp" language="sql" :code="sql_fmt"></prism>
        </el-scrollbar>
      </el-col>
    </el-row>
    <div class="content-wp" v-loading="loading">
      <el-table stripe
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="复制"
          width="70" align="center">
          <template slot-scope="scope">
            <el-link icon="el-icon-document-copy" class="copy-link" size="mini" v-clipboard:copy="scope.row.exec_sql" 
            v-clipboard:success="onCopy"> </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="dates"
          label="查询语句">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              width="400"
              trigger="hover">
              <el-scrollbar>
                <prism class="prism-wp-pop" language="sql" :code="sqlfmt(scope.row.exec_sql)"></prism>
              </el-scrollbar>
              <p class="sqltext" slot="reference">{{scope.row.exec_sql}}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="purpose"
          label="用途"
          width="220">
        </el-table-column>
        <el-table-column
          prop="file_path"
          label="状态"
          width="160">
          <template slot-scope="scope">
            <p v-if="scope.row.exec_state == 'ERROR' || scope.row.exec_state == '失败'" class="error_p">
              <span class="error_span">失败</span>
              <span class="error_span_log" :title="scope.row.err_log" v-clipboard:copy="scope.row.err_log" v-clipboard:success="onCopy">日志</span>
            </p>
            <p v-else-if="scope.row.exec_state == '上传文件完成' || scope.row.exec_state == '成功' " class="success_p">
              <span>成功</span>
              <el-link type="primary" v-if="scope.row.file_path" target="_blank" :href="`http://115.159.248.97:8080/downFile?filename=${scope.row.file_name}&downloadPath=${scope.row.file_path}`">下载</el-link>
            </p>
            <p v-else>
              <span>{{scope.row.exec_state}}</span>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="提交人"
          width="160">
          <template slot-scope="scope">
            <p class="custom-dt">{{scope.row.user_name}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="dates"
          label="日期"
          width="160">
          <template slot-scope="scope">
            <p class="custom-dt">{{ timefmt(scope.row.dates) }}</p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="size"
        :current-page="from"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import sqlFormatter from "sql-formatter";
import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'
import moment from 'moment';
import axios from 'axios'
import Qs from 'qs';
import jsonp from '../../service/jsonp';
import { Base64 } from 'js-base64';
import { setInterval, clearInterval } from "timers";

export default {
  data() {
    return {
      purpose: '',
      sql: '',
      sql_fmt: '',
      format_sql: '',
      tableData: [],
      total: 0,
      size: 10,
      from: 1,
      loading2: false,
      loading: false,
      timer: null,
      interval: 20 //秒
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
  mounted() {
    this.startQuery();
  },
  methods: {
    onCopy() {
      this.$message.success("复制成功！");
    },
    clearTime() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    startQuery() {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.getQueryList();
      this.timer = setInterval(() => {
        this.getQueryList();
      }, this.interval*1000);
    },
    timefmt(v) {
      return moment(v).format('YYYY-MM-DD HH:mm:ss');
    },
    sqlfmt(newval) {
      if (newval) {
        return sqlFormatter.format(newval, {
            language: "sql", // Defaults to "sql"
            indent: "    "   // Defaults to two spaces
        });
      } 
      return '';
    },
    commitSQLQuery() {
      if (this.sql.trim()) {
        this.loading2 = true;
        // const url = `http://115.159.248.97:8080/pullDataWriteSql?user_name=${this.username}&writeSql=${Base64.encode(this.sql)}&purpose=${this.purpose}`;
        const url = `http://47.103.168.10:8088/pullDataWriteSql?user_name=${this.username}&writeSql=${Base64.encode(this.sql)}&purpose=${this.purpose}`;
        jsonp(url).then((data) => {
          this.loading2 = false;
          this.startQuery();
        })
      }
    },
    getQueryList() {
      this.loading = true;
      axios({
        method: 'POST',
        url: `http://47.103.168.10:8088/getPullDataLogByDate?`,
        timeout: 10000,
        data: {
          "user_name": this.username,
          "size": this.size,
          "from": this.from - 1
        }
      })
      .then((response) => {
        const res = response.data;
        if (res.success) {
          this.total = res.total_size;
          this.tableData = res.data; 
        }
        this.loading = false;  
      })
      .catch((error) => {
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      this.from = val;
      this.startQuery();
    }
  }
}
</script>

<style lang="less" scoped>

@fc: rgb(162, 165, 172);

/deep/.el-scrollbar {
  .el-scrollbar__wrap {
    height: 283px;
    background: #f9fbfb;
    border: 1px solid #dedede;
    padding: 0px;
  }
  .el-scrollbar__bar.is-vertical {
    background-color: #cdcdcd;
  }
}
/deep/.prism-wp  {
  margin: 0;
  padding: 10px;
  background: transparent;
  min-height: 240px;
  line-height: 1.2;
}
/deep/.language-sql{
  code[class*="language-"] {
    font-size: 0.6em;
    line-height: 1.2;
  }
}
/deep/.prism-wp-pop {
  margin: 0;
  padding: 0px;
  background: transparent;
  max-height: 400px;
}
/deep/.copy-link {
  padding: 4px 15px;
  font-size: 14px;
  color: @fc;
}
.error_p {
  color: rgb(223, 69, 69);
  .error_span_log {
    cursor: pointer;
  }
}
.success_p {
  color: rgb(51, 138, 55);
}
.custom-dt {
  color: @fc;
}
.sqltext {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/.el-table {
  td {
    padding: 8px 0;
    font-size: 14px;
  }
}
.sqlquery-wp {
  padding: 10px;
  .header-bar {
    height: 30px;
    position: relative;
    /deep/.el-link{
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
  .btn-view {
    height: 50px;
    // display: flex;
    padding-top: 5px;

    /deep/.purpose-input {
      float: left;
      width: calc(100% - 100px);
    }
    /deep/.el-button {
      float: right;
      width: 95px;
    }
    &::after {
      clear: both;
    }
  }
}
.el-pagination {
  margin-top: 5px;
}

</style>