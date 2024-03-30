import request from '@/utils/request'

export function fetchALLRoleList(){
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}
