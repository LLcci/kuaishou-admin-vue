import type { AccountPerms } from '@/core/permission/modules/kuaishou/account';
import type { ReportPerms } from '@/core/permission/modules/kuaishou/report';
import type { UserPerms } from '@/core/permission/modules/kuaishou/user';
import type { WarningPerms } from '@/core/permission/modules/kuaishou/warning';

export type kuaishouPermissionType = UserPerms | AccountPerms | ReportPerms | WarningPerms;
