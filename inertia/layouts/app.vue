<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { Form } from '@adonisjs/inertia/vue'
import Logo from '~/components/logo.vue'
import FlashToasts from '~/components/flash_toasts.vue'
import ThemeToggle from '~/components/theme_toggle.vue'
</script>

<template>
  <div class="shell">
    <header class="bar">
      <Logo />
      <div class="bar__right">
        <ThemeToggle />
        <Form route="session.destroy">
          <button type="submit" class="btn btn--secondary btn--sm">
            <LogOut :size="16" aria-hidden="true" /> Log out
          </button>
        </Form>
      </div>
    </header>

    <main class="wrap">
      <slot />
    </main>
  </div>
  <FlashToasts />
</template>
