// eslint-disable-next-line import/no-default-export
export default {
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
  coverageDirectory: './coverage',
  coverageReporters: ['cobertura', 'text'],
};
