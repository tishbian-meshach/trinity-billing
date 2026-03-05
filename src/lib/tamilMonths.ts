export const tamilMonths: Record<number, string> = {
  1: 'ஜனவரி',
  2: 'பிப்ரவரி',
  3: 'மார்ச்',
  4: 'ஏப்ரல்',
  5: 'மே',
  6: 'ஜூன்',
  7: 'ஜூலை',
  8: 'ஆகஸ்ட்',
  9: 'செப்டம்பர்',
  10: 'அக்டோபர்',
  11: 'நவம்பர்',
  12: 'டிசம்பர்',
};

export function getTamilMonthName(month: number): string {
  return tamilMonths[month] || `Month ${month}`;
}
