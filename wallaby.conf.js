module.exports = () => {
  return {
    // tell wallaby to use automatic configuration
    autoDetect: true,
    trace: true,
    hints: {
      ignoreCoverage: /istanbul ignore next/
    },
  };
};
