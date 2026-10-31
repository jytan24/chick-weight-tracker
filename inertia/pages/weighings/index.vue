<script setup lang="ts">
import { Scale } from 'lucide-vue-next'
import Page from '~/components/page.vue'
import AppLayout from '~/layouts/app.vue'
</script>

<template>
  <AppLayout>
    <Page title="Weighings" hide-title>
      <div class="empty">
        <div class="empty__mark">
          <Scale :size="22" />
        </div>
        <h1>No weighings yet</h1>
        <p>Saved chicken weighings will show up here.</p>
      </div>
    </Page>
  </AppLayout>
</template>
