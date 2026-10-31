<script setup lang="ts">
import { computed, ref } from 'vue'
import { kg } from '~/utils/format'

const props = defineProps<{
  breeds: { value: string; label: string }[]
  standards: Record<string, number[]>
  values: { breed: string; ageDays: string; weightKg: string; weighedOn: string; note: string }
  errors: Partial<Record<'breed' | 'ageDays' | 'weightKg' | 'weighedOn' | 'note', string>>
}>()

const breed = ref(props.values.breed)
const ageDays = ref(props.values.ageDays)

const breedLabel = computed(() => props.breeds.find((b) => b.value === breed.value)?.label ?? '')

// Show the standard while she types, so she knows what to compare against.
const standardGrams = computed(() => {
  if (ageDays.value === '') return null
  const age = Number(ageDays.value)
  if (!Number.isInteger(age)) return null
  return props.standards[breed.value]?.[age] ?? null
})
</script>

<template>
  <div class="form">
    <fieldset class="q">
      <legend class="q__label">Breed</legend>
      <div class="choice">
        <template v-for="option in breeds" :key="option.value">
          <input
            :id="`breed-${option.value}`"
            v-model="breed"
            type="radio"
            name="breed"
            class="choice__input"
            :value="option.value"
          />
          <label :for="`breed-${option.value}`" class="choice__item">{{ option.label }}</label>
        </template>
      </div>
      <p v-if="errors.breed" class="q__error" role="alert">{{ errors.breed }}</p>
    </fieldset>

    <div class="q">
      <label class="q__label" for="ageDays">Age in days (0 to 44)</label>
      <div class="unit-field">
        <input
          id="ageDays"
          v-model="ageDays"
          name="ageDays"
          type="number"
          inputmode="numeric"
          min="0"
          max="44"
          step="1"
          class="big"
          :aria-invalid="errors.ageDays ? 'true' : 'false'"
        />
        <span class="unit">days</span>
      </div>
      <p v-if="errors.ageDays" class="q__error" role="alert">{{ errors.ageDays }}</p>
    </div>

    <div class="q">
      <label class="q__label" for="weightKg">Weight</label>
      <div class="unit-field">
        <input
          id="weightKg"
          name="weightKg"
          type="number"
          inputmode="decimal"
          step="0.001"
          min="0"
          class="big"
          :value="values.weightKg"
          :aria-invalid="errors.weightKg ? 'true' : 'false'"
        />
        <span class="unit">kg</span>
      </div>
      <p v-if="errors.weightKg" class="q__error" role="alert">{{ errors.weightKg }}</p>
    </div>

    <p v-if="standardGrams !== null" class="std" aria-live="polite">
      Standard for {{ breedLabel }} on day {{ ageDays }}:
      <span class="num">{{ kg(standardGrams) }} kg</span>
    </p>

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
      <p v-if="errors.weighedOn" class="q__error" role="alert">{{ errors.weighedOn }}</p>
    </div>

    <div class="field">
      <label class="field__label" for="note">Note (optional)</label>
      <input
        id="note"
        name="note"
        type="text"
        maxlength="100"
        class="field__input"
        placeholder="For example: House 2"
        :value="values.note"
        :aria-invalid="errors.note ? 'true' : 'false'"
      />
      <p v-if="errors.note" class="q__error" role="alert">{{ errors.note }}</p>
    </div>
  </div>
</template>
