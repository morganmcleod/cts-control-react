const TestTypes = {
  NOISE_TEMP: 1,
  BEAM_PATTERN: 2,
  PHASE_STABILITY: 4,
  IF_PLATE_NOISE: 5,
  AMP_STABILITY: 7,
  LO_WG_INTEGRITY: 14,
  AMP_OR_PHASE_STABILITY: 99,  // the same tab handles both
  
  getText: (testTypeId) => {
    switch(testTypeId) {
      case TestTypes.NOISE_TEMP:
      case TestTypes.LO_WG_INTEGRITY:
        return "Noise temperature";

      case TestTypes.BEAM_PATTERN:
        return "Beam patterns";

      case TestTypes.PHASE_STABILITY:
        return "Phase stability";

      case TestTypes.IF_PLATE_NOISE:
        return "IF plate noise";

      case TestTypes.AMP_STABILITY:
        return "Amplitude stability";

      default:
        return null;
    }
  }
}
export default TestTypes
