import Weighing from '#models/weighing'
import { BREEDS, BREED_LABELS, STANDARD_WEIGHTS_GRAMS } from '#constants/standard_weights'
import WeighingTransformer from '#transformers/weighing_transformer'
import { weighingValidator } from '#validators/weighing'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

/**
 * Turn the validated form (weight in kilograms) into the columns that
 * are saved (weight in whole grams).
 */
function toColumns({ weightKg, ...data }: Awaited<ReturnType<typeof weighingValidator.validate>>) {
  return {
    ...data,
    note: data.note ?? null,
    weightGrams: Math.round(weightKg * 1000),
  }
}

const WEIGHINGS_PER_PAGE = 30

const breedOptions = BREEDS.map((value) => ({ value, label: BREED_LABELS[value] }))

// Plain copies, because Inertia props must be mutable arrays, not readonly ones
const standardWeights: Record<string, number[]> = Object.fromEntries(
  BREEDS.map((value) => [value, [...STANDARD_WEIGHTS_GRAMS[value]]])
)

export default class WeighingsController {
  async index({ inertia, request }: HttpContext) {
    const breed = BREEDS.find((value) => value === request.qs().breed)

    const query = Weighing.query().orderBy('weighedOn', 'desc').orderBy('id', 'desc')
    if (breed) {
      query.where('breed', breed)
    }

    const page = Math.max(1, Math.floor(Number(request.qs().page)) || 1)
    const paginator = await query.paginate(page, WEIGHINGS_PER_PAGE)

    return inertia.render('weighings/index', {
      weighings: WeighingTransformer.transform(paginator.all()),
      pagination: { currentPage: paginator.currentPage, lastPage: paginator.lastPage },
      breed: breed ?? null,
      breeds: breedOptions,
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('weighings/create', {
      today: DateTime.now().toISODate()!,
      breeds: breedOptions,
      standards: standardWeights,
    })
  }

  async edit({ inertia, params }: HttpContext) {
    const weighing = await Weighing.findOrFail(params.id)

    return inertia.render('weighings/edit', {
      weighing: WeighingTransformer.transform(weighing),
      breeds: breedOptions,
      standards: standardWeights,
    })
  }

  async store({ request, response, session }: HttpContext) {
    const data = await request.validateUsing(weighingValidator)

    await Weighing.create(toColumns(data))

    session.flash('success', 'Weighing saved')
    response.redirect().toRoute('weighings.index')
  }

  async update({ params, request, response, session }: HttpContext) {
    const weighing = await Weighing.findOrFail(params.id)
    const data = await request.validateUsing(weighingValidator)

    await weighing.merge(toColumns(data)).save()

    session.flash('success', 'Weighing updated')
    response.redirect().toRoute('weighings.index')
  }

  async destroy({ params, response, session }: HttpContext) {
    const weighing = await Weighing.findOrFail(params.id)

    await weighing.delete()

    session.flash('success', 'Weighing deleted')
    response.redirect().toRoute('weighings.index')
  }
}
