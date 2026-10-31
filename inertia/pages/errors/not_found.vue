<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import AuthLayout from '~/layouts/auth.vue'
</script>

<template>
  <AuthLayout>
    <Head title="Page not found" />
    <h1 class="gate__title">Page not found</h1>
    <p class="gate__sub">Check the address, or go back to your weighings.</p>
    <Link route="weighings.index" class="btn btn--primary btn--big">Go to weighings</Link>
  </AuthLayout>
</template>
