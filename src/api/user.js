import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchList(params){
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}

export function createStaff(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data: data
  })
}

export function updateStaff(id, data) {
  return request({
    url: '/user/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/update/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteStaff(id) {
  return request({
    url: '/user/delete/' + id,
    method: 'post'
  })
}

export function getRoleByStaff(id) {
  return request({
    url: '/user/role/' + id,
    method: 'get'
  })
}

export function allocRole(data) {
  return request({
    url: '/user/role/update',
    method: 'post',
    data: data
  })
}


