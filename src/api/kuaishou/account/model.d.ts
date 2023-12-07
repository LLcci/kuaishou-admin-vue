declare namespace API {
  type KuaishouAccountResult = {
    id?: string;
    user: API.KuaishouUserResult;
    accountId: number;
    allStation: number;
    allStationType: number;
    status?: number;
    sort?: number;
  };

  type KuaishouAccountRequest = {
    userId: API.KuaishouUserResult;
    accountId: number;
    allStation: number;
    allStationType: number;
    status?: number;
    sort?: number;
  };

  type KuaishouAccountListResult = KuaishouAccountResult[];
}
