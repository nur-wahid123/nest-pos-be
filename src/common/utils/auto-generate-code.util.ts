export const codeFormater = async (
  fistPrefix: string,
  secondPrefix: string,
  date: Date,
  currentCode?: string | null,
): Promise<string> => {
  const newdate = new Date(date);
  let formatedDate = newdate.toISOString().slice(0, 10).replace(/-/g, '');
  if (secondPrefix === 'SP' || secondPrefix === 'SL' || secondPrefix === 'CU') {
    formatedDate = newdate.toISOString().slice(0, 4).replace(/-/g, '');
  }
  let number: number;
  if (!currentCode) {
    number = 1;
  } else {
    number = parseInt(currentCode.slice(-4), 10) + 1;
  }
  //generate 4 digit number
  const formattedNumber = number.toString().padStart(4, '0');
  return `${fistPrefix}/${secondPrefix}${formatedDate}${formattedNumber}`;
};
export const codeFormaterWithOutLocation = async (
  secondPrefix: string,
  date: Date,
  currentCode?: string | null,
): Promise<string> => {
  const newdate = new Date(date);
  let formatedDate = newdate.toISOString().slice(0, 10).replace(/-/g, '');
  if (secondPrefix === 'SP' || secondPrefix === 'SL' || secondPrefix === 'CU') {
    formatedDate = newdate.toISOString().slice(0, 4).replace(/-/g, '');
  }
  let number: number;
  if (!currentCode) {
    number = 1;
  } else {
    number = parseInt(currentCode.slice(-4), 10) + 1;
  }
  //generate 4 digit number
  const formattedNumber = number.toString().padStart(4, '0');
  return `${secondPrefix}${formatedDate}${formattedNumber}`;
};

export const journalCodeFormater = (
  secondPrefix: string,
  period: string,
  currentCode?: string | null,
): string => {
  let number: number;
  if (!currentCode) {
    number = 1;
  } else {
    number = parseInt(currentCode.slice(-4), 10) + 1;
  }
  const formattedNumber = number.toString().padStart(4, '0');
  return `${secondPrefix}${period}${formattedNumber}`;
};

export const memberCardCodeFormater = (
  secondPrefix: string,
  date: Date,
  currentCode?: string | null,
): string => {
  let number: number;
  if (!currentCode) {
    number = 1;
  } else {
    number = parseInt(currentCode.slice(-4), 10) + 1;
  }
  const newdate = new Date(date);
  const formatedDate = newdate.toISOString().slice(0, 7).replace(/-/g, '');

  const formattedNumber = number.toString().padStart(4, '0');
  return `${secondPrefix}${formatedDate}${formattedNumber}`;
};

export const increaseSequenceVal = (code: string, incValue: number) => {
  const number = parseInt(code.slice(-4), 10) + incValue;

  return `${code.slice(0, code.length - 4)}${number
    .toString()
    .padStart(4, '0')}`;
};
