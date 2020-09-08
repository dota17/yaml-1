import { createPair } from '../../ast/Pair.js'
import { YAMLMap } from '../../ast/YAMLMap.js'
import { resolveMap } from '../../resolve/resolveMap.js'

function createMap(schema, obj, ctx) {
  const { replacer } = ctx
  const map = new YAMLMap(schema)
  const add = (key, value) => {
    if (typeof replacer === 'function') value = replacer.call(obj, key, value)
    else if (Array.isArray(replacer) && !replacer.includes(key)) return
    if (value !== undefined) map.items.push(createPair(key, value, ctx))
  }
  if (obj instanceof Map) {
    for (const [key, value] of obj) add(key, value)
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) add(key, obj[key])
  }
  if (typeof schema.sortMapEntries === 'function') {
    map.items.sort(schema.sortMapEntries)
  }
  return map
}

export const map = {
  createNode: createMap,
  default: true,
  nodeClass: YAMLMap,
  tag: 'tag:yaml.org,2002:map',
  resolve: resolveMap
}
