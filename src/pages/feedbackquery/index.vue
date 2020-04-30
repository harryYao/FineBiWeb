<template>
  <div class="feedback-container" id="feedback_container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="query-panel">
      <el-row :gutter="10">
        <el-col :span="3">
          <p>开始日期</p>
          <el-date-picker
            type="date"
            placeholder="开始日期"
            v-model="form.startData"
            style="width: 100%;"
            @change="getVersionList"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <p>结束日期</p>
          <el-date-picker
            type="date"
            placeholder="结束日期"
            v-model="form.endDate"
            style="width: 100%;"
            @change="getVersionList"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <p>内容</p>
          <el-input v-model="form.desc" placeholder="全部" @keypress.enter.native="onSubmit" clearable></el-input>
        </el-col>
        <!-- <el-col :span="2">
          <p>反馈类型 </p>
          <el-select v-model="form.zsentiment" placeholder="反馈类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="中立" value="中立"></el-option>
            <el-option label="负面" value="负面"></el-option>
          </el-select>
        </el-col>-->
        <el-col :span="2">
          <p>系统</p>
          <el-select v-model="form.os" placeholder="系统">
            <el-option label="全部" value></el-option>
            <el-option label="Android" value="android"></el-option>
            <el-option label="Ios" value="ios"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <p>游戏版本</p>
          <!-- <el-input v-model="form.version" placeholder="全部"></el-input> -->
          <el-select v-model="form.version" placeholder="系统">
            <el-option label="全部" value></el-option>
            <el-option :label="v" :value="v" v-for="(v, index) in versionlist" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <p>用户UID</p>
          <el-input v-model="form.uid" placeholder="全部" @keypress.enter.native="onSubmit" clearable></el-input>
        </el-col>
        <el-col :span="3" style="padding-top: 13px;">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="default" icon="iconfont iconExcel" :disabled="exportloading" @click="exportExcel" 
          v-loading="exportloading" element-loading-spinner="el-icon-loading">
            <span>导出</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content-panel" id="content_panel">
      <div class="sort-div">
        <el-button :class="{'active': form.sort_type == 2 }" @click="sortSearch(2)">按信息量排序<i class="el-icon-sort-down" v-if="form.sort_type == 2"></i></el-button>
        <el-button :class="{'active': form.sort_type == 1 }" @click="sortSearch(1)">按时间排序<i class="el-icon-sort-down" v-if="form.sort_type == 1"></i></el-button>
      </div>
      <el-table :data="tableData" style="width: 100%; font-size: 12px;">
        <el-table-column prop="desc" label="反馈内容" width>
          <template slot-scope="scope">
            <!-- <span :class="scope.row.zsentiment == '中立' ? 'com':'bad'">{{scope.row.zsentiment}}</span> -->
            <span class="desc" v-html="scope.row.desc"></span>
          </template>
        </el-table-column>
        <el-table-column prop="submit_time" label="时间" width="86" :class-name="'other'"></el-table-column>
        <el-table-column prop="uid" label="UID" width="100" :class-name="'other'"></el-table-column>
        <el-table-column prop="uid" label="其他信息" width="380" :class-name="'other'">
          <template slot-scope="scope">
            <p class="row1" :title="`账号：${scope.row.submit_user}\n${scope.row.contact?scope.row.contact.replace('Tel:', ' Tel:'):''}\n${scope.row.location||''}`">
              <span class="account">账号：{{scope.row.submit_user}}</span>
              <span v-if="scope.row.contact">{{scope.row.contact.replace("Tel:", " Tel:")}}</span>
              <span v-if="scope.row.location">地区：{{scope.row.location}}</span>
            </p>
            <p><span>版本{{scope.row.game_version}}</span>
              <span
                class="devicetype"
                :title="scope.row.device_type"
                v-if="scope.row.device_type"
              >{{ scope.row.device_type.length > 120?scope.row.device_type.substr(0, 120) + '...': scope.row.device_type}}</span>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="over" v-if="over">
        暂无更多。
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios'
import Qs from 'qs';
import moment from 'moment';

export default {
  data() {
    return {
      loading: false,
      exportloading: false,
      over: false,
      size: 30,
      from: 0,
      form: {
        startData: '',
        endDate: '',
        zsentiment: '',
        version: '',
        os: '',
        uid: '',
        desc: '',
        sort_type: 2
      },
      copy: {},
      query: '{}',
      isTest: 0, // 是否是测试
      testurl: '192.168.96.37', // 厚杰本地测试地址
      mainurl: 'bob-bi-api.ztgame.com', // 线上地址
      versionlist: [],
      tableData: []
    }
  },
  created() {
    if (this.$route.query) {
      this.query = JSON.stringify(this.$route.query);
      this.setParams();
    }
  },
  mounted() {
    !this.form.startData && (this.form.startData = moment().add(-6, 'days'));
    !this.form.endDate && (this.form.endDate = moment());
    window.addEventListener('scroll', this.windowScroll);
    this.query == '{}' && this.onSubmit();
    this.getVersionList();
  },
  destroyed() {
    window.removeEventListener('scroll', this.windowScroll)
  },
  watch: {
    $route(){
      this.query = JSON.stringify(this.$route.query);
    },
    query() {
      this.setParams();
      this.onSubmit();
    }
  },
  computed: {
    ...mapState(['token', 'username'])
  },
  methods: {
    setParams() {
      if (this.query !== '{}') {
        const tem = JSON.parse(this.query);
        this.form.desc = tem.desc ? tem.desc : '';
        this.form.startData = tem.start ? tem.start : moment().add(-1, 'days');
        this.form.endDate = tem.end ? tem.end : moment();
        this.form.version = tem.v ? tem.v : '';
        this.form.os = tem.os ? tem.os : '';
        this.form.uid = tem.uid ? tem.uid : '';
        this.form.sort_type = tem.st ? tem.st : 1;
      }
    },
    onSubmit() {
      this.loading = true;
      this.over = false;
      this.tableData = [];
      this.from = 0;
      this.copy = JSON.parse(JSON.stringify(this.form));
      // console.log(moment(this.form.startData).format('YYYY-MM-DD'))
      this.getFeedbackInfo();
    },
    sortSearch(sort) {
      if (this.form.sort_type != sort) {
        this.form.sort_type = sort;
        this.onSubmit();
      }
    },
    getFeedbackInfo(scrollTop) {
      if (this.over) {
        this.loading = false;
        return;
      }
      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},  
        url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/getInfo`,
        timeout: 10000,
        data: this.getData()
      })
      .then((response) => {
        const res = response.data;
        if (res.code == 0) {
          this.tableData = this.tableData.concat(res.data);
          this.from++;
          if (res.data.length === 0) {
            this.over = true;
          } else {
            this.over = false;
          }
          this.$nextTick(() => {
            document.documentElement.scrollTop = scrollTop;
            this.loading = false;
          })
        } else {
          this.loading = false;
          this.$message.error(res.msg);
        }        
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
      });
    },
    getVersionList() {
      // http://127.0.0.1:5001/getGameVersionInfo
      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/getGameVersionInfo`,
        data: Qs.stringify({
          "startDate": moment(this.form.startData).format('YYYY-MM-DD'),
          "endDate": moment(this.form.endDate).format('YYYY-MM-DD'),
          "token": this.token
        })
      })
      .then((response) => {
        const res = response.data;
        if (res.code == 0) {
          this.versionlist = res.data.game_version
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    windowScroll() {
      if (!this.loading && !this.over) {
        const offsetBottom = this.$el.getBoundingClientRect().bottom;
        var scrollTop2 = document.documentElement.scrollTop;
        if (Math.abs(document.documentElement.clientHeight - offsetBottom) < 1) {
          this.loading = true;
          setTimeout(() => {
            this.getFeedbackInfo(scrollTop2);
          }, 300)
        }
      }
    },
    exportExcel() {
      if (!this.exportloading) {
        this.exportloading = true;
        axios({
          method: 'POST',
          headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
          url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/download_excel`,
          responseType: 'blob',
          data: this.getData()
        })
        .then((res) => {
          let blob = new Blob([res.data], {type: res.type})
          let downloadElement = document.createElement('a')
          let href = window.URL.createObjectURL(blob); //创建下载的链接
          downloadElement.href = href;
          downloadElement.download = `${this.username}_${new Date().getTime()}.xlsx`; //下载后文件名
          document.body.appendChild(downloadElement);
          downloadElement.click(); //点击下载
          document.body.removeChild(downloadElement); //下载完成移除元素
          window.URL.revokeObjectURL(href); //释放blob对象
          this.exportloading = false;
        })
        .catch((error) => {
          console.log(error);
          this.exportloading = false;
        });        
      }
    },
    getData() {
      return Qs.stringify({
        "startDate": moment(this.copy.startData).format('YYYY-MM-DD'),
        "endDate": moment(this.copy.endDate).format('YYYY-MM-DD'),
        "zsentiment": this.copy.zsentiment,
        "uid": this.copy.uid,
        "game_version": this.copy.version,
        "device_type": this.copy.os,
        "desc": this.copy.desc,
        "sort_type": this.copy.sort_type,
        "size": this.size,
        "from": this.from,
        "token": this.token
      });
    }
  }
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
// Loading的样式 TODO
// /deep/.el-loading-mask.is-fullscreen .el-loading-spinner {
//   width: 100px;
//   height: 100px;
//   left: calc(50% - 50px);
//   top: calc(50% - 50px);
//   background-color: rgba(206, 210, 218, 0.4);
//   border-radius: 10px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
.feedback-container {
  // height: 100%;
  min-height: 100vh;
  overflow: auto;
  .query-panel {
    padding: 10px;
    .el-row {
      .el-col {
        p {
          color: rgb(162, 165, 172);
          font-size: 12px;
        }
        /deep/.el-link {
          margin-left: 30px;
          padding: 2px;
        }
        /deep/.el-button {
          .el-loading-mask .el-loading-spinner {
            margin-top: -7px;
          }
        }
      }
    }
  }
  .content-panel {
    padding: 6px 10px 10px;
    // min-height:70vh;
    .sort-div {
      /deep/.el-button {
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;
        color: #409EFF;
        border-color: #409EFF;
        &.active {
          cursor: auto;
          color: rgb(162, 165, 172);
          border-color: rgb(162, 165, 172);
        }
      }
    }
    /deep/.el-table {
      td {
        padding: 5px 0;
        border: none !important;
        border-bottom: 1px solid #ebeef5 !important;
        .cell {
          line-height: 18px;
          span.bad {
            background-color: rgb(223, 69, 69);
            color: #ffffff;
            font-size: 12px;
            padding: 1px 2px 0px;
            margin-right: 5px;
          }
          span.com {
            background-color: #898989;
            color: #ffffff;
            font-size: 12px;
            padding: 1px 2px 0px;
            margin-right: 5px;
          }
          span.desc {
            font-size: 15px;
          }
          p {
            line-height: 1.2;
            span {
              margin-right: 5px;
            }
            &.row1 {
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }

        &.other .cell {
          color: #a5a5a5;
        }
      }
    }
    .over {
      color: #a5a5a5;
      text-align: center;
      line-height: 40px;
    }
  }
}
</style>