<template>
  <div class="main-container">
    <el-container>
      <el-header height="40px">
        <div class="logo-name">巨人商业智能</div>
        <div class="modules">
          <template v-if="game">
            <el-scrollbar>
            <div class="module" :class="{ active: activeId === item.id}" v-for="item in game.children" :key="item.id" @click="chooseModule(item)">{{ item.text }}</div>
            </el-scrollbar>
          </template>
        </div>
        <div class="right">
          <el-select v-model="gameid" placeholder="请选择" @change="selectGame">
            <el-option
              v-for="item in games"
              :key="item.id"
              :label="item.text"
              :value="item.id">
              <span class="icon" ></span>
              <span>{{ item.text }}</span>
            </el-option>
          </el-select>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="240px">
          <div v-if="treeData">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
          </div>
        </el-aside>
        <el-main>
          <!-- <iframe :src="curUrl" width="100%" height="100%" frameborder="0"></iframe> -->
          <el-tabs v-model="editableTabsValue" type="card" @tab-remove="removeTab">
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable="index > 0"
            >
              <iframe :id="`iframe_${item.name}`" :src="item.url" width="100%" height="100%" frameborder="0"></iframe>
            </el-tab-pane>
          </el-tabs>
          <div class="tabs-remove">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import jsonp from '../../service/jsonp'
import service from '../../service/index'
import { jsonToTree } from '../../utils/utils'

export default {
  name: '',
  data () {
    return {
      baseapi: process.env.BASE_API,
      test: '首页',
      games: [],
      gameid: '',
      game: null,
      tree: null,
      activeId: '',
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      currentReport: null,
      result: [],
      reports: [],
      editableTabs: [],
      editableTabsValue: 'home',
      refreshpid: '',
      refreshList: [],
      timeList: []
    };
  },
  created() {
    if (!this.token) {
      this.$router.replace('/login');
    }
    this.getMenuList();
    this.getHomePage();
  },
  components: {},
  computed: {
    ...mapState(['token', 'username']),
    curUrl() {
      return this.getIFrameSrc(this.currentReport.id);
    }
  },
  mounted () {
  },
  methods: {
    addTab(text, url, id) {
      const item = this.editableTabs.find((item) => {
        return item.name === id
      })
      this.addInterval(id);
      if (!item) {
        this.editableTabs.push({
          title: text,
          name: id,
          url: url
        });
      }
      this.editableTabsValue = id;
    },
    addInterval(id) {
      if (this.refreshList.includes(id)) {
        const timer = setInterval(function() {
          console.log('refresh iframe :', id)
          document.getElementById(`iframe_${id}`).contentWindow.location.reload(true);
        }, 5*60*1000)
        this.timeList.push(timer);
      }
    },
    removeTab(targetName) {
      console.log(targetName);
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    selectGame() {
      this.game = this.result.find((item) => {
        return item.id === this.gameid
      })
      this.getTheRefreshPId(this.game);
      if (this.game.children && this.game.children.length > 0) {
        this.activeId = this.game.children[0].id
        this.treeData = this.game.children[0].children;
      }
    },
    getIFrameSrc(id) {
      if (id) {
        return `${this.baseapi}/v10/entry/access/${id}?dashboardType=5`;
      }
      return '';
    },
    getHomePageSrc(id) {
      // `/webroot/decision/v10/entry/access/09d9715a-0e10-4ea4-98c7-7ebabae571f7?dashboardType=5`
      // `http://bi.battleofballs.com`
      // `/webroot/decision/v10/enter/access/09d9715a-0e10-4ea4-98c7-7ebabae571f7?dashboardType=5`
      return `${this.baseapi}/v10/entry/access/${id}?dashboardType=5`;
    },
    chooseModule(item) {
      this.activeId = item.id
      this.treeData = item.children;
      if (!item.isParent) {
        this.currentReport = item;
      }
      this.addTab(item.text, this.getIFrameSrc(item.id), item.id)
      this.getTheRefreshPId(item);
    },
    handleNodeClick(data) {
      if (data.isParent) {
        return;
      }
      this.currentReport = data;
      console.log(data);
      this.addTab(data.text, this.getIFrameSrc(data.id), data.id)
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
    },
    logout() {
      // service.post(`/logout?fine_auth_token=${this.token}`,{},
      //   {
      //     headers: { 'Authorization': this.token }
      //   }).
      //   then((data) => {
      //     if (data === 'success') {  
      //       this.$store.commit('setToken', '');
      //       this.$router.push('/login')
      //     }
      //   })

      // 跨域登出
      const url = `/logout/cross/domain?fine_auth_token=${this.token}`;
      jsonp(url).then((data) => {
        console.log(data)
        this.$store.commit('setToken', '');
        this.$router.push('/login')
      })
    },
    getTheRefreshPId(item) {
      if (item.id === this.refreshpid) {
        this.game.children.forEach((item) => {
          if (!this.refreshList.includes(item.id)) {
            this.refreshList.push(item.id);
          }
        })
      }
    },
    getMenuList() {
      // '/v10/{directoryId}/entries/{privilegeType}'
      // service.get(`/v10/decision-directory-root/entries?fine_auth_token=${this.token}`)
      service.get(`/v10/entries/all?fine_auth_token=${this.token}`)
        .then((data) => {
          if (data) {
            const result = jsonToTree(data, 'id', 'pId');
            const temp = result.find((item) => {
              return item.id === 'decision-directory-root'
            })
            this.result = temp.children;
            for (let index = 0; index < this.result.length; index++) {
              const element = this.result[index];
              if (element.text === '实时监控') {
                this.refreshpid = element.id;
              }
              
              this.games.push({ text: element.text, id: element.id });
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getHomePage() {
      // /v10/homepages{privilegeType} 取具有特定权限的首页 权限类型 1:查看 2:授权 3:编辑
      // /v10/homepages 获取全部首页
      service.get(`/v10/homepages?fine_auth_token=${this.token}`)
        .then((data) => {
          if (data) {
            if (data && data.length > 0) {
              this.addTab(data[0].text, this.getHomePageSrc(data[0].pcHomePage), data[0].pcHomePage);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}
</script>

<style lang='less' scoped>
@mc: #4a488e;
@top-bar: #8491c3;
@top-mc: #7361b3;
@top-mc-active: #5b6896;


.main-container {
  display: block;
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      color: #333;
      text-align: center;
      line-height: 40px;
      height: 40px;
      width: 100%;
      background-color: @top-bar;
      &::after {
        float: clear;
      }
      .logo-name {
        float: left;
        width: 220px;
        font-weight: 600;
        font-size: 18px;
        color: #FFF;
        text-align: left;
      }
      .modules {
        float: left;
        height: 40px;
        width: calc(100% - 520px);
        /deep/.el-scrollbar .el-scrollbar__wrap {
          height: calc(100% + 17px);
          .el-scrollbar__view{
            white-space: nowrap;
            text-align: left;
          }
        }
        .module{
          // float: left;
          display: inline-block;
          height: 40px;
          border: none;
          line-height: 40px;
          padding: 0 20px;
          border-radius: 0;
          margin-left: 0px;
          border-right: 1px solid #ababab;
          background-color: lighten(@mc, 20);
          color: #ededed;
          cursor: pointer;
          &.active {
            background-color: lighten(@mc, 10%);
            color: #FFF;
          }
          &::after {
            clear: both;
          }
        }
      }
      .right {
        float: left;
        width: 300px;
        /deep/.el-select {
          width: 140px;
          .el-input {
            .el-input__inner {
              background-color: #FFFFFF;
              border: none;
              border-radius: 0;
            }
            .el-input__suffix {
              .el-select__caret {
                color: #333;
              }
            }
          }
        }
        /deep/.el-dropdown {
          width: 140px;
          margin-left: 10px;
        }
      }
    }
    
    .el-aside {
      background-color: #f2f4f7;
      color: #333;
      text-align: center;
      height: 100%;
      /deep/.el-tree {
        background-color: #f2f4f7;
        .el-tree-node__content {
          height: 40px;
          &:hover {
            color: #FFF;
            background-color: lighten(@mc, 20%);
          }
        }
        .el-tree-node.is-current {
          .el-tree-node__content {
            // color: #FFF;
            // background-color: @mc;
          }
        }
        .el-tree-node:focus > .el-tree-node__content {
          color: #FFF;
          background-color: lighten(@mc, 10%);
        }
      }
    }
    
    .el-main {
      background-color: #E9EEF3;
      color: #333;
      text-align: center;
      height: 100%;
      padding: 0;
      overflow: hidden;
      /deep/.el-tabs {
        height: 100%;
        .el-tabs__header {
          margin-bottom: 0;
          .el-tabs__item {
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            &:hover {
              color: lighten(@mc, 10%);
            }
            .el-icon-close {
              text-align: center;
              &::before {
                transform: scale(1);
              }
            }
          }
          .el-tabs__item.is-active {
            border-bottom: 1px solid @mc;
            color: @mc;
            font-weight: bold;
            background-color: #FFF;
          }
        }
        .el-tabs__content {
          height: calc(100% - 41px) !important;
          .el-tab-pane {
            height: 100%;
          }
        }
      }
    }
  }
}

.el-select-dropdown {
  .el-select-dropdown__list {
    .el-select-dropdown__item {
      padding: 0 12px;
      &.selected {
        color: @mc;
      }
      .icon {
        background-image: url('~/static/gamesicon/qiuqiu.png');
        background-size: 100% 100%;
        border-radius: 6px;
        width: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
      }
    }
  }
}
</style>
