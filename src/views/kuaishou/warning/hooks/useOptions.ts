import { ref } from 'vue';
import type { SelectValue } from 'ant-design-vue/es/select';
import { list as userList } from '@/api/kuaishou/user';
import { list as accountList } from '@/api/kuaishou/account';

export default function useOptions() {
  const userOptions = ref<{ value: string; label: string }[]>([]);
  userList().then((res) => {
    userOptions.value.push(
      ...res.map((item) => ({
        value: item.id,
        label: item.username,
      })),
    );
  });

  const accountOptions = ref<{ value: string; label: string }[]>([]);
  accountList().then((res) => {
    accountOptions.value = res.map((item) => ({
      value: item.id,
      label: item.accountId,
    }));
  });
  async function onUserChange(value: SelectValue) {
    accountList(value as string).then((res) => {
      accountOptions.value = res.map((item) => ({
        value: item.id,
        label: item.accountId,
      }));
    });
  }
  return {
    userOptions,
    accountOptions,
    onUserChange,
  };
}
