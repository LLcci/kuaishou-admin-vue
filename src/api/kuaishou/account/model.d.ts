declare namespace API {
  type KuaishouAccountResult = {
    id?: string;
    user: API.KuaishouUserResult;
    accountId: number;
    status?: number;
  };

  type KuaishouAccountRequest = {
    userId: API.KuaishouUserResult;
    accountId: number;
    status?: number;
  };

  type KuaishouAccountListResult = KuaishouAccountResult[];
}
