declare namespace API {
  /** 用户信息结果 */
  type KuaishouUserResult = {
    id?: string;
    kuaishouId: number;
    username: string;
    cookies: string;
    tianyanCookies: string;
    status?: number;
  };

  type CreateKuaishouUserRequest = {
    kuaishouId: number;
    username: string;
    cookies: string;
    tianyanCookies: string;
  };

  type UpdateKuaishouUserRequest = {
    kuaishouId: number;
    username: string;
    cookies: string;
    tianyanCookies: string;
    status: number;
  };
  /** 用户信息列表 */
  type KuaishouUserListResult = KuaishouUserResult[];
}
