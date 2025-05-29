import { ToWords } from 'to-words';

const toWords = new ToWords({
  localeCode: 'en-US',
  converterOptions: {
    currency: false,
    ignoreDecimal: false,
    ignoreZeroCurrency: false
  }
});

export const handleTitleWithJustNumber = (dirtyTitle: string) => {
  const cleanedTitle = dirtyTitle.trim();
  if (/^\d+$/.test(cleanedTitle)) {
    return toWords.convert(Number(cleanedTitle));
  }
  return cleanedTitle;
};
