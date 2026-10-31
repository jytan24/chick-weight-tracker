<script setup lang="ts">
import FlashToasts from '~/components/flash_toasts.vue'
</script>

<template>
  <div class="gate">
    <div class="gate__box">
      <slot />
    </div>
  </div>
  <FlashToasts />
</template>
