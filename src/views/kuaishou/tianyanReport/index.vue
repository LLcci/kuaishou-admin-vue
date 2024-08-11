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
      <Row style="width: 100%">
        <Col :span="8">
          <FormItem label="快手名称" name="userId">
            <Select
              v-model:value="searchForm.userId"
              :options="options"
              option-filter-prop="label"
              show-search
              allow-clear
              placeholder="请选择快手名称"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="时间范围" name="date">
            <RangePicker v-model:value="searchForm.date" format="YYYY-MM-DD" />
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
    <Spin :spinning="loading">
      <div class="bg-white dark:bg-black mb-16px !pt-24px pr-24px pb-24px pl-24px">
        <Row style="width: 100" justify="space-around" :gutter="[0, 16]">
          <Col v-for="(item, index) in tableData" :key="index" :span="22">
            <Table
              :columns="getColumns(item)"
              :data-source="item.list"
              :pagination="false"
              bordered
            >
              <template #summary>
                <TableSummaryRow>
                  <TableSummaryCell :style="{ textAlign: 'center' }" :col-span="2"
                    >合计</TableSummaryCell
                  >
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.cost
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.gmv
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.roi
                  }}</TableSummaryCell>
                </TableSummaryRow>
              </template>
            </Table>
          </Col>
        </Row>
        <Pagination
          v-model:current="searchForm.page"
          v-model:page-size="searchForm.limit"
          class="mt-24px text-right mr-24px"
          :total="searchForm.total"
          :show-total="(total) => `共 ${total} 条数据`"
          show-size-changer
          @change="onChange"
        ></Pagination>
      </div>
    </Spin>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import {
    Form,
    FormItem,
    Select,
    Row,
    Col,
    RangePicker,
    Button,
    Spin,
    Table,
    TableSummaryRow,
    TableSummaryCell,
    Pagination,
  } from 'ant-design-vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import type Dayjs from 'dayjs';
  import { list } from '@/api/kuaishou/user';
  import { tianyanPage } from '@/api/kuaishou/report';

  defineOptions({
    name: 'KuaishouReport',
  });

  const formRef = ref();

  const searchForm = reactive<{
    userId?: string;
    date?: [Dayjs.Dayjs, Dayjs.Dayjs];
    limit: number;
    page: number;
    total?: number;
  }>({
    date: [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')],
    limit: 10,
    page: 1,
  });

  const options = ref<{ value: string; label: string }[]>([]);
  list().then((res) => {
    options.value.push(
      ...res.map((item) => ({
        value: item.id,
        label: item.username,
      })),
    );
  });

  function reset() {
    formRef.value?.resetFields();
  }

  const tableData = ref<any[]>([]);
  const loading = ref(false);
  async function onFinish(values: typeof searchForm) {
    loading.value = true;
    const beginDate = values.date ? dayjs(values.date[0]).format('YYYY-MM-DD') : undefined;
    const endDate = values.date ? dayjs(values.date[1]).format('YYYY-MM-DD') : undefined;
    try {
      const res = await tianyanPage({
        userId: values.userId,
        beginDate,
        endDate,
        page: values.page,
        limit: values.limit,
      });
      tableData.value = res.list;
      searchForm.total = res.pagination.total;
    } catch (error) {
      console.log('🚀 ~ file: index.vue:186 ~ onFinish ~ error:', error);
    } finally {
      await nextTick();
      loading.value = false;
    }
  }
  // onFinish(searchForm);

  function onChange(page: number, pageSize: number) {
    searchForm.page = page;
    searchForm.limit = pageSize;
    onFinish(searchForm);
  }

  function getColumns(item: any) {
    const columns: TableColumnsType<any> = [
      {
        title: `${item.username}${item.userId}`,
        align: 'center',
        children: [
          {
            title: '日期',
            dataIndex: 'date',
            align: 'center',
          },
          {
            title: '账户ID',
            dataIndex: 'accountId',
            align: 'center',
          },
          {
            title: '花费(非全站推广)',
            dataIndex: 'cost_total_ad',
            align: 'center',
          },
          {
            title: '30日累计GMV',
            dataIndex: 't30_order_payment_amt',
            align: 'center',
          },
          {
            title: '当日累计ROI(非全站推广)',
            dataIndex: 'order_payment_roi',
            align: 'center',
          },
        ],
      },
    ];
    return columns;
  }
</script>
<style lang="less" scoped></style>
