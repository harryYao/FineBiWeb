<template>
  <div class="login-container">
    <div class="login-box">
      <div class="left">
        <div class="left-inner">
          <div class="logo"></div>
          <div class="title">巨人商业智能</div>
        </div>
      </div>
      <div class="right">
        <div class="item">
          <div class="input-item">
            <i class="icon el-icon-user"></i>
            <input name="username" type="text" placeholder="用户名" v-model="username">
          </div>
          
        </div>
        <div class="item">
          <div class="input-item">
            <i class="icon el-icon-lock"></i>
            <input name="password" type="password" placeholder="密码" v-model="password">
          </div>
        </div>
        <div class="item">
          <button class="btn-commit" @click="login">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../../service/index'
export default {
  name: '',
  data () {
    return {
      test: '登陆页面',
      username: '',
      password: '',
      token: ''
    };
  },
  created() {
  },
  components: {},
  computed: {
  },
  mounted () {
  },
  methods: {
    check() {
      if (!this.username) {
        this.$message.error('请输入用户名!')
        return false;
      }
      if (!this.password) {
        this.$message.error('请输入密码!')
        return false;
      }
      return true;
    },
    login() {
      if (this.check()) {
        service.post('/login', {
          username: this.username,
          password: this.password,
          validity: -2
        })
        .then((data) => {
          console.info(data);
          if (data.accessToken) {
            this.token = data.accessToken;
            this.$store.commit('setToken', data.accessToken);
            this.$store.commit('setUserName', data.username);
            this.$router.push('/')
          } else if(data.errorCode){
            // if (data.errorCode === '22400002') {
            //   this.$message.error('用户不存在！')
            // } else if (data.errorCode === '21300007') {
            //   this.$message.error('用户密码错误！')
            // } else {
            //   this.$message.error(data.errorMsg)
            // }
          }
        })
        .catch((error) => {
          console.log(error);
          // this.$message.error(error.errorMsg)
        });
      }
    }
  }
}
</script>

<style lang='less' scoped>
.login-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 720px;
    min-width: 720px;
    height: 380px;
    box-shadow: 0 10px 30px 0 rgba(0,63,163,.2);
    position: relative;
    .left {
      width: 450px;
      position: absolute;
      left: 0;
      right: 270px;
      top: 0;
      bottom: 0;
      background-image: url('/static/qqimg.jpg');
      background-position: center;
      background-size: cover; 
      .left-inner {
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        position: absolute;
        background-color: rgba(0,84,230,.7);
        .logo {
          margin: 140px auto 30px;
          height: 30px;
          width: 100%;
        }
        .title {
          text-align: center;
          font-size: 20px;
          color: #FFF;
        }
      }
    }
    .right {
      width: 270px;
      position: absolute;
      top:0;
      right: 0;
      bottom: 0;
      padding-top: 40px;
      .item {
        margin: 30px;
        .input-item {
          padding: 10px 5px;
          border-bottom: 1px solid #e8eaed;
          .icon {
            font-size: 16px;
            color: #3685F2;
          }
          input {
            margin-left: 10px;
            outline: none;
            &::-webkit-input-placeholder {
              color: rgb(204, 204, 204) !important;
            }
            &::placeholder {
              color: rgb(204, 204, 204) !important;
            }
            &:-webkit-autofill,
            &:-webkit-autofill:focus {
              box-shadow: 0 0 0 30px white inset !important;
              -webkit-text-fill-color: #000000 !important;
              background: transparent !important;
              background-image: none;
              border: none;
              // transition: background-color 10000s ease-in-out 0s;
            }
          }
        }
        .btn-commit {
          margin-top: 40px;
          cursor: pointer;
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          background-color: rgb(54, 133, 242);
          text-align: center;
          color: #FFF;
          transition: all 0.3s;
          outline: none;
          &:hover {
            background-color: rgba(54, 133, 242, 0.9);
          }
        }
      }
    }
  }
}
</style>
