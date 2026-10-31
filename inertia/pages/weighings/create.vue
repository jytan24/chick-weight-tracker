<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Form, Link } from '@adonisjs/inertia/vue'
import WeighingFields from '~/components/weighing_fields.vue'
import AppLayout from '~/layouts/app.vue'

const props = defineProps<{
  today: string
  breeds: { value: string; label: string }[]
  standards: Record<string, number[]>
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
    <Head title="Add weighing" />
    <h1 class="title">Add weighing</h1>

    <Form v-slot="{ processing, errors }" route="weighings.store">
      <WeighingFields :breeds="breeds" :standards="standards" :values="values" :errors="errors" />

      <div class="actionbar">
        <div class="actionbar__inner">
          <Link route="weighings.index" class="btn btn--secondary btn--big">Cancel</Link>
          <button type="submit" class="btn btn--primary btn--big" :disabled="processing">
            {{ processing ? 'Saving…' : 'Save weighing' }}
          </button>
        </div>
      </div>
    </Form>
  </AppLayout>
</template>
