/**
 * 評論請求模塊
 */
import request from '@/utils/request'

/**
 * 獲取文章評論列表
 */
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/v1_0/comments',
    // GET 參數使用 params 進行傳遞
    params
  })
}

/**
 * 評論點讚
 */
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/v1_0/comment/likings',
    data: {
      target
    }
  })
}

/**
 * 取消評論點讚
 */
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/comment/likings/${target}`
  })
}

/**
 * 發佈文章評論或評論回復
 */
export const addComment = data => {
  return request({
    method: 'POST',
    url: '/v1_0/comments',
    data
  })
}
