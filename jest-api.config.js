module.exports = {
    bail: 1,
    testMatch: ['**/apps/**/+(*.)+(test).+(ts)'],
    transform: {
        '^.+\\.(ts|js|html)$': 'ts-jest',
    },
    resolver: '@nrwl/jest/plugins/resolver',
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageReporters: ['html'],
    moduleNameMapper: {
        '@podgroup/api-interfaces$': '<rootDir>/libs/api-interfaces/src'
    },
    setupFiles: ['./apps/api-tests/setup.js'],
};
