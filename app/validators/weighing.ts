import vine, { SimpleMessagesProvider } from '@vinejs/vine'
import { BREEDS, MAX_AGE_DAYS } from '#constants/standard_weights'

/**
 * Validator to use when adding or editing a weighing. The weight is
 * typed in kilograms and converted to grams by the controller.
 */
export const weighingValidator = vine.create({
  breed: vine.enum(BREEDS),
  ageDays: vine.number().withoutDecimals().min(0).max(MAX_AGE_DAYS),
  weightKg: vine.number().positive().max(6),
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
    'weightKg.positive': 'Weight must be more than 0',
    'weightKg.max': 'Weight must be 6 kg or less',
    'note.maxLength': 'Note must be 100 characters or fewer',
  },
  {
    ageDays: 'age',
    weightKg: 'weight',
    weighedOn: 'date',
  }
)
