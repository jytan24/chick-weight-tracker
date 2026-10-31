<script setup lang="ts">
import { computed, ref } from 'vue'
import { averageGrams, kg } from '~/utils/format'

const props = defineProps<{
  breeds: { value: string; label: string }[]
  standards: Record<string, number[]>
  values: {
    breed: string
    ageDays: string
    chickCount: string
    weightKg: string
    weighedOn: string
    note: string
  }
  errors: Partial<
    Record<'breed' | 'ageDays' | 'chickCount' | 'weightKg' | 'weighedOn' | 'note', string>
  >
}>()

const breed = ref(props.values.breed)
const ageDays = ref(props.values.ageDays)
const chickCount = ref(props.values.chickCount)
const weightKg = ref(props.values.weightKg)

const breedLabel = computed(() => props.breeds.find((b) => b.value === breed.value)?.label ?? '')

// Show the standard while she types, so she knows what to compare against.
const standardGrams = computed(() => {
  if (ageDays.value === '') return null
  const age = Number(ageDays.value)
  if (!Number.isInteger(age)) return null
  return props.standards[breed.value]?.[age] ?? null
})

// More than one chick: the weight typed is the total of the whole batch
const isBatch = computed(() => {
  const count = Number(chickCount.value)
  return Number.isInteger(count) && count > 1
})

// Show the average per chick while she types, so a mistake (an average typed as the total) stands out
const averageWeightGrams = computed(() => {
  const count = Number(chickCount.value)
  const totalGrams = Math.round(Number(weightKg.value) * 1000)
  if (!isBatch.value || count > 1000 || !(totalGrams > 0)) return null
  return averageGrams(totalGrams, count)
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
      <label class="q__label" for="chickCount">Number of chicks (1 to 1000)</label>
      <div class="unit-field">
        <input
          id="chickCount"
          v-model="chickCount"
          name="chickCount"
          type="number"
          inputmode="numeric"
          min="1"
          max="1000"
          step="1"
          class="big"
          :aria-invalid="errors.chickCount ? 'true' : 'false'"
        />
        <span class="unit">chicks</span>
      </div>
      <p v-if="errors.chickCount" class="q__error" role="alert">{{ errors.chickCount }}</p>
    </div>

    <div class="q">
      <label class="q__label" for="weightKg">
        {{ isBatch ? 'Total weight of all the chicks' : 'Weight' }}
      </label>
      <div class="unit-field">
        <input
          id="weightKg"
          v-model="weightKg"
          name="weightKg"
          type="number"
          inputmode="decimal"
          step="0.001"
          min="0"
          class="big"
          :aria-invalid="errors.weightKg ? 'true' : 'false'"
        />
        <span class="unit">kg</span>
      </div>
      <p v-if="errors.weightKg" class="q__error" role="alert">{{ errors.weightKg }}</p>
    </div>

    <div
      v-if="averageWeightGrams !== null || standardGrams !== null"
      class="std"
      aria-live="polite"
    >
      <p v-if="averageWeightGrams !== null">
        Average per chick: <span class="num">{{ kg(averageWeightGrams) }} kg</span>
      </p>
      <p v-if="standardGrams !== null">
        Standard for {{ breedLabel }} on day {{ ageDays }}:
        <span class="num">{{ kg(standardGrams) }} kg</span>
      </p>
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
