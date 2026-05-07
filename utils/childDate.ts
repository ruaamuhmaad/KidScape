const parseBirthDate = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  return date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day) &&
    date <= new Date()
    ? date
    : null;
};

export const calculateAge = (value: string): number | null => {
  const birthDate = parseBirthDate(value);

  if (!birthDate) {
    return null;
  }

  const today = new Date();
  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  return today.getFullYear() - birthDate.getFullYear() - (birthdayPassed ? 0 : 1);
};
