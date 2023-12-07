declare namespace API {
  type KuaishouWarningResult = {
    id: string;
    userId: string;
    user: API.KuaishouUserResult;
    accountId: string;
    account: API.KuaishouAccountResult;
    threshold: number;
    type: number;
    enablingStatus: number;
  };

  type KuaishouWarningRequest = {
    id?: string;
    userId?: string;
    accountId?: string;
    threshold?: number;
    type?: number;
    enablingStatus?: number;
  };

  type KuaishouAccountListResult = KuaishouWarningResult[];
}
