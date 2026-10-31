/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  weighings: {
    index: typeof routes['weighings.index']
    create: typeof routes['weighings.create']
    store: typeof routes['weighings.store']
    edit: typeof routes['weighings.edit']
    update: typeof routes['weighings.update']
    destroy: typeof routes['weighings.destroy']
  }
}
