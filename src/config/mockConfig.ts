export const MOCK_CONFIG = {
  USE_MOCK_DATA: true, // Change this to false to use real API
  MOCK_DELAY: 500, // milliseconds
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export { delay };
