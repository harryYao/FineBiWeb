<template>
  <div class="main-container">
    <el-container>
      <el-header height="40px">
        <div class="logo-name" @click="gotoHomePage">
          <span class="logo"></span>
          <span class="text">xx公司BI系统</span>
        </div>
        <div class="modules">
          <template v-if="game">
            <el-scrollbar>
              <div
                class="module"
                :class="{ active: activeId === item.id }"
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
              <span class="icon" :style="{backgroundImage: `url('./static/imgs/${getIcon(item.text)}')`}"></span>
              <span class="text">{{ item.text }}</span>
            </el-option>
          </el-select>
          <span class="gameicon" v-if="game" :style="{backgroundImage: `url('./static/imgs/${getIcon(game.text)}')`}"></span>
          <!-- <el-popover
            placement="top-start"
            width="200"
            trigger="hover">
            <div class="ercode-div">
              <div class="title" style="padding: 4px 0 6px 0;">
                <p style="font-size: 16px;"><b>智能报表APP</b></p>
                <p>V1.0.4（2020-12-16）</p>
              </div>
              <img src="../../../static/imgs/app_download.png" alt="">
            </div>
            <div slot="reference" style="cursor:default; font-weight: bold; width: 60px;float: left;margin-left: 8px; color: #fff;">
              <i class="el-icon-mobile" style="font-size: 20px;position: relative; bottom: -3px;"/>APP
            </div>
          </el-popover> -->
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
          <div class="leftbar">
            <span class="iconbtn el-icon-menu" :class="{active: leftindex == 1}" title="目录" @click="handleMenuIconClick"></span>
            <span class="iconbtn el-icon-star-on" :class="{active: leftindex == 2}" title="收藏" @click="leftindex = 2"></span>
            <el-autocomplete
              class="inline-input"
              v-model="keyword"
              size="mini"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleLiClick"
            >
              <template slot-scope="{ item }">
                <div :title="getAllPath(item.id)" class="addr">{{ item.text }}</div>
              </template>
            </el-autocomplete>
          </div>
          <div class="left_panel menu_panel" v-if="leftindex == 1">
            <el-scrollbar v-if="treeData">
              <el-tree
                ref="lefttree"
                :data="treeData"
                node-key="id"
                :current-node-key="currentnode"
                :props="defaultProps"
                @node-click="handleNodeClick"
                :accordion="false"
              ></el-tree>
            </el-scrollbar>
          </div>
          <div class="left_panel favorite_panel" v-else-if="leftindex == 2">
            <el-scrollbar>
              <p class="title">收藏列表</p>
              <ul>
                <li v-for="item in favoritelist" :key="item.id" @click="handleLiClick(item)">
                  <span :title="getAllPath(item.id)">{{ item.text }}</span>
                  <span class="el-icon-delete" title="取消收藏" @click.prevent.stop="delFavorite(item.id)"></span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
          <div class="left_panel search_panel" v-else-if="leftindex == 3">
            <el-scrollbar>
              <p class="title">搜索结果</p>
              <ul>
                <li v-for="item in searchresult.filter((f) => { return f.isParent == false && searchRange[f.id]} )" :key="item.id" :title="getAllPath(item.id)" @click="handleLiClick(item)">
                  <span :title="getAllPath(item.id)">{{ item.text }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
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
                  trigger="hover"
                  :popper-class="'tab-refresh'"
                  :open-delay="1500"
                  :disabled="editableTabsValue != item.name"
                >
                  <!-- <div class="refrash-btn" @click="refreshIframe(item)">刷新</div> -->
                  <div class="refrash-btn favorite-btn" @click="addToFavorite(item)">收藏</div>
                  <div class="tabtitle" slot="reference" >
                    <i class="refrash-i el-icon-refresh"
                      @click="refreshIframe(item)"
                    />
                    <el-button class="" :title="item.title">
                      {{ item.title }}
                    </el-button>
                  </div>
                </el-popover>
              </span>
              <div class="container" v-loading="item.loading && item.pageType !== Enums.pageType.VuePage" style="width:100%;height:100%;min-height: 400px;">
              <!-- <div class="container" style="width:100%;height:100%;"> -->
                <iframe v-if="item.pageType !== Enums.pageType.VuePage"
                  :name="`iframe_${item.name}`"
                  :id="`iframe_${item.name}`"
                  :src="item.url"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  style="min-height: 400px;"
                  @load="iframeLoaded(item)"
                ></iframe>
                <div class="vuePageContainer" v-else>
                  <keep-alive v-if="vuePages[item.name]">
                    <router-view />
                  </keep-alive>
                </div>
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
import axios from 'axios';
import { mapState } from 'vuex';
import Settings from '@/utils/settings';
import { jsonToTree2 } from '@/utils/utils';
import service from '@/service/index';

const { vuePagePaths, menu, games } = Settings;

export default {
  name: '',
  data() {
    return {
      // 用于控制reloading
      // eg 319ff229-5f85-4ad2-9b37-c502595c29cf: true, 当设为flase之后再设为true实现指定router-view 重新加载
      // add tab之后设置初始值
      vuePages: {},
      // 配置需要展示的一级目录
      menunames: menu.map(item => item.name),
      baseapi: process.env.BASE_API,
      games: [],
      gameid: '',
      game: null,
      tree: null,
      activeId: '',
      alldata: {},
      gamenodes: {},
      searchRange: {},
      treeData: null,
      defaultProps: {
        children: 'children',
        label: 'text',
      },
      currentnode: '',
      result: [],
      reports: [],
      editableTabs: [],
      editableTabsValue: 'home',
      timeList: [],
      timer: null,
      keyword: '',
      leftindex: 1,
      favoritelist: [],
      searchresult: [],
    };
  },

  created() {
    if (!this.token) {
      if (this.$route.query.page) {
        this.$router
          .replace(
            `/login?page=${this.$route.query.page}&title=${this.$route.query.title}`,
          )
          .catch((err) => {
            err;
          });
      } else {
        this.$router.replace('/login').catch((err) => {
          err;
        });
      }
    }
    this.getMenuList();
  },
  components: {
  },
  computed: {
    ...mapState(['token', 'username']),
  },
  mounted() {
    this.$nextTick(() => {
      this.getNotice();
    });
  },
  watch: {
    // 监控tab切换
    editableTabsValue(newval) {
      this.handleExpandNode(newval);
    },
  },
  methods: {
    getIcon(name) {
      return menu.find(item => item.name === name).icon;
    },
    gotoHomePage() {
      this.$router.replace('/');
      this.$router.go(0);
    },
    iframeLoaded(item) {
      item.loading = false;
      const iframeWindow = document.getElementById(`iframe_${item.name}`).contentWindow;
      const currentHref = iframeWindow.document.location.href;
      // 检测iframe页面变化，内部token失效跳转到login页面时，项目需要重新登录。
      if (currentHref.includes('.ztgame.com/webroot/decision/login?')) {
        this.reLogin();
      }
    },
    /**
     * 检测token 函数，暂时弃用
     */
    async checkToken() {
      const rst = await service.get(
        `/v10/homepages?fine_auth_token=${this.token}`,
      );
      if (rst && rst.includes('<!DOCTYPE html>')) {
        clearInterval(this.timer);
        this.$alert('请重新登录！', '登录会话已经失效', {
          confirmButtonText: '确定',
          callback: () => {
            this.logout();
          },
        });
      } else {
        // console.log('ok 没问题！');
      }
    },
    /**
     * 添加tab页面
     * @param pageType - 页面类型 frpage/vuepage
     */
    addTab(text, url, id) {
      if (id) {
        const vuePagePath = vuePagePaths[id];
        let pageType = this.Enums.pageType.FrPage;

        if (vuePagePath) {
          pageType = this.Enums.pageType.VuePage;
          this.$set(this.vuePages, id, true);
        }

        const item = this.editableTabs.find(tm => tm.name === id);
        const paths = [];
        if (!item) {
          this.findPath(id, paths);
          this.editableTabs.push({
            title: text,
            name: id,
            url,
            loading: true,
            paths,
            pageType,
          });
        }
        this.editableTabsValue = id;
        this.toPageByPageId(id, text);
      }
    },
    handleLiClick(item) {
      this.addTab(item.text, this.getIFrameSrc(item.id), item.id);
    },
    handleMenuIconClick() {
      this.leftindex = 1;
      this.$nextTick(() => {
        this.handleExpandNode(this.editableTabsValue);
      });
    },
    handleExpandNode(id) {
      if (this.leftindex === 1) {
        const item = this.editableTabs.find(tm => tm.name === id);
        if (item && item.paths && item.paths.length > 1) {
          this.expandedTreeNode(item.paths, id);
        } else if (item.name === '53cdc453-22d8-430e-a459-f703b80701ee') {
          // 由于首页的paths没有数据，所以这里自动查询是 写死路径
          this.game = this.gamenodes['98eeccaf-798d-4ec8-bd0d-9ceae09cbc61'];
          this.gameid = this.game.id;
          const cmodule = this.game.children[0];
          this.activeId = cmodule.id;
          const temp = this.game.children.find(c => c.id === cmodule.id);
          this.treeData = temp.children;
          this.$nextTick(() => {
            this.$refs.lefttree.setCurrentKey(item.name);
          });
        }
      }
    },
    /** 自动展开树节点 */
    expandedTreeNode(paths, id) {
      try {
        if (paths.length > 1) {
          const game = paths[0];
          if (game.id !== 'decision-directory-root') {
            const cmodule = paths[1];

            this.game = this.gamenodes[game.id];
            this.activeId = cmodule.id;
            const temp = this.game.children.find(c => c.id === cmodule.id);
            this.treeData = temp.children;
            this.gameid = game.id;
            this.$nextTick(() => {
              if (paths.length > 3) {
                this.$refs.lefttree.store.nodesMap[paths[paths.length - 1].pId].expanded = true;
                if (paths.length > 4) {
                  this.$refs.lefttree.store.nodesMap[paths[paths.length - 2].pId].expanded = true;
                  if (paths.length > 5) {
                    this.$refs.lefttree.store.nodesMap[paths[paths.length - 3].pId].expanded = true;
                  }
                }
              }
              this.$refs.lefttree.setCurrentKey(id);

              setTimeout(() => {
                const elem = document.querySelector('.el-tree-node.is-current');
                elem.scrollIntoViewIfNeeded();
              }, 100);
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * @description 根据pageId 路由地址切换到指定页面
     */
    toPageByPageId(pageId, title) {
      const vuePagePath = vuePagePaths[pageId];
      let url = '';
      if (vuePagePath) {
        url = `${vuePagePath}?page=${pageId}&title=${title}`;
      } else {
        url = `/?page=${pageId}&title=${title}`;
      }

      if (vuePagePath === '/paidui_feedback') {
        url += '&gid=3';
      }

      this.$router
        .replace(url)
        .catch((err) => {
          console.log(err);
        });
    },

    /**
     * tab点击事件
     */
    tabClick(e) {
      const element = e.$options.propsData;
      console.log('tabClick', element);
      this.toPageByPageId(element.name, element.label);
    },

    /** 刷新页面 */
    refreshIframe(item) {
      item.loading = true;
      if (item.pageType === this.Enums.pageType.VuePage) {
        this.testreload = false;
        this.vuePages[item.name] = false;
        setTimeout(() => {
          this.vuePages[item.name] = true;
        }, 0);
      } else {
        document
          .getElementById(`iframe_${item.name}`)
          .contentWindow.location.reload(true);
      }
    },
    /** 关闭页面 */
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
              this.toPageByPageId(activeName, nextTab.title);
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    /** 选择游戏（一级目录） */
    selectGame(p, isfirst = false) {
      this.leftindex = 1;
      this.game = this.gamenodes[this.gameid];
      const defaultGame = games.find(item => item.name === this.game.text);
      if (this.game.children && this.game.children.length > 0) {
        this.activeId = this.game.children[0].id;
        this.treeData = this.game.children[0].children;
        if (defaultGame && defaultGame.tabs) {
          const dd = defaultGame.tabs.find(item => item.name === this.game.children[0].text);
          // eslint-disable-next-line
          !isfirst && this.activeTheDefaultPage(dd.mainid);
        }
      }
    },
    /**
     * 切换一级目录或者二级目录时，自动打开配置的页面，已经打开则切换tab到该页面
     */
    activeTheDefaultPage(mainid) {
      const item = this.editableTabs.find(tm => tm.name === mainid);
      if (item) {
        this.editableTabsValue = mainid;
        this.toPageByPageId(mainid, item.title);
      } else {
        const node = this.alldata[mainid];
        this.addTab(node.text, this.getIFrameSrc(node.id), node.id);
      }
    },
    getAllNodes(node, result) {
      if (node.isParent) {
        result[node.id] = node;
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            const temp = node.children[i];
            this.getAllNodes(temp, result);
          }
        }
      } else {
        result[node.id] = node;
      }
    },
    /** 获取地址 */
    getIFrameSrc(id) {
      if (id) {
        return `${this.baseapi}/v10/entry/access/${id}?dashboardType=5`;
      }
      return '';
    },
    /** 选择模块 */
    chooseModule(item) {
      this.leftindex = 1;

      this.activeId = item.id;
      this.treeData = item.children;

      const defaultgame = games.find(g => g.name === this.game.text);
      const dd = defaultgame.tabs.find(t => t.name === item.text);
      // eslint-disable-next-line
      dd && this.activeTheDefaultPage(dd.mainid);
    },
    /** 选择节点 */
    handleNodeClick(data) {
      if (data.isParent) {
        return;
      }
      this.addTab(data.text, this.getIFrameSrc(data.id), data.id);
    },

    /** 树节点打开事件 */
    handleNodeExpand(node) {
    },

    // 登出按钮
    handleCommand(command) {
      if (command === 'logout') {
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

      // // 跨域登出
      // const url = `/logout/cross/domain?fine_auth_token=${this.token}`;
      // jsonp(url).then(data => {
      //   this.$store.commit("setToken", "");
      //   this.$router.push("/login");
      //   clearInterval(this.timer);
      // });

      this.$store.commit('setToken', '');
      this.$router.push('/login');
      clearInterval(this.timer);
    },
    reLogin() {
      this.$store.commit('setToken', '');
      if (this.$route.query && this.$route.query.page && this.$route.query.page !== 'undefined') {
        this.$router
          .replace(
            `/login?page=${this.$route.query.page}&title=${this.$route.query.title}`,
          )
          .catch((err) => {
            err;
          });
      } else {
        this.$router.replace('/login').catch((err) => {
          err;
        });
      }
    },

    /** 缓存下全部节点 key-value */
    parseAllData(data) {
      // try {
      //   let temp = JSON.parse(JSON.stringify(data));
      //   const ret = {};
      //   for (let index = 0; index < temp.length; index++) {
      //     const element = temp[index];
      //     ret[element.id] = element;
      //   }
      //   this.alldata = ret;
      // } catch (error) {
      //   console.log(error)
      // }
    },
    /** 寻找某个页面全路径 */
    // eslint-disable-next-line
    findPath(id, list) {
      const cur = this.alldata[id];
      if (cur) {
        list.unshift(cur);
        if (cur.pId && !this.menunames.includes(cur.text)) {
          this.findPath(cur.pId, list);
        } else {
          return false;
        }
      }
    },
    getAllPath(id) {
      const list = [];
      this.findPath(id, list);
      const temp = [];
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        temp.push(element.text);
      }
      return temp.join(' > ');
    },
    /** 查询全部菜单 */
    getMenuList() {
      // '/v10/{directoryId}/entries/{privilegeType}'
      // service.get(`/v10/decision-directory-root/entries?fine_auth_token=${this.token}`)
      service
        .get(`/v10/entries/all?fine_auth_token=${this.token}`)
        .then((data) => {
          if (data && data.includes('<!DOCTYPE html>')) {
            this.reLogin();
          }
          if (data) {
            const gamenodes = {};
            const allnodes = {};

            const result = jsonToTree2(data, 'id', 'pId', this.menunames, gamenodes, false);
            this.gamenodes = gamenodes;
            let firstid = '';
            // for (const key in gamenodes) {
            Object.keys(gamenodes).forEach((key) => {
              !firstid && (firstid = key);
              const element = gamenodes[key];
              this.games.push({ text: element.text, id: element.id });
              this.getAllNodes(element, allnodes);
            });
            this.alldata = allnodes;
            this.gameid = firstid;
            this.selectGame(firstid, true);

            this.result = result;
            this.getHomePage();
            this.getFavoriteList();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getMenuListById() {
      const id = '98eeccaf-798d-4ec8-bd0d-9ceae09cbc61';
      service
        .get(`/v10/${id}/entries?fine_auth_token=${this.token}`)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    /** 收藏列表 */
    getFavoriteList() {
      service
        .get(`/v10/favorite/entry/list?fine_auth_token=${this.token}`)
        .then((data) => {
          this.favoritelist = data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    /** 查询首页 */
    getHomePage() {
      // /v10/homepages{privilegeType} 取具有特定权限的首页 权限类型 1:查看 2:授权 3:编辑
      // /v10/homepages 获取全部首页
      service
        .get(`/v10/homepages?fine_auth_token=${this.token}`)
        .then((data) => {
          if (data) {
            if (data && data.length > 0) {
              const item = data[0];
              const src = this.getIFrameSrc(item.pcHomePage);
              item.id = item.pcHomePage;
              item.text = item.pcHomePageText;
              this.alldata[item.id] = item;
              // 逻辑改为 存在url地址的话，就不打开首页。
              if (this.$route.query && this.$route.query.page) {
                this.addQueryPage(this.$route.query.page, this.$route.query.title);
              } else {
                this.addTab(item.pcHomePageText, src, item.pcHomePage);
              }
            } else if (this.$route.query && this.$route.query.page) {
              this.addQueryPage(this.$route.query.page, this.$route.query.title);
            }
          } else if (this.$route.query && this.$route.query.page) {
            this.addQueryPage(this.$route.query.page, this.$route.query.title);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    /** 添加收藏 */
    addToFavorite(item) {
      // /v10/favorite/entry/{entryId}
      service
        .post(`/v10/favorite/entry/${item.name}?fine_auth_token=${this.token}`)
        .then((data) => {
          this.$message.success('收藏成功！');
          this.getFavoriteList();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    /** 添加收藏 */
    delFavorite(id) {
      // /v10/favorite/entry/{entryId}
      service
        .delete(`/v10/favorite/entry/${id}?fine_auth_token=${this.token}`)
        .then(() => {
          this.$message.success('取消成功！');
          this.getFavoriteList();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    querySearch(querystring, cb) {
      const searchRange = {};
      this.getAllNodes(this.gamenodes[this.gameid], searchRange);
      this.searchRange = searchRange;

      // this.leftindex = 3;
      if (querystring) {
        service
          .get(`/v10/entry/list?keyword=${querystring}&fine_auth_token=${this.token}`)
          .then((data) => {
            // this.searchresult = data;
            const tem = data.filter(f => f.isParent === false && searchRange[f.id]);
            cb(tem);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    handleSelect() {
      this.leftindex = 1;
    },
    /** 目录搜索结果 */
    searchMenuList() {
      const searchRange = {};
      this.getAllNodes(this.gamenodes[this.gameid], searchRange);
      this.searchRange = searchRange;

      this.leftindex = 3;
      if (this.keyword) {
        service
          .get(`/v10/entry/list?keyword=${this.keyword}&fine_auth_token=${this.token}`)
          .then((data) => {
            this.searchresult = data;
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    /** 获取通知信息 */
    getNotice() {
      axios
        .get(`${process.env.AssetsPublicPath}static/notice/notice.json?t=${new Date().getTime()}`)
        .then((res) => {
          const result = res.data;
          if (result.notices && result.notices.length > 0) {
            for (let index = 0; index < result.notices.length; index++) {
              const temp = result.notices[index];
              if ((temp.endtime && new Date() > new Date(temp.endtime)) || (temp.starttime && new Date() < new Date(temp.starttime))) {
                continue;
              }
                console.log('=>getNoticegetNoticegetNoticegetNotice');
              setTimeout(() => {
                this.$notify({
                  title: temp.title,
                  message: temp.content,
                  type: temp.type,
                  duration: temp.duration,
                  offset: 40,
                });
              }, (index + 3) * 1500);
            }
          }
        });
    },
    addQueryPage(id, title) {
      this.addTab(title || 'NEWPAGE', this.getIFrameSrc(id), id);
      this.$nextTick(() => {
        this.handleExpandNode(id);
      });
    },
  },
};
</script>

<style lang="less">

.tab-refresh {
  padding: 4px 10px !important;
  text-align: center !important;
  cursor: pointer;
  min-width: 80px !important;

  .refrash-btn {
    cursor: pointer;
    line-height: 36px;
    padding: 0 12px;
    &:hover {
      color: lighten(#47a8ea, 5%);
    }
    // &:first-child {
    //   border-bottom: 1px solid #ededed;
    // }
  }
}
</style>

<style lang='less' scoped>
@mainfont: #5d6284;
// @mainColor: #5d89fe;
@mainColor: #47a8ea;
@bgwhite: #f7f8ff;

.vuePageContainer{
  background-color: #fff;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}
.ercode-div {
  img {
    width: 176px;
    height: 176px;
  }
}

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
      background-color: @mainColor;
      padding: 0px 10px 0px 10px;
      display: flex;
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
        .text {
          display: inline-block;
          vertical-align: middle;
          color: #FFFFFF;
        }
        .logo {
          width: 20px;
          height: 20px;
          display: inline-block;
          vertical-align: middle;
          background-image: url("../../../static/imgs/logo_w.png");
          background-size: 100% 100%;
        }
        &:hover {
          background: rgb(235, 239, 245);
          .text {
            color: @mainfont;
          }
          .logo {
            background-image: url("../../../static/imgs/logo_g.png");
          }
        }
      }
      .modules {
        float: left;
        flex: 1;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        // padding: 3px 0;
        // width: calc(100% - 530px);
        /deep/.el-scrollbar .el-scrollbar__wrap {
          height: calc(100% + 17px);
          .el-scrollbar__view {
            white-space: nowrap;
            text-align: center;
            height: 34px;
            line-height: 34px;
          }
        }
        .module {
          display: inline-block;
          position: relative;
          height: 34px;
          border: none;
          line-height: 34px;
          padding: 0px 18px;
          margin: 0 2px;
          border-radius: 4px;
          margin-left: 0px;
          color: #ffffff;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          &:hover:not(.active) {
            background: #F3F3F3;
            color: lighten(@mainColor, 5%);
          }
          &.active {
            color: @mainColor;
            font-size: 16px;
            background: #ffffff;
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
        max-width: 390px;
        display: flex;
        position: relative;
        /deep/.el-select {
          float: left;
          width: 140px;
          line-height: 30px;
          height: 30px;
          margin-top: 5px;
          background-color: #FFFFFF;
          border-radius: 4px;
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
          float: right;
          margin-left: 10px;
          height: 40px;
          line-height: 40px;
          .el-dropdown-link {
            color: #FFFFFF;
            cursor: default;
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
      height: calc(100% - 40px);
    }
    .el-aside {
      background-color: @bgwhite;
      color: #ededed;
      text-align: center;
      height: 100%;
      position: relative;
      &::-webkit-scrollbar {
        width: 0;
      }
      .leftbar {
        width: 100%;
        padding: 5px;
        display: flex;
        z-index: 20;
        height: 38px;
        .iconbtn {
          padding: 2px;
          width: 28px;
          height: 28px;
          // color: #B2D4E6;
          color: lighten(@mainColor, 20%);
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s;
          &:hover {
            color: lighten(@mainColor, 10%);
          }
          &.active {
            color: @mainColor;
          }
        }
        /deep/.search-input {
          .el-input-group__append {
            padding: 0 12px;
          }
        }
      }
      .left_panel {
        height: calc(100% - 38px);

        p.title {
          color: #c3c3c3;
          text-align: left;
          padding-left: 10px;
          line-height: 30px;
          height: 30px;
        }
        /deep/.el-scrollbar {
          height: 100%;
          .el-scrollbar__wrap {
            height: calc(100% + 17px);
          }
        }
        /deep/.el-scrollbar__bar.is-vertical {
          background-color: fade(#ababab, 20%);
        }
        /deep/.el-tree {
          background-color: @bgwhite;
          color: @mainfont;
          .el-tree-node__content {
            height: 40px;
            transition: all 0.3s;
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
      .favorite_panel, .search_panel {
        ul {
          padding-left: 10px;
          li {
            padding-left: 10px;
            cursor: pointer;
            text-align: left;
            background-color: @bgwhite;
            color: @mainfont;
            height: 40px;
            line-height:40px;
            border-top: 1px solid #efefef;
            position: relative;
            transition: all 0.2s;
            &:first-child {
              border-top: none;
            }
            .el-icon-delete {
              display: none;
            }
            &:hover {
              color: fade(@mainColor, 80%);
              background-color: #ffffff;
              .el-icon-delete {
                display: block;
                position: absolute;
                right: 10px;
                top:10px;
                height: 20px;
                width: 20px;
                font-size: 14px;
                text-align: center;
                padding: 3px;
                color: #cdcdcd;
                transition: all 0.2s;
                &:hover {
                  color: @mainColor;
                }
              }
            }
          }
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
            padding: 0px;
            width: 150px;
            transition: all 0.2s;
            &:hover {
              color: lighten(@mainColor, 10%);
            }
            .el-icon-close {
              text-align: center;
              margin-left: 0px;
              line-height: 14px;
              position: absolute;
              right: 4px;
              top: 8px;
              &::before {
                transform: scale(1);
              }
            }
            .el-button {
              height: 28px;
              width: 120px;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 28px;
              font-size: 12px;
              border: none;
              padding: 0;
              outline: none;
              &:hover,
              &:focus,
              &:active {
                color: @mainColor;
                background: none;
              }
            }
          }
          .el-tabs__item.is-active {
            color: #FFF;
            font-weight: bold;
            background-color: @mainColor;
            .el-icon-refresh {
              color: #FFF;
              &:hover,
              &:focus,
              &:active {
                background-color: lighten(@mainColor, 10%);
              }
            }
            .el-button {
              color: #FFF;
              background-color: @mainColor;
            }
          }
          .el-tabs__nav-wrap {
            .el-tabs__nav-next, .el-tabs__nav-prev {
              line-height: 30px;
              font-size: 20px;
              &:hover {
                color: @mainColor;
              }
            }
          }
        }
        > .el-tabs__content {
          height: calc(100% - 30px) !important;
          min-height: 400px;
          > .el-tab-pane {
            min-height: 400px;
            height: 100%;
            background-color: #fff;
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
.tabtitle {
  outline: none;
  position: relative;
  padding: 0 10px;
  .refrash-i {
    position: absolute;
    left: 0px;
    color: #666;
    padding: 8px 5px;
    &:hover {
      color: @mainColor;
      background: #f6f6f6;
    }
  }
}
</style>
