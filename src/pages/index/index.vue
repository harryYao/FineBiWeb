<template>
  <div class="main-container">
    <header>
      <h3>{{ test }}</h3> 
      <router-link to="interface">interface</router-link>
    </header>
    <div class="token"><b>Token:</b> {{ token }}</div>
    <ul class="api-list">
      <li v-for="item in apilist" :key="item.name">
        <div class="title">{{ item.title }}</div>
        <div class="name" @click="handleItemClick(item)">测试</div>
        <div class="url">{{ item.url }}</div>
        <div class="desc">{{ item.desc }}</div>
        <div class="result" @click="showDetail(item.result)">
          {{ item.result ? JSON.stringify(item.result) : ''}}
        </div>
      </li>
    </ul>
    <div class="dialog-bg" v-if="showdetail" @click="showdetail = false">
      <div class="dialog-content" @click.stop="">
        <json-view theme="vs-code" :data="jsondata"/>
      </div>
    </div>
  </div>
</template>

<script>
import jsonp from '../../service/jsonp'
import service from '../../service/index'
import jsonView from 'vue-json-views'

export default {
  name: '',
  data () {
    return {
      showdetail: false,
      jsondata: {},
      test: 'FineBI 嵌入式WEB API测试',
      username: 'admin',
      password: 'admin',
      testReportId: 'de706cb2bc2443759eb4367aadefe131',
      testUserId: 'b2e6d799-6a91-4779-aa08-a6d033cefeb5',
      token: '',
      apilist: [{
          title: '2.1.1 登录',
          name: 'Login',
          desc: '登录',
          url: `/login/cross/domain?fine_username=name&fine_password=password&validity=-1&callback=myfunction`,
          result: ''
        }, {
          title: '2.1.2 模板管理节点 ',
          name: 'getReportList',
          desc: '获取模板管理节点下所有模板相关信息',
          url: `/v5/api/dashboard/search?page=1&count=30`,
          result: '',
          needtoken: true
        }, {
          title: '2.1.3 模板管理节点 界面',
          name: 'dashboardManage',
          desc: '获取模板管理节点下所有模板相关信息的可视化界面',
          url: `/dashboard/management`,
          result: '打卡新窗口',
          islink: true
        }, {
          title: '2.1.4 分享仪表板 API',
          name: 'shareDashboard',
          desc: '分享模板给其他用户（需要传入参数报表ID和用户ID）',
          url: `/v5/api/dashboard/share/user/result?entityId=xxx&userId=xxx`,
          result: '',
          needtoken: true
        }, {
          title: '2.1.5 当前目录下模板及文件夹列表',
          name: 'dashboard',
          desc: '我的（当前登录者）仪表板下对应目录的详细数据信息（包括文件夹和模板）',
          url: `/dashboard`,
          result: '打卡新窗口仪表盘',
          islink: true
        }, {
          title: '2.1.6 当前用户信息',
          name: 'userInfo',
          desc: '获取当前用户的所有详细信息。目前包括departs、roles、users、reports',
          url: `/v5/api/dashboard/user/info?`,
          result: '',
          needtoken: true
        }, {
          title: '2.1.7 模板分享到的用户',
          name: 'reportShareUsers',
          desc: '获取 xx 模板分享给了哪些用户',
          url: `/v5/api/dashboard/share/user?entityId=xxx`,
          result: '',
          needtoken: true
        }, {
          title: '2.2.1 创建仪表板',
          name: 'createDashboard',
          desc: '新建仪表板, 创建到的目录结构, dir={"name":"新建仪表板12","catalog":["我的测试"]}',
          url: `/v5/api/platform/dashboard/reports?dir=xxx`,
          result: '',
          needtoken: true
        }, {
          title: '2.2.2 当前目录下模板及文件夹列表（JSON）',
          name: 'getDashboardList',
          desc: '我的（当前登录者）仪表板下对应目录的详细数据信息（包括文件夹和模板） dir={"catalog":["新建文件夹"],"reportId":"7e6382e9fe5448b38bb0bc3f50913b5d"}',
          url: `/v5/api/platform/dashboard/list?dir=xxx`,
          result: '',
          needtoken: true
        }, {
          title: '2.2.3 获取模板相关信息',
          name: 'getDashboardInfo',
          desc: '使用该接口可以获取模板相关信息。需要查看的模板目录	  info={"index":[  { "id":"7e6382e9fe5448b38bb0bc3f50913b5d" }] }',
          url: `/v5/api/platform/dashboard/reports/info?info=xxx`,
          result: '',
          needtoken: true
        }, {
          title: '2.2.4 分享给我的模板信息',
          name: 'getShareToMeList',
          desc: '使用该接口可获取分享给我（当前登录用户）的所有模板信息',
          url: `/v5/api/dashboard/share?`,
          result: '',
          needtoken: true
        }, {
          title: '2.2.5 触发全局更新',
          name: 'updateGenerate',
          desc: '使用该接口触发全局更新，根据当前业务包的状态选择是全局更新/Check更新/配置更新',
          url: `/v5/api/conf/update/generate?`,
          result: '',
          needtoken: true
        }, {
          title: '2.2.6 触发单表更新',
          name: 'updateTable',
          desc: '根据业务包名对业务包中所有的表进行更新，或者根据表转义名进行单表更新。 无论是业务包还是单表的更新，都进行的是业务包表或单表的全量的更新。 在不加表的转义名时候，进行的就是对这个业务包的更新，加了之后，进行的是对这个表的更新',
          url: '/v5/api/conf/update/pack/table?info=xxx',
          result: '',
          needtoken: true
        }, {
          title: '2.2.7 获取所有业务包分组信息',
          name: 'getPackageGroups',
          desc: '获取数据准备下所有业务包的分组',
          url: '/v5/api/conf/groups?',
          result: '',
          needtoken: true
        }, {
          title: '2.2.8 获取单个业务包信息',
          name: 'getPackageInfo',
          desc: '集成时，不能一个个手动输入业务包名字或者表的名字来做相应的单更新，需要有接口来获取到这些信息',
          url: '/v5/api/conf/packs/{packageId}?',
          result: '',
          needtoken: true
        }, {
          title: '2.2.9 数据准备界面',
          name: 'toPackagePage',
          desc: '打开获取数据准备界面',
          url: `/v5/api/conf/page`,
          result: '打卡新窗口',
          islink: true
        }, {
          title: '2.2.10 删除仪表板',
          name: 'deleteDashboard',
          desc: '通过调用该接口，用户可以删除已经创建好的仪表板；',
          url: '/v5/api/platform/dashboard/report?info=xx',
          result: '',
          needtoken: true
        }, {
          title: '2.2.11 修改仪表板名称',
          name: 'renameDashboard',
          desc: '通过调用该接口，用户可以修改已经创建好的仪表板的名称；',
          url: '/v5/api/platform/dashboard/rename?info=xx',
          result: '',
          needtoken: true
        }, {
          title: '2.2.12 取消分享仪表板',
          name: 'cancleShare',
          desc: '作用：通过调用该接口，用户可以将某个用户对的仪表板分享取消；',
          url: '/v5/api/dashboard/share/user/rejection/result?entityId=a,b,c&userId=1,2,3',
          result: '',
          needtoken: true
        }, {
          title: '2.2.14 另存仪表板',
          name: 'saveasDashboard',
          desc: '作用：使用该接口可以另存一个仪表板；',
          url: '/v5/platform/dashboard/saveas?entityId=a,b,c&userId=1,2,3',
          result: '',
          needtoken: true
        }

      ]
    };
  },
  created() {
  },
  components: {
    jsonView
  },
  computed: {
  },
  mounted () {
  },
  watch: {
    showdetail(val) {
      if (val) {
        this.noScroll();
      } else {
        this.canScroll();
      }
    }
  },
  methods: {
    showDetail(json) {
      console.log(Object.prototype.toString.call(json))
      if (Object.prototype.toString.call(json) === '[object Object]') {
        this.showdetail = true;
        this.jsondata = json;
      }
    },
    handleItemClick(api) {
      if (api.islink) {
        window.open(process.env.BASE_API + api.url);
      } else if (api.name === 'Login') {
        this.Login();
      } else if (api.needtoken && !this.token) {
        alert('请先登录！！')
      } else {
        switch (api.name) {
          case 'shareDashboard':
            this.shareDashboard(api);
            break;
          case 'reportShareUsers':
            this.reportShareUsers(api);
            break;
          case 'createDashboard':
            this.createDashboard(api);
            break;
          case 'getDashboardList':
            this.getDashboardList(api);
            break;
          case 'getDashboardInfo':
            this.getDashboardInfo(api);
            break;
          case 'updateTable':
            this.updateTable(api);
            break;
          case 'getPackageInfo':
            this.getPackageInfo(api);
            break;
          case 'deleteDashboard':
            this.deleteDashboard(api);
            break;
          case 'renameDashboard':
            this.renameDashboard(api);
            break;
          case 'cancleShare':
            this.cancleShare(api);
            break;
          case 'saveasDashboard':
            this.saveasDashboard(api);
            break;
          default:
            this.comFun(api);
            break;
        }

      }
    },
    comFun(api) {
      jsonp(api.url + "&fine_auth_token=" + this.token).then((data) => {
        console.log(data);
        api.result = data;
        // if (data.data) {
        //   api.result = JSON.stringify(data.data);
        // } else {
        //   api.result = JSON.stringify(data);
        // }
      })
    },
    Login() {
      const url = `/login/cross/domain?fine_username=${ this.username }&fine_password=${ this.password }&validity=-1`;
      jsonp(url).then((data) => {
        this.apilist[0].result = data;
        this.token = data.accessToken;
      })
    },
    shareDashboard(api) {
      var id = prompt("请输入报表ID");
      var userid = prompt("请输入用户ID");
      if (!id || !userid) return;
      const url = `/v5/api/dashboard/share/user/result?entityId=${id}&userId=${userid}&fine_auth_token=${this.token}`;
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    reportShareUsers(api) {
      var id = prompt("请输入报表ID");
      const url = `/v5/api/dashboard/share/user?entityId=${id}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    createDashboard(api) {
      const name = 'api创建_' + Math.round(Math.random() * 10000);
      const dir = {"name": name, "catalog": ["我的测试"]}
      console.log(JSON.stringify(dir));
      const url = `/v5/api/platform/dashboard/reports?dir=${encodeURIComponent(JSON.stringify(dir))}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    getDashboardList(api) {
      // reportId: "28557cbd64164b27ac44af65118ae035"
      // const dir = {catalog: ["我的测试"]} // 获取某个文件夹
      // const dir = {catalog: ["我的测试"], reportId: "28557cbd64164b27ac44af65118ae035"} // [] 无法获取
      const dir = {} // 获取全部
      // const dir = {catalog: [], reportId: "0198d12f476d4f1f8af9eee3fee9e6d8"} // [] 无法获取
      const url = `/v5/api/platform/dashboard/list?dir=${encodeURIComponent(JSON.stringify(dir))}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    getDashboardInfo(api) {
      // const info = {index: [{id: "0198d12f476d4f1f8af9eee3fee9e6d8"}]} // 最外层可以获取
      const info = {index: [{id: "28557cbd64164b27ac44af65118ae035"}]} // 我的测试 目录下的也可以获取
      // 看样子是直接通过id获取，无法理解他的api的描述
      const url = `/v5/api/platform/dashboard/reports/info?info=${encodeURIComponent(JSON.stringify(info))}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    updateTable(api) {
      // const info = {"packageName":"数据挖掘", "tableName":"分类预测_会员数据"} // 更新某个表
      const info = {"packageName":"数据挖掘"} // 更新某个业务包
      const url = `/v5/api/conf/update/pack/table?info=${encodeURIComponent(JSON.stringify(info))}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    getPackageInfo(api) {
      const package_id = 'da54083883b34b65983e5f572ff76ea6'; // 业务包ID
      const url = `/v5/api/conf/packs/${package_id}?fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    deleteDashboard(api) {
      var id = prompt("请输入ID");
      if (!id) return;
      const info = {folder: false, reportId: id}; 
      const url = `/v5/api/platform/dashboard/report?info=${encodeURIComponent(JSON.stringify(info))}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    renameDashboard(api) {
      //  {"name":"模板名字","newName":"重命名的名字","reportId":"模板id"} 
      var id = prompt("请输入ID");
      var newName = prompt("请输入重命名的名字");
      if (!id || !newName) return;
      const info =  {name: 'name', newName: newName, reportId: id} 
      // 经测试 原模板名字 可以不用输入，打开的仪表盘无法重命名
      const url = `/v5/api/platform/dashboard/rename?info=${encodeURIComponent(JSON.stringify(info))}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    cancleShare(api) {
      // entityId	  xx模板对应的 reportId, 传多个的话，用逗号分隔	 entityId=14523
      // userId	  已经分享给其他用户的用户ID，传多个的话，用逗号分隔	 userId=b5f0c2ee
      const entityId = prompt("请输入reportId");
      const userId = prompt("请输入userId");
      if (!entityId || !userId) return;
      // 经测试 原模板名字 可以不用输入，打开的仪表盘无法重命名
      const url = `/v5/api/dashboard/share/user/rejection/result?entityId=${entityId}&userId=${userId}&fine_auth_token=${this.token}`
      jsonp(url).then((data) => {
        api.result = data;
      })
    },
    saveasDashboard(api) {
      // 请求方式：post
      // from	需要另存的仪表板 "from":[{"reportId":"3ef0fe316b604c75bc4ec0ab644ce0f9"}]
      // to	另存到的路径	"to":{"name":"新建仪表板61","catalog":[]}
      const name = 'api另存为_' + Math.round(Math.random() * 10000);
      const reportId = prompt("请输入reportId");
      if (!reportId) return;
      service.post('/user', {
          from: [{ reportId: reportId }],
          to: {name: name, catalog: []}
        })
        .then(function (response) {
          api.result = data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
}
</script>

<style lang='less' scoped>
.main-container {
  display: block;
  padding: 30px;
  .token {
    margin-top: 20px;
  }
  ul.api-list {
    margin-top: 20px;
    li {
      margin: 5px 0;
      display: flex;
      // background-color: rgb(228, 213, 194);
      // &:nth-child(2n + 1) {
      //   background-color: rgb(195, 231, 219);
      // }
      .title {
        padding: 10px;
        width: 150px;
        background-color: rgb(195, 212, 231);
      }
      .name {
        padding: 10px;
        width: 80px;
        color: rgb(40, 56, 146);
        background-color: rgb(228, 213, 194);
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s;
        &:hover {
          background-color: lighten(rgb(228, 213, 194), 10%);
        }
      }
      .url {
        padding: 10px;
        margin-left: 5px;
        width: 340px;
        word-break: break-all;
        background-color: rgb(195, 212, 231);
      }
      .desc {
        padding: 10px;
        margin-left: 5px;
        width: 340px;
        background-color: rgb(228, 213, 194);
      }
      .result {
        padding: 10px;
        margin-left: 5px;
        background-color: rgb(195, 212, 231);
        flex: 1;
        max-height: 200px;
        // overflow: scroll;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 7;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
  .dialog-bg {
    position: fixed;
    z-index: 10;
    height: 100vh;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    .dialog-content {
      position: absolute;
      z-index: 12;
      top: 50px;
      width: 80%;
      left: 0;
      right: 0;
      margin: auto;
      bottom: 50px;
      overflow-y: auto;
      background-color: rgba(0, 0, 0, 0.9)
    }
  }
}
</style>
