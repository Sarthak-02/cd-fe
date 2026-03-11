export function sortByOrder(items) {
    return [...items].sort((a, b) => a.order - b.order);
  }
  
export function buildSlotLabel(startTime, endTime) {
    if (!startTime || !endTime) return "";
    return `${startTime} - ${endTime}`;
}