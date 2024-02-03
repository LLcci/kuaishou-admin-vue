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
            <Button
              type="primary"
              style="margin-left: 10px"
              :loading="btnLoading"
              @click="exportXlsData"
              >导出</Button
            >
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
              <template #bodyCell="{ record, column }">
                <template v-if="column.dataIndex === 'balance'">
                  <Tag
                    v-if="
                      record.accountId != '全站' &&
                      record.realBudget != 0 &&
                      record.costTotal >= record.realBudget * 0.9 &&
                      record.date == dayjs().format('YYYY-MM-DD')
                    "
                    color="#f50"
                    >{{ record.balance }}</Tag
                  >
                  <div v-else>{{ record.balance }}</div>
                </template>
                <template v-if="column.dataIndex === 'remark'">
                  <div v-if="record.remark">
                    <a-tag
                      v-for="tag in record.remark.split(',')"
                      :key="tag"
                      class="mt-8px"
                      :color="tag.split(':')[0]"
                    >
                      {{ tag.split(':')[1] }}
                    </a-tag>
                  </div>
                </template>
                <template v-if="column.title === '操作'">
                  <a-button type="primary" ghost @click="handleEdit(record)">编辑备注</a-button>
                </template>
              </template>
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
                    item.total.roi == 'NaN' || item.total.roi == 'Infinity' || !item.total.roi
                      ? 0
                      : item.total.roi
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
    <a-modal
      v-model:open="remarkOpen"
      :confirm-loading="remarkLoading"
      title="备注"
      :destroy-on-close="true"
      @ok="handleRemarkOk"
    >
      <a-input-group compact>
        <a-select v-model:value="remakTag">
          <a-select-option value="pink"><a-tag color="pink">粉色</a-tag></a-select-option>
          <a-select-option value="red"><a-tag color="red">红色</a-tag></a-select-option>
          <a-select-option value="orange"><a-tag color="orange">橘色</a-tag></a-select-option>
          <a-select-option value="green"><a-tag color="green">绿色</a-tag></a-select-option>
          <a-select-option value="blue"><a-tag color="blue">蓝色</a-tag></a-select-option>
          <a-select-option value="purple"><a-tag color="purple">紫色</a-tag></a-select-option>
        </a-select>
        <a-input v-model:value="remarkValue" placeholder="请输入备注" style="width: 50%" />
        <a-button :icon="h(PlusCircleOutlined)" @click="handleRemarkAdd">添加</a-button>
      </a-input-group>
      <div class="mt">
        <span>备注：</span>
        <a-tag
          v-for="(tag, index) in remarkArr"
          :key="tag"
          :color="tag.split(':')[0]"
          closable
          @close="handleRemarkRemove(index)"
        >
          {{ tag.split(':')[1] }}
        </a-tag>
      </div>
    </a-modal>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, nextTick, h } from 'vue';
  import { PlusCircleOutlined } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';
  import * as xlsx from 'xlsx';
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
    Tag,
  } from 'ant-design-vue';
  import type { TableColumnsType } from 'ant-design-vue';
  import type Dayjs from 'dayjs';
  import { list } from '@/api/kuaishou/user';
  import { exportXls, page } from '@/api/kuaishou/report';
  import { remark } from '@/api/kuaishou/account';

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
      const res = await page({
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
              return record.roi == 'NaN' || record.roi == 'Infinity' || !record.roi
                ? '0'
                : record.roi;
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
          {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            width: 150,
          },
          {
            title: '操作',
            align: 'center',
          },
        ],
      },
    ];
    return columns;
  }

  const btnLoading = ref(false);
  async function exportXlsData() {
    btnLoading.value = true;
    const beginDate = searchForm.date ? dayjs(searchForm.date[0]).format('YYYY-MM-DD') : undefined;
    const endDate = searchForm.date ? dayjs(searchForm.date[1]).format('YYYY-MM-DD') : undefined;
    const { data, list } = await exportXls({
      userId: searchForm.userId,
      beginDate,
      endDate,
      page: searchForm.page,
      limit: searchForm.limit,
    });
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    if (!worksheet['!merges']) {
      worksheet['!merges'] = [];
    }
    let startCol = 0;
    for (const userIndex in list) {
      const length = list[userIndex].accountList.length;
      const totalCol = startCol + 2 + length;
      worksheet['!merges'].push({ s: { r: startCol, c: 0 }, e: { r: startCol, c: 7 } });
      worksheet['!merges'].push({ s: { r: totalCol, c: 0 }, e: { r: totalCol, c: 1 } });
      startCol = 2 + length + 1 + 2 + startCol;
    }
    xlsx.writeFileXLSX(
      workbook,
      `${searchForm.userId ? `${searchForm.userId}-` : ''}财务报表${
        beginDate || endDate ? `${beginDate}-${endDate}` : ''
      }.xlsx`,
    );
    btnLoading.value = false;
  }

  const remarkOpen = ref(false);

  const remarks = ref('');

  const remarkArr = ref<string[]>([]);

  const remakTag = ref('blue');

  const remarkValue = ref('');

  const reamrkId = ref('');

  const handleEdit = (record: any) => {
    console.log('🚀 ~ handleEdit ~ record:', record);
    reamrkId.value = record.accountId;
    remarkValue.value = '';
    remarks.value = record.remark;
    remakTag.value = 'blue';
    remarkArr.value.length = 0;
    if (remarks.value) {
      remarkArr.value.push(...remarks.value.split(','));
    }
    remarkOpen.value = true;
  };

  const handleRemarkAdd = () => {
    console.log('🚀 ~ remakTag:', remakTag.value);
    console.log('🚀 ~ remark:', remarkValue.value);
    remarkArr.value.push(`${remakTag.value}:${remarkValue.value}`);
    console.log('🚀 ~ handleRemarkAdd ~  remarkArr.value:', remarkArr.value);
  };

  const handleRemarkRemove = (index: number) => {
    remarkArr.value.splice(index, 1);
    console.log('🚀 ~ handleRemarkRemove ~ remarkArr.value:', remarkArr.value);
  };

  const remarkLoading = ref(false);
  const handleRemarkOk = async () => {
    try {
      remarkLoading.value = true;
      await remark(reamrkId.value, remarkArr.value.join(','));
      await onFinish(searchForm);
    } catch (error) {
    } finally {
      remarkLoading.value = false;
    }
    remarkOpen.value = false;
  };
</script>
<style lang="less" scoped></style>
