import type Weighing from '#models/weighing'
import type { Breed } from '#constants/standard_weights'
import { evaluateSchedule } from '#services/growth_schedule_service'
import { evaluateWeighing } from '#services/weight_status_service'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class WeighingTransformer extends BaseTransformer<Weighing> {
  toObject() {
    const { id, breed, ageDays, weightGrams, note } = this.resource

    return {
      id,
      breed: breed as Breed,
      ageDays,
      weightGrams,
      weighedOn: this.resource.weighedOn.toISODate()!,
      note,
      ...evaluateWeighing(breed as Breed, ageDays, weightGrams),
      schedule: evaluateSchedule(breed as Breed, ageDays, weightGrams),
    }
  }
}
