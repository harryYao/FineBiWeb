<template>
  <div class="feedback-container" id="feedback_container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="query-panel">
      <div style="padding-bottom: 5px; color: rgb(162, 165, 172);"> 
        <span>数据来源：</span>
        <el-radio-group v-model="source" size="mini" @change="sourceChange">
          <el-radio-button label="0">游戏内部</el-radio-button>
          <el-radio-button label="1">论坛</el-radio-button>
          <el-radio-button label="2">应用商店</el-radio-button>
        </el-radio-group>
        <span v-if="source != '0'" class="tips">论坛和商店数据取自第三方平台</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="3">
          <p>开始日期</p>
          <el-date-picker
            type="date"
            placeholder="开始日期"
            v-model="form.startData"
            style="width: 100%;"
            @change="dateChange"
            size="small"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <p>结束日期</p>
          <el-date-picker
            type="date"
            placeholder="结束日期"
            v-model="form.endDate"
            style="width: 100%;"
            @change="dateChange"
            size="small"
          ></el-date-picker>
        </el-col>
        <el-col :span="5">
          <p>内容</p>
          <el-input v-model="form.desc" placeholder="支持多关键词查询，空格分隔" @keypress.enter.native="onSubmit" clearable size="small"></el-input>
        </el-col>
        <el-col :span="2" v-if="source == 0">
          <p>系统</p>
          <el-select v-model="form.os" placeholder="系统" size="small">
            <el-option label="全部" value></el-option>
            <el-option label="Android" value="android"></el-option>
            <el-option label="Ios" value="ios"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" v-if="source == 0">
          <p>游戏版本</p>
          <!-- <el-input v-model="form.version" placeholder="全部"></el-input> -->
          <el-select v-model="form.version" placeholder="系统" size="small">
            <el-option label="全部" value></el-option>
            <el-option :label="v" :value="v" v-for="(v, index) in versionlist" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" v-if="source == 0">
          <p>用户UID</p>
          <el-input v-model="form.uid" placeholder="全部" @keypress.enter.native="onSubmit" clearable size="small"></el-input>
        </el-col>
        <el-col :span="2" v-if="source == 1">
          <p>分类</p>
          <el-select v-model="form.category1" placeholder="分类" size="small">
            <el-option label="全部" value></el-option>
            <!-- <el-option label="兴趣部落" value="兴趣部落"></el-option> -->
            <el-option :label="v" :value="v" v-for="(v, index) in bbslist" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" v-if="source == 2">
          <p>评论星级</p>
          <el-select v-model="form.rank" placeholder="评论星级" size="small">
            <el-option label="全部" value></el-option>
            <el-option label="5 ★★★★★" value="5"></el-option>
            <el-option label="4 ★★★★" value="4"></el-option>
            <el-option label="3 ★★★" value="3"></el-option>
            <el-option label="2 ★★" value="2"></el-option>
            <el-option label="1 ★" value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" v-if="source == 2">
          <p>应用商店</p>
          <el-select v-model="form.category2" placeholder="应用商店" size="small">
            <el-option label="全部" value></el-option>
            <el-option :label="v" :value="v" v-for="(v, index) in shoplist" :key="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4" style="padding-top: 15px;">
          <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
          <el-button type="default" size="small" icon="iconfont iconExcel" :disabled="exportloading" @click="exportExcel" 
            v-loading="exportloading" element-loading-spinner="el-icon-loading">导出</el-button>
        </el-col>
      </el-row>
      <div class="sort-div">
        <el-button :class="{'active': form.sort_type == 2 }" @click="sortSearch(2)">按信息量排序<i class="el-icon-sort-down" v-if="form.sort_type == 2"></i></el-button>
        <el-button :class="{'active': form.sort_type == 1 }" @click="sortSearch(1)">按时间排序<i class="el-icon-sort-down" v-if="form.sort_type == 1"></i></el-button>
        <!-- 保留有效内容， title="过滤反馈内容长度小于等于6的内容" -->
        <el-checkbox v-model="form.checked" v-if="form.sort_type == 1" size="small" title="过滤反馈内容长度小于等于6的内容" @change="onSubmit">保留有效内容</el-checkbox>
      </div>
    </div>
    <div class="content-panel" id="content_panel">

      <el-table :data="tableData" style="width: 100%; font-size: 12px;">
        <el-table-column prop="desc" label="反馈内容" width>
          <template slot-scope="scope">
            <span v-if="source != '0'" class="zsentiment" :class="scope.row.zsentiment == '中立' ? 'com': (scope.row.zsentiment == '正面'? 'good' : 'bad')">{{scope.row.zsentiment}}</span>
            <span class="desc" v-html="scope.row.desc"></span>
          </template>
        </el-table-column>
        <el-table-column prop="submit_time" label="时间" width="86" :class-name="'other'">
          <template slot-scope="scope">
            <span v-if="source == '0'">{{scope.row.submit_time}}</span>
            <span v-else>{{ timeftm(scope.row.submit_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="uid" label="UID" width="100" :class-name="'other'" v-if="source == 0"></el-table-column>
        <el-table-column prop="uid" label="其他信息" width="380" :class-name="'other'">
          <template slot-scope="scope">
            <p class="row1" :title="`账号：${scope.row.submit_user}\n${scope.row.contact?scope.row.contact.replace('Tel:', ' Tel:'):''}\n${scope.row.location||''}`">
              <span class="lable_span">账号：{{scope.row.submit_user}}</span>
              <span v-if="scope.row.contact">{{scope.row.contact.replace("Tel:", " Tel:")}}</span>
              <!-- <span v-if="scope.row.location">地区：{{scope.row.location}}</span> -->
            </p>
            <p v-if="source == '1' || source == '2'" >
              <span>来源：{{scope.row.category}}</span>
              <span v-if="scope.row.platform">系统：{{scope.row.platform}}</span>
              <span v-if="scope.row.rank">评分：{{scope.row.rank}}</span>
            </p>
            <p class="ellipsis">
              <span v-if="scope.row.game_version">版本{{scope.row.game_version}}</span>
              <span
                class="devicetype"
                :title="scope.row.device_type"
                v-if="scope.row.device_type"
              >{{ scope.row.device_type.length > 120?scope.row.device_type.substr(0, 120) + '...': scope.row.device_type}}</span>
            </p>
            <p v-if="source == '0'">
              <span v-if="scope.row.location">地区：{{scope.row.location}}</span>
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
import Sticky from '@/components/sticky'

export default {
  data() {
    return {
      loading: false,
      exportloading: false,
      over: false,
      size: 30,
      from: 0,
      source: "0",
      form: {
        startData: '',
        endDate: '',
        zsentiment: '',
        source: '',
        version: '',
        os: '',
        uid: '',
        desc: '',
        sort_type: 2,
        rank: '',
        category1: '',
        category2: '',
        checked: true,
      },
      
      copy: {},
      query: '{}',
      apilist: {"0":"get_info", "1":"get_bbs_info", "2":"get_shop_info"},
      downloadapilist: {"0":"download_excel", "1":"download_bbs_excel", "2":"download_shop_excel"},
      testurl: '192.168.96.50', // 厚杰本地测试地址
      mainurl: 'bob-bi-api.ztgame.com', // 线上地址
      versionlist: [],
      bbslist: [],
      shoplist: [],
      tableData: [],
      isTest: 0 // 是否是测试
    }
  },
  components: {
    Sticky
  },
  created() {
    if (this.$route.query) {
      this.query = JSON.stringify(this.$route.query);
      if (this.$route.query.istest) {
        this.isTest = parseInt(this.$route.query.istest)
      }
      this.setParams();
      if (this.$route.query.source == '1') {
        this.getBBSModuleList();
      } else if (this.$route.query.source == '2') {
        this.getShopList();
      }
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
    timeftm(v) {
      return moment.unix(v).format('YYYY-MM-DD HH:mm:ss');
    },
    setParams() {
      if (this.query !== '{}') {
        const tem = JSON.parse(this.query);
        this.source = tem.source ? tem.source : '0';
        this.form.desc = tem.desc ? decodeURIComponent(tem.desc) : '';
        this.form.startData = tem.start ? tem.start : moment().add(-1, 'days');
        this.form.endDate = tem.end ? tem.end : moment();
        this.form.version = tem.v ? tem.v : '';
        this.form.os = tem.os ? tem.os : '';
        this.form.uid = tem.uid ? tem.uid : '';
        this.form.sort_type = tem.st ? tem.st : 1;
        this.form.rank = tem.rank ? tem.rank : '';
        if (tem.source == '1') {
          this.form.category1 = tem.cate ? decodeURIComponent(tem.cate) : '';
        } else if (tem.source == '2') {
          this.form.category2 = tem.cate ? decodeURIComponent(tem.cate) : '';
        }
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
    sourceChange() {
      this.onSubmit();
      this.dateChange();
    },
    dateChange() {
      if (this.source == "0") {
        this.getVersionList();
      } else if (this.source == "1") {
        this.getBBSModuleList();
      } else if (this.source == "2") {
        this.getShopList();
      }
    },
    getFeedbackInfo(scrollTop) {
      if (this.over) {
        this.loading = false;
        return;
      }
      console.log('getFeedbackInfo')
      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},  
        url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/${this.apilist[this.source]}`,
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
    getBBSModuleList() {
      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/get_category_info`,
        data: Qs.stringify({
          "startDate": moment(this.form.startData).format('YYYY-MM-DD'),
          "endDate": moment(this.form.endDate).format('YYYY-MM-DD'),
          "category_type": "bbs",
          "token": this.token
        })
      })
      .then((response) => {
        const res = response.data;
        if (res.code == 0) {
          this.bbslist = res.data.category
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    getShopList() {
      axios({
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/get_category_info`,
        data: Qs.stringify({
          "startDate": moment(this.form.startData).format('YYYY-MM-DD'),
          "endDate": moment(this.form.endDate).format('YYYY-MM-DD'),
          "category_type": "shop",
          "token": this.token
        })
      })
      .then((response) => {
        const res = response.data;
        if (res.code == 0) {
          this.shoplist = res.data.category
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
          url: `http://${ this.isTest ? this.testurl: this.mainurl }:5001/${this.downloadapilist[this.source]}`,
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
      if (this.source == "0") {
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
          "delete_invalid": this.copy.checked ? 1 : 0,
          "token": this.token
        });
      } else if (this.source == "1") {
        return Qs.stringify({
          "startDate": moment(this.copy.startData).format('YYYY-MM-DD'),
          "endDate": moment(this.copy.endDate).format('YYYY-MM-DD'),
          "zsentiment": this.copy.zsentiment,
          "category": this.copy.category1,
          "desc": this.copy.desc,
          "sort_type": this.copy.sort_type,
          "size": this.size,
          "from": this.from,
          "delete_invalid": this.copy.checked ? 1 : 0,
          "token": this.token
        });
      } else if (this.source == "2") {
        return Qs.stringify({
          "startDate": moment(this.copy.startData).format('YYYY-MM-DD'),
          "endDate": moment(this.copy.endDate).format('YYYY-MM-DD'),
          "zsentiment": this.copy.zsentiment,
          "category": this.copy.category2,
          "rank": this.copy.rank,
          "desc": this.copy.desc,
          "sort_type": this.copy.sort_type,
          "size": this.size,
          "from": this.from,
          "delete_invalid": this.copy.checked ? 1 : 0,
          "token": this.token
        });
      }
      
    }
  }
}
</script>

<style lang="less" scoped>

@fc: rgb(162, 165, 172);
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
.ellipsis {
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.feedback-container {
  // height: 100%;
  min-height: 100vh;
  overflow: auto;
  .query-panel {
    position: fixed;
    z-index: 10;
    top: 0;
    width: 100%;
    padding: 10px;
    background-color: #ffffff;
    box-shadow: 1px 1px #ededed;
    .el-row {
      .el-col {
        p {
          color: @fc;
          font-size: 12px;
        }
        /deep/.el-link {
          margin-left: 30px;
          padding: 2px;
        }
        /deep/.el-button {
          .iconfont.iconExcel {
            font-size: 12px;
          }
          .el-loading-mask .el-loading-spinner {
            margin-top: -7px;
          }
        }
      }
    }
    .tips {
      font-size: 12px;
      margin-left: 10px;
      color: @fc;
    }
    .sort-div {
      padding-top: 10px;
      /deep/.el-button {
        font-size: 12px;
        padding: 5px 10px;
        cursor: pointer;
        color: #409EFF;
        border-color: #409EFF;
        &.active {
          cursor: auto;
          color: @fc;
          border-color: @fc;
        }
      }
      /deep/.el-checkbox {
        margin-left: 20px;
      }
    }
  }
  .content-panel {
    padding: 136px 10px 10px;
    // min-height:70vh;
    /deep/.el-table {
      td {
        padding: 8px 0;
        border: none !important;
        border-bottom: 1px solid #ebeef5 !important;
        .cell {
          line-height: 18px;
          span.zsentiment {
            color: #ffffff;
            font-size: 12px;
            padding: 2px 3px 1px;
            margin-right: 5px;
            &.good {
              background-color: rgb(51, 138, 55);
            }
            &.bad {
              background-color: rgb(223, 69, 69);
            }
            &.com {
              background-color: #898989;
            }
          }
          span.desc {
            font-size: 15px;
          }
          p {
            line-height: 1.2;
            span {
              margin-right: 5px;
              line-height: 1.4;
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