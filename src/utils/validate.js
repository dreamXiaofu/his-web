/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} username
 * @returns {Boolean}
 */
export function validUsername(username) {
  // 用户名必须是 4 到 16 个字符
  if (username.length < 5 || username.length > 16) {
    return false;
  }
  // 用户名只能包含字母、数字、下划线和减号
  var validCharacters = /^[a-zA-Z0-9_-]+$/
  if (!validCharacters.test(username)) {
    return false;
  }
  // 用户名不能以数字开头
  if (/^\d/.test(username)) {
    return false
  }
  // 用户名校验通过
  return true
}
