<template>
  <div class="login-container">
    <!-- 導航欄 -->
    <van-nav-bar
      class="page-nav-bar"
      title="登入"
    >
      <van-icon
        slot="left"
        name="cross"
        @click="$router.back()"
      />
    </van-nav-bar>
    <!-- /導航欄 -->

    <!-- 登入表單 -->
    <!--
      表單驗證：
        1、給 van-field 組件配置 rules 驗證規則
          參考文檔：https://youzan.github.io/vant/#/zh-CN/form#rule-shu-ju-jie-gou
        2、當表單提交的時候會自動觸發表單驗證
           如果驗證通過，會觸發 submit 事件
           如果驗證失敗，不會觸發 submit
     -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="請輸入手機號"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="請輸入驗證碼"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <!--
            time: 倒計時時間
           -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="default"
            @click="onSendSms"
          >發送驗證碼</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit">
          登入
        </van-button>
      </div>
    </van-form>
    <!-- /登入表單 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '13911111111', // 手機號
        code: '246810' // 驗證碼
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手機號不能為空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手機號格式錯誤'
        }],
        code: [{
          required: true,
          message: '驗證碼不能為空'
        }, {
          pattern: /^\d{6}$/,
          message: '驗證碼格式錯誤'
        }]
      },
      isCountDownShow: false // 是否展示倒計時
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onSubmit () {
      this.$toast.loading({
        message: '登入中...',
        forbidClick: true, 
        duration: 0 
      })

      try {
        const { data } = await login(this.user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登入成功')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手機號或驗證碼錯誤')
        } else {
          this.$toast.fail('登入失敗，請稍後重試')
        }
      }
    },

    async onSendSms () {
      try {
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('驗證失敗', err)
      }
      this.isCountDownShow = true
      try {
        await sendSms(this.user.mobile)
        this.$toast('發送成功')
      } catch (err) {
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('發送太頻繁了，請稍後重試')
        } else {
          this.$toast('發送失敗，請稍後重試')
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    width: 160px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }

  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
