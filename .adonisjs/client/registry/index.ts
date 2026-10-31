/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

export type { Route, Path } from './schema.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [[0,"/"]],
    types: placeholder as Registry['home']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [[0,"login"]],
    types: placeholder as Registry['session.store']['types'],
  },
  'weighings.index': {
    methods: ["GET","HEAD"],
    pattern: '/weighings',
    tokens: [[0,"weighings"]],
    types: placeholder as Registry['weighings.index']['types'],
  },
  'weighings.create': {
    methods: ["GET","HEAD"],
    pattern: '/weighings/create',
    tokens: [[0,"weighings"],[0,"create"]],
    types: placeholder as Registry['weighings.create']['types'],
  },
  'weighings.store': {
    methods: ["POST"],
    pattern: '/weighings',
    tokens: [[0,"weighings"]],
    types: placeholder as Registry['weighings.store']['types'],
  },
  'weighings.edit': {
    methods: ["GET","HEAD"],
    pattern: '/weighings/:id/edit',
    tokens: [[0,"weighings"],[1,"id"],[0,"edit"]],
    types: placeholder as Registry['weighings.edit']['types'],
  },
  'weighings.update': {
    methods: ["PUT"],
    pattern: '/weighings/:id',
    tokens: [[0,"weighings"],[1,"id"]],
    types: placeholder as Registry['weighings.update']['types'],
  },
  'weighings.destroy': {
    methods: ["DELETE"],
    pattern: '/weighings/:id',
    tokens: [[0,"weighings"],[1,"id"]],
    types: placeholder as Registry['weighings.destroy']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [[0,"logout"]],
    types: placeholder as Registry['session.destroy']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
