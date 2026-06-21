const isControlCharacter = (character: string): boolean => {
  const code = character.charCodeAt(0);

  return code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127;
};

export const hasControlCharacters = (value: string): boolean =>
  Array.from(value).some(isControlCharacter);

export const stripControlCharacters = (value: string): string =>
  Array.from(value)
    .filter((character) => !isControlCharacter(character))
    .join("");
