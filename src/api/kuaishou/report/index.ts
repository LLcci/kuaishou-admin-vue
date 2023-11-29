import { request } from '@/utils/request';
import kuaishouReportAPI from '@/core/permission/modules/kuaishou/report';

export function page(query: API.ReportRequest) {
  return request({
    url: kuaishouReportAPI.page,
    method: 'post',
    data: query,
  });
}
