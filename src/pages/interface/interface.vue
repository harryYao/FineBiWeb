<template>
  <div class="interface-container">
    <header>
      <router-link to="/">back</router-link><h3>{{ test }}  <a href="https://yapi.fanruan.com/api/public/plugin/documents">基于文档</a></h3> 
    </header>
    <div class="token"><b>Token:</b> {{ token }}</div>
    <div>
    <button class="login" @click="Login">Login</button></div>
    <div>URL: <input class="url" type="text" v-model="path"></div>
    <p>请求参数</p>
    <textarea class="request-params" name="" id="" cols="200" rows="10" v-model="params"></textarea>
    <button class="sendbtn" @click="sendget">发送请求(GET)</button> <button class="sendbtn" @click="sendpost">发送请求(POST)</button>
    <p>返回数据</p>
    <div>
      <div class="tabs">
        <span @click="tabindex = 0">JSON</span>
        <span @click="tabindex = 1">TEXT</span>
      </div>
      <json-view theme="vs-code" :data="res" v-if="tabindex === 0"/>
      <textarea class="res-body" v-if="tabindex === 1" name="" id="" cols="200" rows="20" v-model="res_str" readonly></textarea>
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
      test: '手动填写API测试页面',
      username: 'admin',
      password: 'admin',
      token: '',
      path: '',
      params: '',
      res: {},
      res_str: '',
      tabindex: 0
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
  methods: {
    sendget() {
      service.get(this.path + `?fine_auth_token=${this.token}`, this.params)
        .then((data) => {
          console.log(data);
          this.res = data;
          this.res_str = JSON.stringify(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    sendpost() {
      console.log(this.params)
      const p = JSON.parse(this.params);
      console.log(p)
      service.post(this.path + `?fine_auth_token=${this.token}`, p)
        .then((data) => {
          console.log(data);
          this.res = data;
          this.res_str = JSON.stringify(data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    Login() {
      service.post('/login', {
          username: 'admin',
          password: 'admin',
          validity: -2
        })
        .then((data) => {
          console.log(data);
          this.token = data.data.accessToken;
          // service.defaults.headers.common["fine_auth_token"] = this.token;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
}
</script>

<style lang='less' scoped>
.interface-container {
  display: block;
  padding: 30px;
  .token {
    margin-top: 20px;
  }
  .login {
    padding: 10px;
    margin: 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  .url {
    width: 600px;
    background: #d5e7f0;
    border: 1px solid #88a6c4;
    height: 30px;
    line-height: 30px;
  }
  .request-params {
    background: #d5e7f0;
    border: 1px solid #88a6c4;
    margin: 10px;
    display: block;
  }
  .sendbtn {
    width: 180px;
    height: 40px;
    line-height: 38px;
    background: #c4d2ee;
    border: 1px solid #142f68;
    font-weight: bold;
    font-size: 14px;
    text-align: center;
    margin: 10px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background: #dae1f1;
    }
  }
  .res-body {
    background: #f0e5d5;
    border: 1px solid #c3c488;
    margin: 10px;
    display: block;
  }
}
</style>
