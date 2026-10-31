<script setup lang="ts">
defineProps<{
  breeds: { value: string; label: string }[]
  values: { breed: string; ageDays: string; weightKg: string; weighedOn: string; note: string }
  errors: Partial<Record<'breed' | 'ageDays' | 'weightKg' | 'weighedOn' | 'note', string>>
}>()
</script>

<template>
  <div class="auth__form">
    <div class="field">
      <label class="field__label" for="breed">Breed</label>
      <select id="breed" name="breed" class="field__input">
        <option
          v-for="option in breeds"
          :key="option.value"
          :value="option.value"
          :selected="option.value === values.breed"
        >
          {{ option.label }}
        </option>
      </select>
      <span v-if="errors.breed" class="field__error">{{ errors.breed }}</span>
    </div>

    <div class="field">
      <label class="field__label" for="ageDays">Age (days)</label>
      <input
        id="ageDays"
        name="ageDays"
        type="number"
        inputmode="numeric"
        min="0"
        max="44"
        step="1"
        class="field__input"
        :value="values.ageDays"
        :aria-invalid="errors.ageDays ? 'true' : 'false'"
      />
      <span v-if="errors.ageDays" class="field__error">{{ errors.ageDays }}</span>
    </div>

    <div class="field">
      <label class="field__label" for="weightKg">Weight (kg)</label>
      <input
        id="weightKg"
        name="weightKg"
        type="number"
        inputmode="decimal"
        step="0.001"
        class="field__input"
        :value="values.weightKg"
        :aria-invalid="errors.weightKg ? 'true' : 'false'"
      />
      <span v-if="errors.weightKg" class="field__error">{{ errors.weightKg }}</span>
    </div>

    <div class="field">
      <label class="field__label" for="weighedOn">Date weighed</label>
      <input
        id="weighedOn"
        name="weighedOn"
        type="date"
        class="field__input"
        :value="values.weighedOn"
        :aria-invalid="errors.weighedOn ? 'true' : 'false'"
      />
      <span v-if="errors.weighedOn" class="field__error">{{ errors.weighedOn }}</span>
    </div>

    <div class="field">
      <label class="field__label" for="note">Note (optional)</label>
      <input
        id="note"
        name="note"
        type="text"
        maxlength="100"
        class="field__input"
        placeholder="House 2"
        :value="values.note"
        :aria-invalid="errors.note ? 'true' : 'false'"
      />
      <span v-if="errors.note" class="field__error">{{ errors.note }}</span>
    </div>
  </div>
</template>
