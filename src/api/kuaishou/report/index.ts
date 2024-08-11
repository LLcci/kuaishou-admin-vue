import { request } from '@/utils/request';
import kuaishouReportAPI from '@/core/permission/modules/kuaishou/report';

export function page(query: API.ReportRequest) {
  return request({
    url: kuaishouReportAPI.page,
    method: 'post',
    data: query,
  });
}

export function exportXls(query: API.ReportRequest) {
  return request({
    url: kuaishouReportAPI.export,
    method: 'get',
    params: query,
  });
}

export function tianyanPage(query: API.ReportRequest) {
  return request({
    url: kuaishouReportAPI.tianyanPage,
    method: 'post',
    data: query,
  });
}
