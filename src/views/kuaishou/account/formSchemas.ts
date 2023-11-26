import { ref } from 'vue';
import type { FormSchema } from '@/components/core/schema-form';

export const accountSchemas = ref<FormSchema<API.KuaishouAccountRequest>[]>([]);
