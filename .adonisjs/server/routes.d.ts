import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'weighings.index': { paramsTuple?: []; params?: {} }
    'weighings.create': { paramsTuple?: []; params?: {} }
    'weighings.store': { paramsTuple?: []; params?: {} }
    'weighings.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'weighings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'weighings.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'weighings.index': { paramsTuple?: []; params?: {} }
    'weighings.create': { paramsTuple?: []; params?: {} }
    'weighings.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'weighings.index': { paramsTuple?: []; params?: {} }
    'weighings.create': { paramsTuple?: []; params?: {} }
    'weighings.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'session.store': { paramsTuple?: []; params?: {} }
    'weighings.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'weighings.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'weighings.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}