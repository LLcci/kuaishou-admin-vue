import { request } from '@/utils/request';
import kuaishouUserAPI from '@/core/permission/modules/kuaishou/user';

export function add(user: API.KuaishouUserResult) {
  return request({
    url: kuaishouUserAPI.add,
    method: 'post',
    data: user,
  });
}

export function page(query: API.PageParams<API.KuaishouUserResult>) {
  return request({
    url: kuaishouUserAPI.page,
    method: 'post',
    data: query,
  });
}

export function update(user: API.KuaishouUserResult) {
  return request({
    url: kuaishouUserAPI.update,
    method: 'put',
    data: user,
  });
}

export function info(id: string) {
  return request({
    url: kuaishouUserAPI.info,
    method: 'get',
    params: { id },
  });
}

export function remove(id: string) {
  return request({
    url: kuaishouUserAPI.delete,
    method: 'delete',
    data: { id },
  });
}

export function list() {
  return request({
    url: kuaishouUserAPI.list,
    method: 'get',
  });
}
