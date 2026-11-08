// Stagger class for the home <-> results cascade (see .cascade-item in globals.css). Capped at the last defined step.
export function cascadeStep(index: number): string {
  return `cascade-d${Math.min(Math.max(index, 0), 12)}`
}
