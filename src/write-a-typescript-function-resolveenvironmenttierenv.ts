// bloom-deps:

export function resolveEnvironmentTier(env: unknown): {
  tier: 'development' | 'staging' | 'production';
  isProd: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
} {
  if (typeof env !== 'string') {
    throw new TypeError('env must be a string');
  }

  if (env.trim().length === 0) {
    throw new RangeError('env must not be empty');
  }

  const normalised = env.trim().toLowerCase();

  const developmentAliases = ['development', 'dev', 'local', 'test', 'testing'];
  const stagingAliases = ['staging', 'stage', 'uat', 'preprod', 'pre-prod'];
  const productionAliases = ['production', 'prod', 'live'];

  if (developmentAliases.includes(normalised)) {
    return { tier: 'development', isProd: false, logLevel: 'debug' };
  }

  if (stagingAliases.includes(normalised)) {
    return { tier: 'staging', isProd: false, logLevel: 'info' };
  }

  if (productionAliases.includes(normalised)) {
    return { tier: 'production', isProd: true, logLevel: 'warn' };
  }

  throw new RangeError('unrecognised environment');
}