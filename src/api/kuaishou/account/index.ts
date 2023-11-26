import { request } from '@/utils/request';
import kuaishouAccountAPI from '@/core/permission/modules/kuaishou/account';

export function add(account: API.KuaishouAccountResult) {
  return request({
    url: kuaishouAccountAPI.add,
    method: 'post',
    data: account,
  });
}

export function page(query: API.PageParams<API.KuaishouAccountResult>) {
  return request({
    url: kuaishouAccountAPI.page,
    method: 'post',
    data: query,
  });
}

export function update(account: API.KuaishouAccountResult) {
  return request({
    url: kuaishouAccountAPI.update,
    method: 'put',
    data: account,
  });
}

export function info(id: string) {
  return request({
    url: kuaishouAccountAPI.info,
    method: 'get',
    params: { id },
  });
}

export function remove(id: string) {
  return request({
    url: kuaishouAccountAPI.delete,
    method: 'delete',
    data: { id },
  });
}
