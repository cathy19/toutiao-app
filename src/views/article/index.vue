<template>
  <div class="article-container">
    <!-- 導航欄 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="好晴頭條"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /導航欄 -->

    <div class="main-wrap">
      <!-- 加載中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading
          color="#3296fa"
          vertical
        >加載中</van-loading>
      </div>
      <!-- /加載中 -->

      <!-- 加載完成-文章詳情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章標題 -->
        <h1 class="article-title">{{ traditionalized(article.title) }}</h1>
        <!-- /文章標題 -->

        <!-- 用戶信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ traditionalized(article.aut_name).slice(2) }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :user-id="article.aut_id"
          />
        </van-cell>
        <!-- /用戶信息 -->

        <!-- 文章內容 -->
        <div
          class="article-content markdown-body"
          v-html="traditionalized(article.content)"
          ref="article-content"
        ></div>
        <van-divider>正文結束</van-divider>
        <!-- 文章評論列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          @reply-click="onReplyClick"
        />
        <!-- /文章評論列表 -->
        <!-- 底部區域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
          >寫評論</van-button>
          <van-icon
            class="comment-icon"
            name="comment-o"
            :info="totalCommentCount"
          />
          <collect-article
            class="btn-item"
            v-model="article.is_collected"
            :article-id="article.art_id"
          />
          <like-article
            class="btn-item"
            v-model="article.attitude"
            :article-id="article.art_id"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部區域 -->

        <!-- PO評論 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
        >
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
        <!-- PO評論 -->
      </div>
      <!-- /加載完成-文章詳情 -->

      <!-- 加載失敗：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">該資源不存在或已刪除！</p>
      </div>
      <!-- /加載失敗：404 -->

      <!-- 加載失敗：其它未知錯誤（如網路原因或服務端異常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">內容加載失敗！</p>
        <van-button
          class="retry-btn"
          @click="loadArticle"
        >點選重試</van-button>
      </div>
      <!-- /加載失敗：其它未知錯誤（例如網路原因或服務端異常） -->
    </div>

    <van-popup
      v-model="isReplyShow"
      position="bottom"
      style="height: 100%;"
    >
      <comment-reply
        v-if="isReplyShow"
        :comment="currentComment"
        @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { traditionalized } from '@/utils/storage'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'

export default {
  name: 'ArticleIndex',
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      traditionalized,
      article: {},
      loading: true,
      errStatus: 0,
      followLoading: false,
      totalCommentCount: 0,
      isPostShow: false, 
      commentList: [], 
      isReplyShow: false,
      currentComment: {} 
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticle()
  },
  mounted () {},
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      this.loading = false
    },

    previewImage () {
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')

      // 獲取所有 img 地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)

        img.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    },

    onPostSuccess (data) {
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    },

    onReplyClick (comment) {
      this.currentComment = comment
      this.isReplyShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
