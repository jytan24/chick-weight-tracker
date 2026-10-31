<script setup lang="ts">
import type { Data } from '@generated/data'
import { Form, Link } from '@adonisjs/inertia/vue'
import Page from '~/components/page.vue'
import WeighingFields from '~/components/weighing_fields.vue'
import AppLayout from '~/layouts/app.vue'

const props = defineProps<{
  weighing: Data.Weighing
  breeds: { value: string; label: string }[]
}>()

const values = {
  breed: props.weighing.breed,
  ageDays: String(props.weighing.ageDays),
  weightKg: String(props.weighing.weightGrams / 1000),
  weighedOn: props.weighing.weighedOn,
  note: props.weighing.note ?? '',
}

const confirmDelete = () => window.confirm('Delete this weighing?')
</script>

<template>
  <AppLayout>
    <Page title="Edit weighing">
      <Form v-slot="{ processing, errors }" route="weighings.update" :params="{ id: weighing.id }">
        <WeighingFields :breeds="breeds" :values="values" :errors="errors" />

        <button type="submit" class="btn btn--primary" :disabled="processing">
          {{ processing ? 'Saving…' : 'Save changes' }}
        </button>
        <Link route="weighings.index" class="btn btn--secondary">Cancel</Link>
      </Form>

      <Form route="weighings.destroy" :params="{ id: weighing.id }" :on-before="confirmDelete">
        <button type="submit" class="btn btn--secondary">Delete</button>
      </Form>
    </Page>
  </AppLayout>
</template>
