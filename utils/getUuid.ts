function generateRandomUUID(): string {
  const generateWord = (): string => {
    return Math.random().toString(36).substring(2, 10);
  };

  const uuid = Array(8)
    .fill(null)
    .map(() => generateWord())
    .join('-');

  return uuid;
}

export default generateRandomUUID;
