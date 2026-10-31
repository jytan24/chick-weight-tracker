<script setup lang="ts">
import type { Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/vue'
import { Scale } from 'lucide-vue-next'
import Page from '~/components/page.vue'
import AppLayout from '~/layouts/app.vue'

defineProps<{
  weighings: Data.Weighing[]
  pagination: { currentPage: number; lastPage: number }
  breed: string | null
  breeds: { value: string; label: string }[]
}>()
</script>

<template>
  <AppLayout>
    <Page title="Weighings" hide-title>
      <Link route="weighings.create" class="btn btn--primary">Add weighing</Link>

      <nav>
        <Link route="weighings.index">All</Link>
        <Link
          v-for="option in breeds"
          :key="option.value"
          route="weighings.index"
          :qs="{ breed: option.value }"
        >
          {{ option.label }}
        </Link>
      </nav>

      <div v-if="weighings.length === 0" class="empty">
        <div class="empty__mark">
          <Scale :size="22" />
        </div>
        <h1>No weighings yet</h1>
        <p>Saved chicken weighings will show up here.</p>
      </div>

      <ul v-else>
        <li v-for="weighing in weighings" :key="weighing.id">
          {{ weighing.weighedOn }} · {{ weighing.breed }} · day {{ weighing.ageDays }} ·
          {{ weighing.weightGrams }} g (standard {{ weighing.standardGrams }} g) ·
          {{ weighing.gapPercent }}% · {{ weighing.status }}
          <span v-if="weighing.note"> · {{ weighing.note }}</span>
          ·
          <Link route="weighings.edit" :params="{ id: weighing.id }">Edit</Link>
        </li>
      </ul>

      <nav v-if="pagination.lastPage > 1">
        <Link
          v-if="pagination.currentPage > 1"
          route="weighings.index"
          :qs="{ breed: breed ?? undefined, page: pagination.currentPage - 1 }"
        >
          Newer
        </Link>
        <span>Page {{ pagination.currentPage }} of {{ pagination.lastPage }}</span>
        <Link
          v-if="pagination.currentPage < pagination.lastPage"
          route="weighings.index"
          :qs="{ breed: breed ?? undefined, page: pagination.currentPage + 1 }"
        >
          Older
        </Link>
      </nav>
    </Page>
  </AppLayout>
</template>
