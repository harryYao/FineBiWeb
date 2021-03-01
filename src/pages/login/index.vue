<template>
  <div class="login-container">
    <div class="login-box">
      <div class="left">
        <div class="left-inner">
          <div class="title">
            <span class="logo"></span>
            <span class="text">商业智能报表</span>
          </div>
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
            <input name="password" type="password" placeholder="密码" v-model="password" @keypress.enter="login">
          </div>
        </div>
        <div class="item">
          <el-checkbox v-model="keepname" class="keepname">记住用户名</el-checkbox>
        </div>
        <div class="item">
          <button class="btn-commit" @click="login">登录</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '../../service/index';

export default {
  name: '',
  data() {
    return {
      test: '登陆页面',
      username: '',
      password: '',
      token: '',
      checked: true,
      keepname: true,
    };
  },
  created() {
  },
  components: {},
  computed: {
  },
  mounted() {
    // console.log('this.$store.state.keepname', this.$store.state.keepname);
    this.keepname = this.$store.state.keepname || (this.$store.state.keepname === undefined);
    if (this.$store.state.keepname) {
      this.username = this.$store.state.username;
    }
  },
  methods: {
    check() {
      if (!this.username) {
        this.$message.error('请输入用户名!');
        return false;
      }
      if (!this.password) {
        this.$message.error('请输入密码!');
        return false;
      }
      return true;
    },
    login() {
      if (this.check()) {
        service.post('/login', {
          username: this.username,
          password: this.password,
          validity: -2,
        })
          .then((data) => {
            if (data.accessToken) {
              this.token = data.accessToken;
              this.$store.commit('setToken', data.accessToken);
              this.$store.commit('setUserName', data.username);
              this.$store.commit('setKeepName', this.keepname);
              if (this.$route.query && this.$route.query.page) {
                this.$router.replace(`/?page=${this.$route.query.page}&title=${this.$route.query.title}`);
              } else {
                this.$router.push('/');
              }
            } else if (data.errorCode) {
              if (data.errorCode === '22400002') {
                this.$message.error('用户不存在！');
              } else if (data.errorCode === '21300007') {
                this.$message.error('用户不存在或密码错误！');
              } else {
                this.$message.error(data.errorMsg);
              }
            }
          })
          .catch((error) => {
            console.error(error);
            // this.$message.error(error.errorMsg);
          });
      }
    },
  },
};
</script>

<style lang='less' scoped>
// @mainColor: #5d89fe;
@mainColor: #47a8ea;

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
      background-image: url('../../../static/imgs/login_bg.jpg');
      background-position: center;
      background-size: cover;
      .left-inner {
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        position: absolute;
        background-color: rgba(43, 46, 44, 0.7);
        .title {
          text-align: center;
          font-size: 22px;
          font-weight: 600;
          color: #FFF;
          margin-top: 175px;
          .text {
            display: inline-block;
            vertical-align: middle;
          }
          .logo {
            width: 28px;
            height: 28px;
            display: inline-block;
            vertical-align: middle;
            background-image: url('../../../static/imgs/logo_w.png');
            background-size: 100% 100%;
            transition: all 0.3s;
          }
        }
      }
    }
    .right {
      width: 270px;
      position: absolute;
      top:0;
      right: 0;
      bottom: 0;
      padding-top: 36px;
      .item {
        padding: 15px 30px;
        .input-item {
          padding: 10px 5px;
          border-bottom: 1px solid #e8eaed;
          .icon {
            font-size: 16px;
            color: @mainColor;
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
        /deep/.el-checkbox.is-checked {
          .el-checkbox__input.is-checked,.el-checkbox__input.is-focus {
            .el-checkbox__inner {
              background-color: @mainColor;
              border-color: @mainColor;
            }
          }
        }
        /deep/.el-checkbox .el-checkbox__input.is-focus .el-checkbox__inner {
          border-color: @mainColor;
        }
        /deep/.el-checkbox.is-checked {
          .el-checkbox__label {
            color: @mainColor;
          }
        }
        /deep/.el-checkbox__inner:hover {
          border-color: @mainColor;
        }
        .keepname {
          margin-bottom: 10px;
        }
        .spbtn {
          border: none;
          background: none;
          outline: none;
          color: #999;
          &.active {
            color: @mainColor;
          }
        }
        .btn-commit {
          margin-top: 10px;
          cursor: pointer;
          width: 100%;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          background-color: @mainColor;
          text-align: center;
          color: #FFF;
          transition: all 0.3s;
          outline: none;
          &:hover {
            background-color: lighten(@mainColor, 10%);
          }
        }
      }
    }
  }
}
</style>
