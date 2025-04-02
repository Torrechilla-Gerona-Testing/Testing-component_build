import '@types/jest';
declare global {
  namespace jest {
    interface Matchers<R> {
      toEqual(expected: any): R;
      toBe(expected: any): R;
      // Add other matchers you use
    }
  }
}