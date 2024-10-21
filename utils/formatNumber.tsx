function formatNumber(number: number) {
  if (typeof number !== 'number') {
    throw new TypeError('Input must be a number');
  }

  return number < 10 ? '0' + number : number.toString();
}

export default formatNumber;
