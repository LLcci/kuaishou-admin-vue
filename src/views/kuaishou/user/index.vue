<template>
  <div>
    <DynamicTable :search="true" :data-request="page" :columns="columns">
      <template #toolbar>
        <a-button type="primary" :disabled="!$auth('kuaishou.user.add')" @click="openUserModal({})">
          <PlusOutlined /> 新增
        </a-button>
      </template>
    </DynamicTable>
  </div>
</template>
<script setup lang="ts">
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { userSchemas } from './formSchemas';
  import { useTable, type TableColumn } from '@/components/core/dynamic-table';
  import { page, add, update, info, remove } from '@/api/kuaishou/user/index';
  import { useFormModal } from '@/hooks/useModal';

  defineOptions({
    name: 'KuaishouUser',
  });

  const [DynamicTable, dynamicTableInstance] = useTable({ formProps: { autoSubmitOnEnter: true } });
  const [showModal] = useFormModal();

  type TableListItem = API.KuaishouUserResult;

  const columns: TableColumn<TableListItem>[] = [
    {
      title: '#',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '快手id',
      dataIndex: 'kuaishouId',
      width: 200,
      align: 'center',
    },
    {
      title: '快手名称',
      dataIndex: 'username',
      width: 200,
      align: 'center',
    },
    {
      title: 'cookies',
      dataIndex: 'cookies',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '是否有效',
      dataIndex: 'status',
      align: 'center',
      width: 200,
      formItemProps: {
        component: 'Select',
        componentProps: {
          options: [
            { value: 1, label: '有效' },
            { value: 0, label: '无效' },
          ],
        },
      },
      customRender: ({ record }) => {
        if (record.status == 1) {
          return '有效';
        } else {
          return '无效';
        }
      },
    },
    {
      title: '操作',
      width: 230,
      dataIndex: 'ACTION',
      align: 'center',
      fixed: 'right',
      actions: ({ record }) => [
        {
          label: '编辑',
          auth: {
            perm: 'kuaishou.user.update',
            effect: 'disable',
          },
          onClick: () => openUserModal(record),
        },
        {
          label: '删除',
          auth: 'sys.user.delete',
          popConfirm: {
            title: '你确定要删除吗？',
            onConfirm: async () => {
              await remove(record.id as string);
              dynamicTableInstance?.reload();
            },
          },
        },
      ],
    },
  ];

  /**
   * @description 打开用户弹窗
   */
  const openUserModal = async (record: Partial<TableListItem> = {}) => {
    const [formRef] = await showModal<any>({
      modalProps: {
        title: `${record.id ? '编辑' : '新增'}用户`,
        width: 700,
        onFinish: async (values) => {
          values.id = record.id;
          await (record.id ? update : add)(values);
          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: userSchemas,
        autoSubmitOnEnter: true,
      },
    });

    formRef?.setFieldsValue(record);
    if (record?.id) {
      const { roles } = await info(record.id);
      formRef?.setFieldsValue({ roles });
    }
  };
</script>
<style lang="scss" scoped></style>
