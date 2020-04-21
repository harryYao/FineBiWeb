<template>
  <div class="feedback-container" id="feedback_container" v-loading="loading">
    <div class="query-panel">
      <el-row :gutter="10">
        <el-col :span="3">
          <p>开始日期 </p>
          <el-date-picker type="date" placeholder="开始日期" v-model="form.startData" style="width: 100%;" @change="getVersionList"></el-date-picker>
        </el-col>
        <el-col :span="3">
          <p>结束日期 </p>
          <el-date-picker type="date" placeholder="结束日期" v-model="form.endDate" style="width: 100%;" @change="getVersionList"></el-date-picker>
        </el-col>
        <el-col :span="5">
          <p>内容 </p>
          <el-input v-model="form.desc" placeholder="全部" @keypress.enter.native="onSubmit"></el-input>
        </el-col>
        <el-col :span="2">
          <p>反馈类型 </p>
          <el-select v-model="form.zsentiment" placeholder="反馈类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="中立" value="中立"></el-option>
            <el-option label="负面" value="负面"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <p>系统</p>
          <el-select v-model="form.os" placeholder="系统">
            <el-option label="全部" value=""></el-option>
            <el-option label="Android" value="android"></el-option>
            <el-option label="Ios" value="ios"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <p>游戏版本</p>
          <!-- <el-input v-model="form.version" placeholder="全部"></el-input> -->
          <el-select v-model="form.version" placeholder="系统">
            <el-option label="全部" value=""></el-option>
            <el-option :label="v" :value="v"  v-for="(v, index) in versionlist" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <p>用户UID </p>
          <el-input v-model="form.uid" placeholder="全部" @keypress.enter.native="onSubmit"></el-input>
        </el-col>
        <el-col :span="2" style="padding-top: 18px;">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-col>
      </el-row>      
    </div>
    <div class="content-panel" id="content_panel">
      <el-table
        :data="tableData"
        style="width: 100%; font-size: 12px;">
        <el-table-column prop="desc" label="反馈内容" width="">
          <template slot-scope="scope">
            <!-- <span :class="scope.row.zsentiment == '中立' ? 'com':'bad'">{{scope.row.zsentiment}}</span> -->
            <span class="desc" v-html="scope.row.desc"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="zsentiment" label="反馈类型" width="100"></el-table-column> -->
        <el-table-column prop="submit_time" label="时间" width="100" :class-name="'other'"></el-table-column>
        <el-table-column prop="uid" label="UID" width="100" :class-name="'other'"></el-table-column>
        <el-table-column prop="uid" label="其他信息"  width="480" :class-name="'other'">
          <template slot-scope="scope">
            <p>
              <span class="account">账号：{{scope.row.submit_user}}</span><span v-if="scope.row.contact">{{scope.row.contact.replace("Tel:", " Tel:")}}</span><span v-if="scope.row.location">地区：{{scope.row.location}}</span>
            </p>
            <p>
              <span class="devicetype" :title="scope.row.device_type" v-if="scope.row.device_type">{{ scope.row.device_type.length > 70?scope.row.device_type.substr(0, 70) + '...': scope.row.device_type}}</span>
            </p>
            <p>
              <span>版本{{scope.row.game_version}}</span>
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="submit_user" label="账号" width="120"></el-table-column>
        <el-table-column prop="contact" label="联系方式" width="120"></el-table-column>
        <el-table-column prop="system_type" label="系统" width="80"></el-table-column>
        <el-table-column prop="game_version" label="游戏版本" width="130"></el-table-column>
        <el-table-column prop="device_type" label="设备型号" width="260"></el-table-column>
        <el-table-column prop="location" label="地区" width="100"></el-table-column> -->
      </el-table>
      <!-- <div class="over" v-if="over">
        暂无更多。
      </div> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Qs from 'qs';
import moment from 'moment';

export default {
  data() {
    return {
      loading: false,
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
        desc: ''
      },
      isTest: 0,
      testurl: '192.168.96.37',
      mainurl: 'bob-bi-api.ztgame.com',
      versionlist: [],
      tableData: []
    }
  },
  mounted() {
    this.form.startData = moment().day(-1);
    this.form.endDate = moment();
    window.addEventListener('scroll', this.windowScroll);
    this.onSubmit();
    this.getVersionList();
  },
  destroyed() {
    window.removeEventListener('scroll', this.windowScroll)
  },
  methods: {
    onSubmit() {
      this.loading = true;
      this.over = false;
      this.tableData = [];
      this.from = 0;
      // console.log(moment(this.form.startData).format('YYYY-MM-DD'))
      this.getFeedbackInfo();
    },
    getFeedbackInfo(scrollTop) {
      if (this.over) {
        return;
      }

      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        // url: 'http://bob-bi-api.ztgame.com:5001/getInfo',
        // url: 'http://192.168.96.37:5001/getInfo',  
        url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/getInfo`,
        data: Qs.stringify({
          "startDate": moment(this.form.startData).format('YYYY-MM-DD'),
          "endDate": moment(this.form.endDate).format('YYYY-MM-DD'),
          "zsentiment": this.form.zsentiment,
          "uid": this.form.uid,
          "game_version": this.form.version,
          "device_type": this.form.os,
          "desc": this.form.desc,
          "size": this.size,
          "from": this.from
        })
      })
      .then((response) => {
        this.tableData = this.tableData.concat(response.data);
        this.from++;
        if (response.data.length === 0) {
          this.over = true;
        } else {
          this.over = false;
        }
        this.$nextTick(() => {
          document.documentElement.scrollTop = scrollTop;
          this.loading = false;
        })
      })
      .catch((error) => {
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
        })
      })
      .then((response) => {
        this.versionlist = response.data.game_version
      })
      .catch((error) => {
        console.log(error);
      });
    },
    windowScroll() {
      if (!this.loading) {
        const offsetBottom = this.$el.getBoundingClientRect().bottom;
        var scrollTop2 = document.documentElement.scrollTop;
        if (Math.abs(document.documentElement.clientHeight - offsetBottom) < 1) {
          this.loading = true;
          setTimeout(() => {
            this.getFeedbackInfo(scrollTop2);
          }, 300)
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
      }
    }
  }
  .content-panel {
    padding: 10px;
    // min-height:70vh;
    /deep/.el-table {
      td {
        padding: 5px 0;
        border: none !important;
        border-bottom: 1px solid #EBEEF5 !important;
        .cell {
          line-height: 18px;
          span.bad {
            background-color: rgb(223, 69, 69);
            color: #FFFFFF;
            font-size: 12px;
            padding: 1px 2px 0px;
            margin-right: 5px;
          }
          span.com {
            background-color: #898989;
            color: #FFFFFF;
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
          }
        }
      
        &.other .cell{
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