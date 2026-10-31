<script setup lang="ts">
import { CircleCheck, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-vue-next'
import { STATUS_LABELS, type Status } from '~/utils/format'

defineProps<{ status: Status }>()

const icons = {
  ahead: TrendingUp,
  on_track: CircleCheck,
  slightly_behind: TriangleAlert,
  behind: TrendingDown,
}
</script>

<template>
  <span class="verdict" :class="`verdict--${status}`">
    <component :is="icons[status]" :size="18" aria-hidden="true" />
    {{ STATUS_LABELS[status] }}
  </span>
</template>
