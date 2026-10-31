<script setup lang="ts">
import { computed } from 'vue'
import { STATUS_LABELS, gaugePosition, signedPercent, type Status } from '~/utils/format'

const props = defineProps<{ gapPercent: number; status: Status }>()

const zones: Status[] = ['behind', 'slightly_behind', 'on_track', 'ahead']
const position = computed(() => gaugePosition(props.gapPercent))
const description = computed(
  () =>
    `${signedPercent(props.gapPercent)} from the standard weight: ${STATUS_LABELS[props.status]}`
)
</script>

<template>
  <div class="gauge" role="img" :aria-label="description">
    <div class="gauge__track">
      <span
        v-for="zone in zones"
        :key="zone"
        class="gauge__zone"
        :class="`gauge__zone--${zone}`"
        :data-active="zone === status"
      />
      <span class="gauge__std" />
    </div>
    <span class="gauge__mark" :style="{ '--pos': `${position}%` }" />
    <span class="gauge__cap">standard</span>
  </div>
</template>
