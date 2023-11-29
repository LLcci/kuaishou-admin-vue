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
            <RangePicker
              v-model:value="searchForm.date"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem :wrapper-col="{ span: 14, offset: 4 }">
            <Button type="primary" html-type="submit">查询</Button>
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
              :data-source="item.accountList"
              :pagination="false"
              bordered
            >
              <template #summary>
                <TableSummaryRow>
                  <TableSummaryCell :style="{ textAlign: 'center' }" :col-span="2"
                    >合计</TableSummaryCell
                  >
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.costTotal
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.t0OrderCnt
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.t30GMV
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.roi == 'NaN' ? 0 : item.total.roi
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.merchantRecoFans
                  }}</TableSummaryCell>
                  <TableSummaryCell :style="{ textAlign: 'center' }">{{
                    item.total.balance
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
  import { page } from '@/api/kuaishou/report';

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

  function disabledDate(current: Dayjs.Dayjs) {
    return dayjs() <= current.add(1, 'day');
  }

  function reset() {
    formRef.value?.resetFields();
  }

  const tableData = ref<any[]>([]);
  const loading = ref(false);
  async function onFinish(values: typeof searchForm) {
    loading.value = true;
    const beginDate = values.date ? dayjs(values.date[0]).format('YYYY-MM-DD') : undefined;
    const endDate = values.date ? dayjs(values.date[1]).format('YYYY-MM-DD') : undefined;
    const res = await page({
      userId: values.userId,
      beginDate,
      endDate,
      page: values.page,
      limit: values.limit,
    });
    tableData.value = res.list;
    console.log('🚀 ~ file: index.vue:95 ~ onFinish ~ tableData.value:', tableData.value);
    searchForm.total = res.pagination.total;
    await nextTick();
    loading.value = false;
  }
  onFinish(searchForm);

  function onChange(page: number, pageSize: number) {
    console.log(
      '🚀 ~ file: index.vue:174 ~ onChange ~ page:number, pageSize:number:',
      page,
      pageSize,
    );
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
            title: '当日账户币消耗',
            dataIndex: 'costTotal',
            align: 'center',
          },
          {
            title: '订单数',
            dataIndex: 't0OrderCnt',
            align: 'center',
          },
          {
            title: '当日GMV',
            dataIndex: 't30GMV',
            align: 'center',
          },
          {
            title: '当日roi',
            dataIndex: 'roi',
            align: 'center',
            customRender: ({ record }) => {
              return record.roi == 'NaN' ? '0' : record.roi;
            },
          },
          {
            title: '涨粉数',
            dataIndex: 'merchantRecoFans',
            align: 'center',
          },
          {
            title: '实时余额',
            dataIndex: 'balance',
            align: 'center',
          },
        ],
      },
    ];
    return columns;
  }
</script>
<style lang="less" scoped></style>
