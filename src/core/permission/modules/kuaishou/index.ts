import type { AccountPerms } from '@/core/permission/modules/kuaishou/account';
import type { ReportPerms } from '@/core/permission/modules/kuaishou/report';
import type { UserPerms } from '@/core/permission/modules/kuaishou/user';

export type kuaishouPermissionType = UserPerms | AccountPerms | ReportPerms;
