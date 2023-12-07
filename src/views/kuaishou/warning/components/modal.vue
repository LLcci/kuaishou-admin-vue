<template>
  <div>
    <Modal
      :style="{ width: '700px' }"
      :title="modalTitle"
      :open="modalShow"
      :confirm-loading="confirmLoading"
      @cancel="() => (modalShow = false)"
      @ok="handleOk"
    >
      <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
        <FormItem label="快手名称" v-bind="validateInfos.userId" required>
          <Select
            v-model:value="form.userId"
            :options="userOptions"
            option-filter-prop="label"
            show-search
            allow-clear
            placeholder="请选择快手名称"
            @change="
              (value) => {
                form.accountId = undefined;
                onUserChange(value as SelectValue);
              }
            "
          />
        </FormItem>
        <FormItem label="广告账户id" v-bind="validateInfos.accountId" required>
          <Select
            v-model:value="form.accountId"
            :options="accountOptions"
            option-filter-prop="label"
            show-search
            allow-clear
            placeholder="请选择广告账户id"
          />
        </FormItem>
        <FormItem label="预警阈值" v-bind="validateInfos.threshold" required>
          <InputNumber v-model:value="form.threshold" placeholder="请输入预警阈值" />
        </FormItem>
        <FormItem label="预警方式" v-bind="validateInfos.type" required>
          <Select
            v-model:value="form.type"
            :options="[
              { label: '小于等于', value: 0 },
              { label: '大于等于', value: 1 },
            ]"
            option-filter-prop="label"
            show-search
            allow-clear
            placeholder="请选择预警方式"
          />
        </FormItem>
        <FormItem label="是否启用" v-bind="validateInfos.enablingStatus" required>
          <Select
            v-model:value="form.enablingStatus"
            :options="[
              { label: '停用', value: 0 },
              { label: '启用', value: 1 },
            ]"
            option-filter-prop="label"
            show-search
            allow-clear
            placeholder="请选择预警方式"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { Modal, Form, FormItem, Select, InputNumber } from 'ant-design-vue';
  import type { SelectValue } from 'ant-design-vue/es/select';
  import type { Rule } from 'ant-design-vue/es/form';
  import useOptions from '@/views/kuaishou/warning/hooks/useOptions';
  import { add, info, update } from '@/api/kuaishou/warning';

  defineOptions({
    name: '',
  });
  defineExpose({ openModel });
  const emits = defineEmits(['on-ok']);

  const { userOptions, accountOptions, onUserChange } = useOptions();

  const useForm = Form.useForm;
  const form = reactive<API.KuaishouWarningRequest>({
    id: undefined,
    userId: undefined,
    accountId: undefined,
    threshold: undefined,
    type: 0,
    enablingStatus: 1,
  });
  const rules = reactive<Record<keyof API.KuaishouWarningRequest, Rule[]>>({
    id: [{ required: false }],
    userId: [{ required: true, message: '请选择快手名称' }],
    accountId: [{ required: true, message: '请选择广告账户id' }],
    threshold: [{ required: true, message: '请输入预警阈值' }],
    type: [{ required: true, message: '请选择预警类型' }],
    enablingStatus: [{ required: true, message: '请选择启用状态' }],
  });
  const { validate, validateInfos, resetFields } = useForm(form, rules);

  const modalShow = ref(false);
  const modalTitle = ref('新增');
  async function openModel(id?: string) {
    modalShow.value = true;
    resetFields();
    if (id) {
      modalTitle.value = '修改';
      const res = await info(id);
      form.id = res.id;
      form.userId = res.userId;
      form.accountId = res.accountId;
      form.threshold = res.threshold;
      form.type = res.type;
      form.enablingStatus = res.enablingStatus;
    }
  }

  const confirmLoading = ref(false);
  async function handleOk() {
    const res = await validate();
    confirmLoading.value = true;
    try {
      if (res.id) {
        await update(res);
      } else {
        await add(res);
      }
      emits('on-ok');
      modalShow.value = false;
      confirmLoading.value = false;
    } catch (error) {
      console.log('🚀 ~ file: modal.vue:135 ~ handleOk ~ error:', error);
      confirmLoading.value = false;
    }
  }
</script>

<style lang="less" scoped></style>
