<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    size="small"
    :loading="loading"
    @click="onFollow"
  >已關注</van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
  >關注</van-button>
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'

export default {
  name: 'FollowUser',
  components: {},
  // 自定義 v-model 的數據名稱
  model: {
    prop: 'isFollowed', // 預設是 value
    event: 'update-is_followed' // 預設是 input
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onFollow () {
      this.loading = true 
      try {
        if (this.isFollowed) {
          // 取消關注
          await deleteFollow(this.userId)
          // this.article.is_followed = false
        } else {
          //添加關注
          await addFollow(this.userId)
          // this.article.is_followed = true
        }

        this.$emit('update-is_followed', !this.isFollowed)
      } catch (err) {
        console.log(err)
        let message = '操作失敗，請重試！'
        if (err.response && err.response.status === 400) {
          message = '你不能關注你自己！'
        }
        this.$toast(message)
      }
      this.loading = false 
    }
  }
}
</script>

<style scoped lang="less"></style>
