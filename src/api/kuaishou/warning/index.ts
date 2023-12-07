import { request } from '@/utils/request';
import kuaishouWarningAPI from '@/core/permission/modules/kuaishou/warning';

export function add(warning: API.KuaishouWarningResult) {
  return request({
    url: kuaishouWarningAPI.add,
    method: 'post',
    data: warning,
  });
}

export function page(query: API.PageParams<API.KuaishouWarningRequest>) {
  return request({
    url: kuaishouWarningAPI.page,
    method: 'post',
    data: query,
  });
}

export function update(warning: API.KuaishouWarningResult) {
  return request({
    url: kuaishouWarningAPI.update,
    method: 'put',
    data: warning,
  });
}

export function info(id: string) {
  return request({
    url: kuaishouWarningAPI.info,
    method: 'get',
    params: { id },
  });
}

export function remove(id: string) {
  return request({
    url: kuaishouWarningAPI.delete,
    method: 'delete',
    data: { id },
  });
}

export function enable(id: string) {
  return request({
    url: kuaishouWarningAPI.enable,
    method: 'put',
    data: { id },
  });
}

export function disable(id: string) {
  return request({
    url: kuaishouWarningAPI.disable,
    method: 'put',
    data: { id },
  });
}
