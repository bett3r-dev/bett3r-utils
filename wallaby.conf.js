module.exports = function (w) {
  process.env.NODE_ENV = 'test';
  return {
    compilers: {
      '**/*.ts?(x)': w.compilers.typeScript({ /* isolatedModules: true, */ module:'commonjs' })
    },
    files: [
      'src/{,**/}*.ts',
      { pattern: 'src/{,**/}*.test.ts', ignore: true },
      { pattern: 'wallaby.conf.ts', ignore: true, instrument:false },
    ],
    tests: [
      'src/{,**/}*.test.ts',
    ],
    env: {
      type: 'node'
    },
    hints: {
      // or /istanbul ignore next/, or any RegExp
      ignoreCoverage: /istanbul ignore next/
    },
    testFramework: 'mocha',
    runMode: 'onsave'
  };
};
