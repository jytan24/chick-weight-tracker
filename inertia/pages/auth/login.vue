<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Form } from '@adonisjs/inertia/vue'
import AuthLayout from '~/layouts/auth.vue'
</script>

<template>
  <AuthLayout>
    <Head title="Log in" />
    <h1 class="gate__title">JY Chick</h1>
    <p class="gate__sub">
      Log in to record chicken weights and see how far they are from the standard.
    </p>

    <Form v-slot="{ processing, errors }" route="session.store">
      <div class="form">
        <div class="field">
          <label class="field__label" for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            inputmode="email"
            autocapitalize="none"
            autocomplete="username"
            class="field__input"
            :aria-invalid="errors.email ? 'true' : 'false'"
          />
          <p v-if="errors.email" class="q__error" role="alert">{{ errors.email }}</p>
        </div>

        <div class="field">
          <label class="field__label" for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            class="field__input"
            :aria-invalid="errors.password ? 'true' : 'false'"
          />
          <p v-if="errors.password" class="q__error" role="alert">{{ errors.password }}</p>
        </div>

        <button type="submit" class="btn btn--primary btn--big" :disabled="processing">
          {{ processing ? 'Logging in…' : 'Log in' }}
        </button>
      </div>
    </Form>
  </AuthLayout>
</template>
