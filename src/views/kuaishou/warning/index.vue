<template>
  <div class="report">
    <Form
      ref="formRef"
      class="bg-white dark:bg-black mb-16px !pt-24px pr-24px pb-24px pl-24px"
      :model="searchForm"
      layout="inline"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      @finish="onFinish"
      @keypress.enter="onFinish"
    >
      <Row style="width: 100%" :gutter="[0, 16]">
        <Col :span="8">
          <FormItem label="快手名称" name="userId">
            <Select
              v-model:value="searchForm.userId"
              :options="userOptions"
              option-filter-prop="label"
              show-search
              allow-clear
              placeholder="请选择快手名称"
              @change="
                (value) => {
                  searchForm.accountId = undefined;
                  onUserChange(value as SelectValue);
                }
              "
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="广告账户id" name="accountId">
            <Select
              v-model:value="searchForm.accountId"
              :options="accountOptions"
              option-filter-prop="label"
              show-search
              allow-clear
              placeholder="请选择广告账户id"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="是否启用" name="enablingStatus">
            <Select
              v-model:value="searchForm.enablingStatus"
              :options="[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]"
              option-filter-prop="label"
              allow-clear
              placeholder="请选择快手名称"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Button type="primary" html-type="submit" :loading="loading">查询</Button>
            <Button style="margin-left: 10px" @click="reset">重置</Button>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="bg-white dark:bg-black mb-16px !pt-24px pr-24px pb-24px pl-24px">
      <Row :gutter="[0, 16]">
        <Col :span="24" class="text-right">
          <Button
            :icon="h(PlusOutlined)"
            type="primary"
            html-type="submit"
            :loading="loading"
            @click="modalRef.openModel()"
            >新增</Button
          >
        </Col>
        <Col :span="24">
          <Table
            :columns="columns"
            :data-source="tableData"
            :spinning="loading"
            :pagination="{
              total: searchForm.total,
              current: searchForm.page,
              pageSize: searchForm.limit,
              showTotal: (total) => `共 ${total} 条数据`,
            }"
            bordered
            @change="onChange"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'action'">
                <Button
                  v-if="record.enablingStatus == 0"
                  :loading="enableLoading"
                  type="primary"
                  @click="onEnable(record.id)"
                  >启用</Button
                >
                <Button
                  v-if="record.enablingStatus == 1"
                  :loading="enableLoading"
                  type="primary"
                  ghost
                  danger
                  @click="onDisable(record.id)"
                  >停用</Button
                >
                <Button class="ml-10px" type="primary" @click="modalRef.openModel(record.id)"
                  >编辑</Button
                >
                <Popconfirm
                  title="你确定要删除吗？"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="onDelete(record.id)"
                >
                  <Button :loading="deleteLoading" class="ml-10px" type="primary" danger
                    >删除</Button
                  >
                </Popconfirm>
              </template>
            </template>
          </Table>
        </Col>
      </Row>
    </div>
    <modal ref="modalRef" @on-ok="onFinish(searchForm)"></modal>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, nextTick, h } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { Form, FormItem, Select, Row, Col, Button, Table, Popconfirm } from 'ant-design-vue';
  import useOptions from './hooks/useOptions';
  import type { TableColumnsType } from 'ant-design-vue';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import { disable, enable, page, remove } from '@/api/kuaishou/warning';
  import modal from '@/views/kuaishou/warning/components/modal.vue';

  defineOptions({
    name: 'KuaishouWarning',
  });

  const { userOptions, accountOptions, onUserChange } = useOptions();

  const formRef = ref();

  const searchForm = reactive<{
    userId?: string;
    accountId?: string;
    enablingStatus?: number;
    limit: number;
    page: number;
    total?: number;
  }>({
    limit: 10,
    page: 1,
  });

  function reset() {
    formRef.value?.resetFields();
  }

  const tableData = ref<any[]>([]);
  const loading = ref(false);
  async function onFinish(values: typeof searchForm) {
    loading.value = true;
    const res = await page({
      userId: values.userId,
      accountId: values.accountId,
      enablingStatus: values.enablingStatus,
      page: values.page,
      limit: values.limit,
    });
    tableData.value = res.list;
    searchForm.total = res.pagination.total;
    await nextTick();
    loading.value = false;
  }
  onFinish(searchForm);

  function onChange(pag: { pageSize: number; current: number }) {
    searchForm.page = pag.current;
    searchForm.limit = pag.pageSize;
    onFinish(searchForm);
  }
  const columns = ref<TableColumnsType<any>>([
    {
      title: '快手账号',
      align: 'center',
      customRender: ({ record }) => {
        return record.user.username;
      },
    },
    {
      title: '广告账户ID',
      dataIndex: 'accountId',
      align: 'center',
      customRender: ({ record }) => {
        return record.account.accountId;
      },
    },
    {
      title: '警告阈值',
      dataIndex: 'threshold',
      align: 'center',
    },
    {
      title: '警告类型',
      dataIndex: 'type',
      align: 'center',
      customRender: ({ record }) => {
        return record.type == 1 ? '大于等于' : '小于等于';
      },
    },
    {
      title: '是否启用',
      dataIndex: 'enablingStatus',
      align: 'center',
      customRender: ({ record }) => {
        return record.enablingStatus == 1 ? '启用' : '停用';
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
    },
  ]);

  const modalRef = ref();

  const enableLoading = ref(false);
  async function onEnable(id: string) {
    enableLoading.value = true;
    try {
      await enable(id);
      await onFinish(searchForm);
    } catch (error) {
      console.log('🚀 ~ file: index.vue:242 ~ onEnable ~ error:', error);
    } finally {
      enableLoading.value = false;
    }
  }
  async function onDisable(id: string) {
    enableLoading.value = true;
    try {
      await disable(id);
      await onFinish(searchForm);
    } catch (error) {
      console.log('🚀 ~ file: index.vue:253 ~ onDisable ~ error:', error);
    } finally {
      enableLoading.value = false;
    }
  }

  const deleteLoading = ref(false);
  async function onDelete(id: string) {
    deleteLoading.value = true;
    try {
      await remove(id);
      await onFinish(searchForm);
    } catch (error) {
      console.log('🚀 ~ file: index.vue:266 ~ onDelete ~ error:', error);
    } finally {
      deleteLoading.value = false;
    }
  }
</script>
<style lang="less" scoped></style>
