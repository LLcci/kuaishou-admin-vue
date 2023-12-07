<template>
  <div>
    <DynamicTable :search="true" :data-request="page" :columns="columns">
      <template #toolbar>
        <a-button
          type="primary"
          :disabled="!$auth('kuaishou.account.add')"
          @click="openUserModal({})"
        >
          <PlusOutlined /> 新增
        </a-button>
      </template>
    </DynamicTable>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { accountSchemas } from './formSchemas';
  import { useTable, type TableColumn } from '@/components/core/dynamic-table';
  import { page, add, update, info, remove } from '@/api/kuaishou/account/index';
  import { useFormModal } from '@/hooks/useModal';
  import { list } from '@/api/kuaishou/user';

  defineOptions({
    name: 'KuaishouAccount',
  });

  const [DynamicTable, dynamicTableInstance] = useTable({ formProps: { autoSubmitOnEnter: true } });
  const [showModal] = useFormModal();

  type TableListItem = API.KuaishouAccountResult;

  const columns = ref<TableColumn<TableListItem>[]>([]);

  list().then((res) => {
    columns.value = [
      {
        title: '#',
        dataIndex: 'id',
        width: 80,
        align: 'center',
        hideInSearch: true,
        hideInTable: true,
      },
      {
        title: '快手名称',
        dataIndex: 'userId',
        width: 200,
        align: 'center',
        formItemProps: {
          component: 'Select',
          componentProps: {
            showSearch: true,
            optionFilterProp: 'label',
            options: res.map((item) => ({
              value: item.id,
              label: item.username,
            })),
          },
        },
        customRender: ({ record }) => {
          return record.user?.username;
        },
      },
      {
        title: '广告账户id',
        dataIndex: 'accountId',
        width: 200,
        align: 'center',
      },
      {
        title: '全站数据',
        dataIndex: 'allStation',
        align: 'center',
        width: 200,
        formItemProps: {
          component: 'Select',
          componentProps: {
            options: [
              { value: 1, label: '显示' },
              { value: 0, label: '隐藏' },
            ],
          },
        },
        customRender: ({ record }) => {
          if (record.allStation == 1) {
            return '显示';
          } else {
            return '隐藏';
          }
        },
      },
      {
        title: '全站数据类型',
        dataIndex: 'allStationType',
        align: 'center',
        width: 200,
        formItemProps: {
          component: 'Select',
          componentProps: {
            options: [
              { value: 1, label: '显示' },
              { value: 0, label: '隐藏' },
            ],
          },
        },
        customRender: ({ record }) => {
          if (record.allStation == 0) {
            return '';
          } else {
            if (record.allStationType == 0) {
              return '全站直播推广';
            } else {
              return '全站直播推广(智投版)';
            }
          }
        },
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
        title: '排序',
        dataIndex: 'sort',
        align: 'center',
        width: 200,
        hideInSearch: true,
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
    accountSchemas.value = [
      {
        field: 'userId',
        component: 'Select',
        label: '快手账户',
        componentProps: {
          showSearch: true,
          optionFilterProp: 'label',
          options: res.map((item) => ({
            value: item.id,
            label: item.username,
          })),
        },
        rules: [{ required: true, type: 'string' }],
      },
      {
        field: 'accountId',
        component: 'Input',
        label: '广告账户id',
        rules: [{ required: true, type: 'string' }],
      },
      {
        field: 'allStation',
        component: 'Select',
        defaultValue: 0,
        componentProps: {
          options: [
            { value: 1, label: '显示' },
            { value: 0, label: '隐藏' },
          ],
        },
        label: '全站数据',
        rules: [{ required: true, type: 'number' }],
      },
      {
        field: 'allStationType',
        component: 'Select',
        defaultValue: 0,
        vIf: (formData) => formData.formInstance.getFieldsValue().allStation == 1,
        componentProps: {
          options: [
            { value: 1, label: '全站直播推广(智投版)' },
            { value: 0, label: '全站直播推广' },
          ],
        },
        label: '全站数据类型',
        rules: [{ required: true, type: 'number' }],
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
      {
        field: 'sort',
        component: 'InputNumber',
        defaultValue: 0,
        label: '排序',
        rules: [{ required: true, type: 'number' }],
      },
    ];
  });

  /**
   * @description 打开用户弹窗
   */
  const openUserModal = async (record: Partial<TableListItem> = {}) => {
    //@ts-ignore
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
        schemas: accountSchemas.value,
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
