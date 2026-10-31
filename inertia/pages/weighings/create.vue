<script setup lang="ts">
import { Form, Link } from '@adonisjs/inertia/vue'
import Page from '~/components/page.vue'
import WeighingFields from '~/components/weighing_fields.vue'
import AppLayout from '~/layouts/app.vue'

const props = defineProps<{
  today: string
  breeds: { value: string; label: string }[]
}>()

const values = {
  breed: props.breeds[0]?.value ?? '',
  ageDays: '',
  weightKg: '',
  weighedOn: props.today,
  note: '',
}
</script>

<template>
  <AppLayout>
    <Page title="Add weighing">
      <Form v-slot="{ processing, errors }" route="weighings.store">
        <WeighingFields :breeds="breeds" :values="values" :errors="errors" />

        <button type="submit" class="btn btn--primary" :disabled="processing">
          {{ processing ? 'Saving…' : 'Save' }}
        </button>
        <Link route="weighings.index" class="btn btn--secondary">Cancel</Link>
      </Form>
    </Page>
  </AppLayout>
</template>
