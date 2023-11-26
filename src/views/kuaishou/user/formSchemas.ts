import type { FormSchema } from '@/components/core/schema-form';

export const userSchemas: FormSchema<API.UpdateKuaishouUserRequest>[] = [
  {
    field: 'kuaishouId',
    component: 'Input',
    label: '快手id',
    rules: [{ required: true, type: 'string' }],
  },
  {
    field: 'username',
    component: 'Input',
    label: '用户名',
    rules: [{ required: true, type: 'string' }],
  },
  {
    field: 'cookies',
    component: 'InputTextArea',
    label: 'cookies',
    rules: [{ required: true, type: 'string' }],
  },
  {
    field: 'status',
    component: 'Select',
    defaultValue: 1,
    componentProps: {
      options: [
        { value: 1, label: '有效' },
        { value: 0, label: '无效' },
      ],
    },
    label: '是否有效',
    rules: [{ required: true, type: 'number' }],
  },
];
