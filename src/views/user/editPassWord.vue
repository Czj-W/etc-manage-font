<template>
  <div class="login-main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
      v-if="!isSuccess"
    >
      <a-tabs
        :activeKey="customActiveKey"
        :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
        @change="handleTabClick"
      >
        <a-tab-pane key="tab1" tab="重置密码">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="输入已注册的邮箱"
              v-decorator="[
                'email',
                {
                  rules: [{ required: true, message: '请输入已注册的邮箱' }, { validator: handleUsernameOrEmail }],
                  validateTrigger: 'change'
                }
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <div class="codeFlex">
              <a-input
                class="input"
                type="text"
                autocomplete="false"
                placeholder="验证码"
                v-decorator="[
                  'verify_code',
                  { rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur' }
                ]"
              >
                <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
              <a-button type="primary" class="btn" :disabled="isSend" @click="sendCode">
                {{ isSend ? `(${countdown})重新获取` : '获取邮箱验证码' }}
              </a-button>
            </div>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="输入新密码"
              v-decorator="[
                'password',
                { rules: [{ required: true, message: '请输入新密码' }], validateTrigger: 'blur' }
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              size="large"
              type="password"
              autocomplete="false"
              placeholder="确认密码"
              v-decorator="[
                'password_confirm',
                { rules: [{ required: true, message: '请输入确认密码' }], validateTrigger: 'blur' }
              ]"
            >
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
        </a-tab-pane>
      </a-tabs>

      <a-form-item>
        <router-link :to="{ name: 'login' }" class="forge-password" style="float: right">密码登录</router-link>
        <a-form-item style="margin-top: 24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="state.loginBtn"
            :disabled="state.loginBtn"
          >提 交</a-button
          >
        </a-form-item>
      </a-form-item>
    </a-form>
    <div v-else>
      <a-tabs :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }">
        <a-tab-pane tab="密码已重置"></a-tab-pane>
      </a-tabs>
      <div class="txt">账号{{ email }}的密码设置成功</div>
      <div class="txt">请点击下方按钮进行登录</div>
      <a-button size="large" type="primary" class="sc-btn" @click="jump">立 即 登 录</a-button>
    </div>
  </div>
</template>

<script>
// mport md5 from 'md5'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { setEditPW, getCode } from '@/api/login'

export default {
  components: {
    TwoStepCaptcha
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      isSend: false,
      isSuccess: false,
      countdown: 60,
      timeClock: '',
      email: ''
    }
  },
  created() {},
  destroyed() {
    if (this.timeClock !== '') {
      clearInterval(this.timeClock)
      this.isSend = false
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'SwitchMeshNo']),
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    jump() {
      this.$router.push({ path: '/login' })
    },
    setTime() {
      let countdown = 60
      let that = this
      this.timeClock = setInterval(function() {
        that.countdown = countdown--
        if (countdown === 0) {
          clearInterval(that.timeClock)
          that.isSend = false
        }
      }, 1000)
    },
    sendCode() {
      const {
        form: { validateFields }
      } = this
      validateFields(['email'], { force: true }, (err, values) => {
        if (!err) {
          this.isSend = true
          this.setTime()
          console.log('login form', values)
          getCode({ email: values.email })
            .then(res => {
              if (res.meta.resultCode === 0) {
                this.$message.info(res.meta.result)
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    filterPassWord(val) {
      let isTrue = false
      let reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/)
      if (reg.test(val)) isTrue = true
      return isTrue
    },
    checkPassWord(val) {
      let patrn = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (patrn.test(val)) {
        return true
      } else {
        return false
      }
    },
    filterKongPassWord(val) {
      let isTrue = true
      if (val.indexOf(' ') >= 0) isTrue = false
      return isTrue
    },
    handleSubmit(e) {
      e.preventDefault()
      const {
        form: { validateFields }
      } = this
      validateFields(['email', 'verify_code', 'password', 'password_confirm'], { force: true }, (err, values) => {
        console.log(err, values)
        if (!err) {
          if (
            !this.filterPassWord(values.password) ||
            !this.filterKongPassWord(values.password) ||
            values.password.length < 8 ||
            values.password.length > 12
          ) {
            this.$message.error('密码应为大于等于8位小于等于12位，并由数字和字母组成')
            return false
          }
          if (this.checkPassWord(values.password)) {
            this.$message.error('密码不能包含特殊字符串')
            return false
          }
          if (values.password !== values.password_confirm) {
            this.$message.error('密码不一致，请重新输入')
            return false
          }
          setEditPW(values)
            .then(res => {
              if (res.meta.resultCode === 0) {
                this.$message.success(res.meta.result)
                this.email = values.email
                this.isSuccess = true
                if (this.timeClock !== '') {
                  clearInterval(this.timeClock)
                  this.isSend = false
                }
              }
              console.log(res, 132)
            })
            .catch(err => {
              console.log(err, 'err')
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.codeFlex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .input {
    width: 60%;
    height: 40px;
  }
  .btn {
    height: 40px;
  }
}
.login-main {
  min-width: 260px;
  width: 568px;
  margin: 0 auto;
  background-color: white;
  padding: 100px;
  .txt {
    width: 100%;
    text-align: center;
    font-size: 16px;
    margin-bottom: 20px;
  }
  .sc-btn {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
