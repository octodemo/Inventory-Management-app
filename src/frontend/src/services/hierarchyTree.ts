import type { Hierarchy } from './catalogApi'

/** Flattens a nested item hierarchy for select controls and subtree lookups. */
export function flattenHierarchy(nodes: Hierarchy[]): Hierarchy[] {
  return nodes.flatMap((node) => [node, ...flattenHierarchy(node.children ?? [])])
}
