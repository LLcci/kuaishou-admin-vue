declare namespace API {
  type ReportRequest = {
    page?: number;
    limit?: number;
    userId?: string;
    beginDate?: string;
    endDate?: string;
  };
}
