<template>
  <div class="main-container">
    <el-container>
      <el-header height="50px">
        <div class="logo-name" @click="gotoHomePage">
          <span class="logo"></span>
          <span class="text">商业智能报表</span>
        </div>
        <div class="modules">
          <template v-if="game">
            <el-scrollbar>
              <div
                class="module"
                :class="{ active: activeId === item.id, new: item.text == '用户之声' }"
                v-for="item in game.children"
                :key="item.id"
                @click="chooseModule(item)"
              >{{ item.text }}</div>
            </el-scrollbar>
          </template>
        </div>
        <div class="right">
          <el-select v-model="gameid" placeholder="请选择" @change="selectGame">
            <el-option v-for="item in games" :key="item.id" :label="item.text" :value="item.id">
              <span
                class="icon"
                :style="{backgroundImage: `url('/webroot/static/gamesicon/${getGameIcon(item.text)}')`}"
              ></span>
              <span class="text">{{ item.text }}</span>
            </el-option>
          </el-select>
          <span
            class="gameicon"
            v-if="game"
            :style="{backgroundImage: `url('/webroot/static/gamesicon/${getGameIcon(game.text)}')`}"
          ></span>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ username }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="down-container">
        <el-aside width="240px">
          <!-- <div v-if="treeData" style="height:100%;"> -->
          <el-scrollbar v-if="treeData">
            <el-tree
              :data="treeData"
              node-key="id"
              :current-node-key="currentnode"
              :props="defaultProps"
              @node-click="handleNodeClick"
              @node-expand="handleNodeExpand"
            ></el-tree>
          </el-scrollbar>
          <!-- </div> -->
        </el-aside>
        <el-main>
          <el-tabs
            v-model="editableTabsValue"
            type="card"
            @tab-click="tabClick"
            @tab-remove="removeTab"
          >
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              :closable="index > 0"
            >
              <span slot="label">
                <el-popover
                  placement="bottom"
                  width="80"
                  trigger="hover"
                  :popper-class="'tab-refresh'"
                  :open-delay="600"
                  :disabled="editableTabsValue != item.name"
                >
                  <span @click="refreshIframe(item)">刷新</span>
                  <el-button class="tabtitle" slot="reference">
                    <i class="el-icon-s-home" v-if="index == 0"></i>
                    {{ item.title }}
                  </el-button>
                </el-popover>
              </span>
              <!-- <div class="container" v-loading="item.loading" style="width:100%;height:100%;"> -->
              <div class="container" style="width:100%;height:100%;">
                <iframe
                  :name="`iframe_${item.name}`"
                  :id="`iframe_${item.name}`"
                  :src="item.url"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  @load="iframeLoaded(item)"
                ></iframe>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="tabs-remove">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
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
import { mapState } from "vuex";
import axios from "axios";
import jsonp from "../../service/jsonp";
import service from "../../service/index";
import { jsonToTree } from "../../utils/utils";
import config from "../../utils/config";

export default {
  name: "",
  data() {
    return {
      baseapi: process.env.BASE_API,
      test: "首页",
      games: [],
      gameid: "",
      game: null,
      tree: null,
      activeId: "",
      treeData: null,
      defaultProps: {
        children: "children",
        label: "text"
      },
      currentnode: "",
      result: [],
      reports: [],
      editableTabs: [],
      editableTabsValue: "home",
      timeList: [],
      timer: null
    };
  },
  created() {
    if (!this.token) {
      if (this.$route.query.page) {
        this.$router
          .replace(
            `/login?page=${this.$route.query.page}&title=${this.$route.query.title}`
          )
          .catch(err => {
            err;
          });
      } else {
        this.$router.replace("/login").catch(err => {
          err;
        });
      }
    }
    console.log(config);
    this.getMenuList();
    this.getHomePage();
  },
  components: {},
  computed: {
    ...mapState(["token", "username"])
  },
  mounted() {
    this.$nextTick(() => {
      this.getNotice();
    });
  },
  methods: {
    gotoHomePage() {
      this.$router.replace("/");
      this.$router.go(0);
    },
    iframeLoaded(item) {
      var iframeWindow = document.getElementById(`iframe_${item.name}`).contentWindow;
      var currentHref = iframeWindow.document.location.href;
      console.log(currentHref);
      // 检测iframe页面变化，内部token失效跳转到login页面时，项目需要重新登录。
      if (currentHref.includes(".ztgame.com/webroot/decision/login?")) {
        this.reLogin();
      }
    },
    /**
     * 检测token 函数，暂时弃用
     */
    async checkToken() {
      let rst = await service.get(
        `/v10/homepages?fine_auth_token=${this.token}`
      );
      if (rst && rst.includes("<!DOCTYPE html>")) {
        clearInterval(this.timer);
        this.$alert("请重新登录！", "登录会话已经失效", {
          confirmButtonText: "确定",
          callback: action => {
            this.logout();
          }
        });
      } else {
        // console.log('ok 没问题！');
      }
    },
    /**
     * 添加tab页面
     */
    addTab(text, url, id) {
      const item = this.editableTabs.find(item => {
        return item.name === id;
      });
      if (!item) {
        this.editableTabs.push({
          title: text,
          name: id,
          url: url,
          loading: true
        });
      }
      this.$router.replace(`/?page=${id}&title=${text}`).catch(err => {
        err;
      });
      this.editableTabsValue = id;
    },
    /**
     * tab点击事件
     */
    tabClick(e) {
      const element = e.$options.propsData;
      this.$router
        .replace(`/?page=${element.name}&title=${element.label}`)
        .catch(err => {
          err;
        });
    },
    /** 刷新页面 */
    refreshIframe(item) {
      document
        .getElementById(`iframe_${item.name}`)
        .contentWindow.location.reload(true);
    },
    /** 关闭页面 */
    removeTab(targetName) {
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
    /** 选择游戏（一级目录） */
    selectGame(p, isfirst = false) {
      this.game = this.result.find(item => {
        return item.id === this.gameid;
      });
      const default_game = config.games.find(item => {
        return item.name == this.game.text;
      });
      console.log("default_game", default_game, isfirst);
      if (this.game.children && this.game.children.length > 0) {
        this.activeId = this.game.children[0].id;
        this.treeData = this.game.children[0].children;
        if (default_game.tabs) {
          const dd = default_game.tabs.find(item => {
            return item.name == this.game.children[0].text;
          });
          console.log("dd", dd);
          !isfirst && this.activeTheDefaultPage(dd.mainid);
        }
      }
    },
    /**
     * 切换一级目录或者二级目录时，自动开发配置的页面，已经打开则切换tab到该页面
     */
    activeTheDefaultPage(mainid) {
      console.log("activeTheDefaultPage", mainid);
      // 查询当前哪个节点
      let nodes = [];
      this.getNode(this.result, mainid, nodes);
      console.log(nodes);
      if (nodes && nodes.length > 0) {
        let node = nodes[0];
        const item = this.editableTabs.find(item => {
          return item.name === node.id;
        });
        if (item) {
          this.editableTabsValue = mainid;
          this.$router
            .replace(`/?page=${node.id}&title=${node.text}`)
            .catch(err => {
              err;
            });
        } else {
          this.addTab(node.text, this.getIFrameSrc(node.id), node.id);
        }
      }
    },
    /** 根据id获取节点 （尾递归）*/
    getNode(list, mainid, result) {
      for (let index = 0; index < list.length; index++) {
        if (list[index].children && list[index].children.length > 0) {
          this.getNode(list[index].children, mainid, result);
        } else {
          if (list[index].id == mainid) {
            result.push(list[index]);
          }
        }
      }
    },
    /** 获取地址 */
    getIFrameSrc(id) {
      if (id) {
        return `${this.baseapi}/v10/entry/access/${id}?dashboardType=5`;
      }
      return "";
    },
    // 获取首页地址 待优化
    getHomePageSrc(id) {
      // `/webroot/decision/v10/entry/access/09d9715a-0e10-4ea4-98c7-7ebabae571f7?dashboardType=5`
      // `http://bi.battleofballs.com`
      // `/webroot/decision/v10/enter/access/09d9715a-0e10-4ea4-98c7-7ebabae571f7?dashboardType=5`
      return `${this.baseapi}/v10/entry/access/${id}?dashboardType=5`;
    },
    // 选择模块
    chooseModule(item) {
      this.activeId = item.id;
      this.treeData = item.children;

      const default_game = config.games.find(g => {
        return g.name == this.game.text;
      });
      const dd = default_game.tabs.find(t => {
        return t.name == item.text;
      });
      this.activeTheDefaultPage(dd.mainid);
    },
    // 选择节点
    handleNodeClick(data) {
      if (data.isParent) {
        return;
      }
      this.addTab(data.text, this.getIFrameSrc(data.id), data.id);
    },
    // 树节点打开
    handleNodeExpand(node) {},
    // 登出
    handleCommand(command) {
      if (command === "logout") {
        clearInterval(this.timer);
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
      jsonp(url).then(data => {
        this.$store.commit("setToken", "");
        this.$router.push("/login");
        clearInterval(this.timer);
      });
    },
    reLogin() {
      this.$store.commit("setToken", "");
      if (this.$route.query.page) {
        this.$router
          .replace(
            `/login?page=${this.$route.query.page}&title=${this.$route.query.title}`
          )
          .catch(err => {
            err;
          });
      } else {
        this.$router.replace("/login").catch(err => {
          err;
        });
      }
    },
    // 配置一级菜单图标
    getGameIcon(name) {
      const list = {
        球球大作战: "qiuqiu.png",
        嘿嘿语音: "heyhey.png"
      };
      return list[name] ? list[name] : "default.png";
    },
    // 查询全部菜单
    getMenuList() {
      console.log("getMenuList");
      // '/v10/{directoryId}/entries/{privilegeType}'
      // service.get(`/v10/decision-directory-root/entries?fine_auth_token=${this.token}`)
      service
        .get(`/v10/entries/all?fine_auth_token=${this.token}`)
        .then(data => {
          if (data && data.includes("<!DOCTYPE html>")) {
            this.reLogin();
          }
          if (data) {
            const result = jsonToTree(data, "id", "pId");
            const temp = result.find(item => {
              return item.id === "decision-directory-root";
            });
            this.result = temp.children;
            for (let index = 0; index < this.result.length; index++) {
              const element = this.result[index];
              // this.games.push({ text: element.text, id: element.id });
              // 目前只显示 球球大作战 目录
              if (element.text === "球球大作战") {
                this.games.push({ text: element.text, id: element.id });
                this.gameid = element.id;
                this.selectGame(element.id, true);
              }
              if (element.text === "嘿嘿语音") {
                this.games.push({ text: element.text, id: element.id });
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    // 查询首页
    getHomePage() {
      // /v10/homepages{privilegeType} 取具有特定权限的首页 权限类型 1:查看 2:授权 3:编辑
      // /v10/homepages 获取全部首页
      service
        .get(`/v10/homepages?fine_auth_token=${this.token}`)
        .then(data => {
          if (data) {
            if (data && data.length > 0) {
              const item = data[0];
              let src = "";
              // cpt，frm报表的路径不同
              if (
                item.pcHomePage.lastIndexOf(".cpt") ===
                item.pcHomePage.length - 4
              ) {
                src = `${this.baseapi}/view/report?viewlet=${encodeURIComponent(
                  item.pcHomePage
                )}`;
                // } else if (item.pcHomePage.lastIndexOf('.frm') === item.pcHomePage.length - 4) {
              } else {
                src = this.getHomePageSrc(item.pcHomePage);
              }

              // 逻辑改为 存在url地址的话，就不打开首页。
              if (this.$route.query && this.$route.query.page) {
                this.addQueryPage(
                  this.$route.query.page,
                  this.$route.query.title
                );
              } else {
                this.addTab(item.pcHomePageText, src, item.pcHomePage);
              }
              // page && this.addQueryPage(page, title);
              // this.addTab('反馈查询', '/feedbackquery', 'feedbackquery');
            } else {
              if (this.$route.query && this.$route.query.page) {
                this.addQueryPage(
                  this.$route.query.page,
                  this.$route.query.title
                );
              }
            }
          } else {
            if (this.$route.query && this.$route.query.page) {
              this.addQueryPage(
                this.$route.query.page,
                this.$route.query.title
              );
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    addQueryPage(id, title) {
      this.addTab(title || "NEWPAGE", this.getIFrameSrc(id), id);
    },
    getNotice() {
      axios
        .get(process.env.AssetsPublicPath + "static/config/notice.json")
        .then(res => {
          var result = res.data;
          if (result.notices && result.notices.length > 0) {
            for (let index = 0; index < result.notices.length; index++) {
              const element = result.notices[index];
              setTimeout(() => {
                this.$notify({
                  title: element.title,
                  message: element.content,
                  type: element.type,
                  duration: element.duration,
                  offset: 40
                });
              }, (index + 2) * 1500);
            }
          }
        });
    }
  }
};
</script>

<style lang="less">
.tab-refresh {
  padding: 10px !important;
  text-align: center !important;
  cursor: pointer;
  min-width: 80px !important;
  &:hover {
    color: lighten(#5d89fe, 10%);
  }
}
</style>

<style lang='less' scoped>
@mainfont: #5d6284;
@mainColor: #5d89fe;
@bgwhite: #f7f8ff;

.main-container {
  display: block;
  height: 100%;
  .el-container {
    height: 100%;
    .el-header {
      color: #333;
      text-align: center;
      line-height: 50px;
      height: 50px;
      width: 100%;
      background-color: #ffffff;
      padding: 5px 20px 5px 10px;
      &::after {
        float: clear;
      }
      .logo-name {
        cursor: pointer;
        float: left;
        // width: 220px;
        padding: 0 10px;
        font-weight: 600;
        font-size: 18px;
        color: @mainfont;
        text-align: left;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        .text {
          display: inline-block;
          vertical-align: middle;
        }
        .logo {
          width: 20px;
          height: 20px;
          display: inline-block;
          vertical-align: middle;
          background-image: url("../../../static/logo_g.png");
          background-size: 100% 100%;
        }
        &:hover {
          background: rgb(235, 239, 245);
        }
      }
      .modules {
        float: left;
        height: 40px;
        width: calc(100% - 460px);
        /deep/.el-scrollbar .el-scrollbar__wrap {
          height: calc(100% + 17px);
          .el-scrollbar__view {
            white-space: nowrap;
            text-align: center;
            height: 40px;
            line-height: 40px;
          }
        }
        .module {
          display: inline-block;
          position: relative;
          height: 40px;
          border: none;
          line-height: 40px;
          padding: 0 20px;
          border-radius: 0;
          margin-left: 0px;
          color: fade(@mainfont, 65%);
          cursor: pointer;
          transition: all 0.3s;
          &.active {
            color: @mainColor;
            font-size: 16px;
            font-weight: bold;
          }
          &.waiting::before {
            content: "敬请期待";
            position: absolute;
            top: -6px;
            right: -24px;
            font-size: 14px;
            color: #ffffff;
            transform: scale(0.6);
            border: 1px solid;
            border-radius: 14px;
            line-height: 1.8;
            padding: 0 4px;
            background: #d04d4d;
          }
          &.new::before {
            content: "NEW";
            position: absolute;
            top: -2px;
            right: -6px;
            font-size: 14px;
            color: #ffffff;
            transform: scale(0.6);
            border: 1px solid;
            border-radius: 14px;
            line-height: 1.5;
            padding: 0 4px;
            background: #d04d4d;
          }
          &::after {
            clear: both;
          }
        }
      }
      .right {
        float: left;
        width: 300px;
        position: relative;
        /deep/.el-select {
          float: left;
          width: 140px;
          line-height: 30px;
          margin-top: 5px;
          .el-input {
            border: 1px solid fade(@mainfont, 15%);
            border-radius: 4px;
            padding: 0;
            height: 30px;
            .el-input__inner {
              height: 28px;
              line-height: 28px;
              background-color: #ffffff;
              color: @mainfont;
              border: none;
              border-radius: 4px;
              position: absolute;
              left: 30px;
              padding-left: 0;
              top: 0;
              padding-top: 0;
              margin-top: 0;
              width: calc(100% - 32px);
            }
            .el-input__suffix {
              .el-select__caret {
                color: #333;
                line-height: 28px;
              }
            }
          }
        }
        /deep/.el-dropdown {
          float: left;
          width: 150px;
          margin-left: 10px;
          height: 40px;
          line-height: 40px;
          .el-dropdown-link {
            color: @mainfont;
          }
        }
        .gameicon {
          background-size: 100% 100%;
          height: 18px;
          width: 18px;
          position: absolute;
          left: 10px;
          top: 11px;
          border-radius: 4px;
          display: inline-block;
        }
      }
    }
    .down-container {
      height: calc(100% - 50px);
    }
    .el-aside {
      background-color: @bgwhite;
      color: #ededed;
      text-align: center;
      height: 100%;
      padding-bottom: 30px;
      &::-webkit-scrollbar {
        width: 0;
      }
      /deep/.el-scrollbar__bar.is-vertical {
        background-color: fade(#ababab, 20%);
      }
      /deep/.el-tree {
        background-color: @bgwhite;
        color: @mainfont;
        .el-tree-node__content {
          height: 40px;
          &:hover {
            color: fade(@mainColor, 80%);
            background-color: #ffffff;
          }
        }
        .el-tree-node.is-current {
          > .el-tree-node__content {
            color: @mainColor;
            background-color: #ffffff;
            font-weight: bold;
            border-left: 4px solid;
          }
        }
        .el-tree-node:focus > .el-tree-node__content {
          color: @mainColor;
          background-color: #ffffff;
        }
      }
    }

    .el-main {
      background-color: #e9eef3;
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
            background: #fff;
            border-bottom: 1px solid #e4e7ed;
            &:hover {
              color: lighten(@mainColor, 10%);
            }
            .el-icon-close {
              text-align: center;
              &::before {
                transform: scale(1);
              }
            }
            .el-button {
              height: 28px;
              line-height: 28px;
              border: none;
              padding: 0;
              &:hover,
              &:focus,
              &:active {
                background: none;
              }
              .el-icon-s-home {
                margin-right: 6px;
              }
            }
          }
          .el-tabs__item.is-active {
            border-bottom: 1px solid @mainColor;
            color: @mainColor;
            font-weight: bold;
            background-color: #fff;
          }
        }
        .el-tabs__content {
          height: calc(100% - 30px) !important;
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
        color: @mainColor;
      }
      .icon {
        // background-image: url('../../../static/gamesicon/qiuqiu.png');
        background-size: 100% 100%;
        border-radius: 4px;
        width: 18px;
        height: 18px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 2px;
      }
      .text {
        vertical-align: top;
        display: inline-block;
        line-height: 34px;
      }
    }
  }
}
.el-dropdown-menu {
  .el-dropdown-menu__item {
    &:hover {
      background-color: lighten(@mainColor, 50%);
      color: @mainColor;
    }
  }
}
</style>
