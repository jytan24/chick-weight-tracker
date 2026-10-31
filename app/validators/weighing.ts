import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { BREEDS, MAX_AGE_DAYS } from '#constants/standard_weights'
import { averageWeightGrams } from '#services/batch_average_service'

const MAX_AVERAGE_GRAMS = 6000

/**
 * Checks the Average Weight of the batch (total weight divided by the number of chicks):
 * one chick can be at most 6 kg, and the average must still be at least 1 g once rounded.
 * It runs after chickCount, which is missing when the form is for a single chick.
 */
const averageWeightRule = vine.createRule((value, _options, field) => {
  const chickCount = Number(field.parent.chickCount ?? 1)
  if (typeof value !== 'number' || !Number.isInteger(chickCount) || chickCount < 1) {
    return
  }

  const totalGrams = Math.round(value * 1000)
  if (totalGrams / chickCount > MAX_AVERAGE_GRAMS) {
    field.report('Average weight must be 6 kg or less', 'maxAverage', field)
  } else if (averageWeightGrams(totalGrams, chickCount) < 1) {
    field.report('Total weight is too small for this number of chicks', 'minAverage', field)
  }
})

/**
 * Validator to use when adding or editing a weighing. For a batch, weightKg is the total
 * weight of all the chicks, typed in kilograms. The controller turns it into grams.
 */
export const weighingValidator = vine.create({
  breed: vine.enum(BREEDS),
  ageDays: vine.number().withoutDecimals().min(0).max(MAX_AGE_DAYS),
  chickCount: vine.number().withoutDecimals().min(1).max(1000).optional(),
  weightKg: vine.number().positive().use(averageWeightRule()),
  weighedOn: vine.date({ formats: ['YYYY-MM-DD'] }),
  note: vine.string().trim().maxLength(100).nullable().optional(),
})

weighingValidator.messagesProvider = new SimpleMessagesProvider(
  {
    'required': 'Please enter the {{ field }}',
    'number': 'The {{ field }} must be a number',
    'withoutDecimals': 'The {{ field }} must be a whole number',
    'date': 'Please enter a valid {{ field }}',
    'breed.enum': 'Choose Ross, Cobb or AA Plus',
    'ageDays.min': 'No standard weight for this age',
    'ageDays.max': 'No standard weight for this age',
    'chickCount.number': 'Number of chicks must be a whole number from 1 to 1000',
    'chickCount.withoutDecimals': 'Number of chicks must be a whole number from 1 to 1000',
    'chickCount.min': 'Number of chicks must be a whole number from 1 to 1000',
    'chickCount.max': 'Number of chicks must be a whole number from 1 to 1000',
    'weightKg.positive': 'Weight must be more than 0',
    'note.maxLength': 'Note must be 100 characters or fewer',
  },
  {
    ageDays: 'age',
    chickCount: 'number of chicks',
    weightKg: 'weight',
    weighedOn: 'date',
  }
)
