<script setup lang="ts">
import type { Data } from '@generated/data'
import { Head } from '@inertiajs/vue3'
import { Form, Link } from '@adonisjs/inertia/vue'
import { Trash2 } from 'lucide-vue-next'
import WeighingFields from '~/components/weighing_fields.vue'
import AppLayout from '~/layouts/app.vue'

const props = defineProps<{
  weighing: Data.Weighing
  breeds: { value: string; label: string }[]
  standards: Record<string, number[]>
}>()

const values = {
  breed: props.weighing.breed,
  ageDays: String(props.weighing.ageDays),
  chickCount: String(props.weighing.chickCount),
  weightKg: String(props.weighing.totalGrams / 1000),
  weighedOn: props.weighing.weighedOn,
  note: props.weighing.note ?? '',
}

const confirmDelete = () => window.confirm('Delete this weighing? This cannot be undone.')
</script>

<template>
  <AppLayout>
    <Head title="Edit weighing" />
    <h1 class="title">Edit weighing</h1>

    <Form v-slot="{ processing, errors }" route="weighings.update" :params="{ id: weighing.id }">
      <WeighingFields :breeds="breeds" :standards="standards" :values="values" :errors="errors" />

      <div class="actionbar">
        <div class="actionbar__inner">
          <Link route="weighings.index" class="btn btn--secondary btn--big">Cancel</Link>
          <button type="submit" class="btn btn--primary btn--big" :disabled="processing">
            {{ processing ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </div>
    </Form>

    <div class="danger-zone">
      <Form route="weighings.destroy" :params="{ id: weighing.id }" :on-before="confirmDelete">
        <button type="submit" class="btn btn--danger btn--big">
          <Trash2 :size="20" aria-hidden="true" /> Delete this weighing
        </button>
      </Form>
    </div>
  </AppLayout>
</template>
