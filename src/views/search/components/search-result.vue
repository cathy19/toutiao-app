<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="沒有更多了"
      :error.sync="error"
      error-text="加載失敗，請點選重試"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="traditionalized(article.title)"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
import { traditionalized } from '@/utils/storage'

export default {
  name: 'SearchResult',
  components: {},
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      traditionalized,
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const { data } = await getSearchResult({
          page: this.page, 
          per_page: this.perPage,
          q: this.searchText 
        })

        const { results } = data.data
        this.list.push(...results)

        this.loading = false

        if (results.length) {
          this.page++
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
