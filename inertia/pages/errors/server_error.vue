<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link } from '@adonisjs/inertia/vue'
import AuthLayout from '~/layouts/auth.vue'
</script>

<template>
  <AuthLayout>
    <Head title="Something went wrong" />
    <h1 class="gate__title">Something went wrong</h1>
    <p class="gate__sub">Nothing you entered was lost. Wait a moment, then try again.</p>
    <Link route="weighings.index" class="btn btn--primary btn--big">Go to weighings</Link>
  </AuthLayout>
</template>
