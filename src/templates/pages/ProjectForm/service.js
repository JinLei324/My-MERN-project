export function selectLabel(activeType) {
  switch (activeType) {
    case 0:
      return 'How many volunteers do you need?'
    case 1:
      return 'What supplies or items do you need?'
    case 2:
      return 'How mach money do you need?'
    default:
      return ''
  }
}