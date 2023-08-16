<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="沒有更多了"
        :error.sync="error"
        error-text="請求失敗，點選重新加載"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], 
      loading: false,
      finished: false, 
      timestamp: null, 
      error: false,
      isreFreshLoading: false, 
      refreshSuccessText: '刷新成功'
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 頻道ID
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })

        const { results } = data.data
        this.list.push(...results)

        this.loading = false

        if (results.length) {
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },

    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, 
          timestamp: Date.now(), 
          with_top: 1 
        })

        const { results } = data.data
        this.list.unshift(...results)

        this.isreFreshLoading = false

        this.refreshSuccessText = `刷新成功，更新了${results.length}條數據`
      } catch (err) {
        this.refreshSuccessText = '刷新失敗'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  position: fixed;
  top: 180px;
  bottom: 100px;
  overflow-y: auto;
  right: 0;
  left: 0;
}
</style>
