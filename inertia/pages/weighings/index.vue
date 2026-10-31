<script setup lang="ts">
import type { Data } from '@generated/data'
import { Head } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import { CalendarClock, Pencil, Plus, Scale } from 'lucide-vue-next'
import GapGauge from '~/components/gap_gauge.vue'
import StatusBadge from '~/components/status_badge.vue'
import AppLayout from '~/layouts/app.vue'
import { kg, scheduleText, shortDate, signedPercent } from '~/utils/format'

defineProps<{
  weighings: Data.Weighing[]
  pagination: { currentPage: number; lastPage: number }
  breed: string | null
  breeds: { value: string; label: string }[]
}>()

const current = (active: boolean) => (active ? { 'aria-current': 'page' } : {})
</script>

<template>
  <AppLayout>
    <Head title="Weighings" />
    <h1 class="title">Weighings</h1>

    <nav class="seg" aria-label="Filter by breed">
      <Link route="weighings.index" class="seg__item" v-bind="current(!breed)"> All </Link>
      <Link
        v-for="option in breeds"
        :key="option.value"
        route="weighings.index"
        :qs="{ breed: option.value }"
        class="seg__item"
        v-bind="current(breed === option.value)"
      >
        {{ option.label }}
      </Link>
    </nav>

    <div v-if="weighings.length === 0" class="empty">
      <div class="empty__mark">
        <Scale :size="22" aria-hidden="true" />
      </div>
      <h2>{{ breed ? 'No weighings for this breed' : 'No weighings yet' }}</h2>
      <p>
        {{
          breed
            ? 'Choose All, or add a weighing for this breed.'
            : 'Add your first weighing to see how far it is from the standard.'
        }}
      </p>
    </div>

    <ul v-else class="rows">
      <li v-for="weighing in weighings" :key="weighing.id" class="row">
        <div class="row__top">
          <span>
            <span class="row__age">Day {{ weighing.ageDays }}</span>
            <span class="row__breed">{{
              breeds.find((b) => b.value === weighing.breed)?.label
            }}</span>
          </span>
          <span class="row__date">{{ shortDate(weighing.weighedOn) }}</span>
        </div>

        <div class="row__weights">
          <span class="num row__actual">
            {{ kg(weighing.weightGrams) }}<span class="row__unit">kg</span>
          </span>
          <span class="row__std">standard {{ kg(weighing.standardGrams) }} kg</span>
        </div>

        <p v-if="weighing.chickCount > 1" class="row__batch">
          Average of {{ weighing.chickCount }} chicks · total {{ kg(weighing.totalGrams) }} kg
        </p>

        <GapGauge :gap-percent="weighing.gapPercent" :status="weighing.status" />

        <div class="row__foot">
          <div class="row__verdict">
            <span class="num row__gap" :class="`tone--${weighing.status}`">
              {{ signedPercent(weighing.gapPercent) }}
            </span>
            <StatusBadge :status="weighing.status" />
          </div>
          <Link
            route="weighings.edit"
            :params="{ id: weighing.id }"
            class="row__edit"
            v-bind="{ 'aria-label': `Edit day ${weighing.ageDays} weighing` }"
          >
            <Pencil :size="16" aria-hidden="true" /> Edit
          </Link>
        </div>

        <p class="row__schedule">
          <CalendarClock :size="20" aria-hidden="true" />
          {{ scheduleText(weighing.schedule) }}
        </p>

        <p v-if="weighing.note" class="row__note">{{ weighing.note }}</p>
      </li>
    </ul>

    <nav v-if="pagination.lastPage > 1" class="pager" aria-label="Pages">
      <Link
        v-if="pagination.currentPage > 1"
        route="weighings.index"
        :qs="{ breed: breed ?? undefined, page: pagination.currentPage - 1 }"
        class="btn btn--secondary"
      >
        Newer
      </Link>
      <span v-else />
      <span>Page {{ pagination.currentPage }} of {{ pagination.lastPage }}</span>
      <Link
        v-if="pagination.currentPage < pagination.lastPage"
        route="weighings.index"
        :qs="{ breed: breed ?? undefined, page: pagination.currentPage + 1 }"
        class="btn btn--secondary"
      >
        Older
      </Link>
      <span v-else />
    </nav>

    <div class="actionbar">
      <div class="actionbar__inner">
        <Link route="weighings.create" class="btn btn--primary btn--big">
          <Plus :size="22" aria-hidden="true" /> Add weighing
        </Link>
      </div>
    </div>
  </AppLayout>
</template>
