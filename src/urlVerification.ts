import { lookup as dnsLookup } from 'node:dns';
import { BlockList, isIP, type LookupFunction } from 'node:net';
import { ThreatIntelligenceStatus } from './types';

const blockedAddresses = new BlockList();

[
  ['0.0.0.0', 8, 'ipv4'],
  ['10.0.0.0', 8, 'ipv4'],
  ['100.64.0.0', 10, 'ipv4'],
  ['127.0.0.0', 8, 'ipv4'],
  ['169.254.0.0', 16, 'ipv4'],
  ['172.16.0.0', 12, 'ipv4'],
  ['192.0.0.0', 24, 'ipv4'],
  ['192.0.2.0', 24, 'ipv4'],
  ['192.168.0.0', 16, 'ipv4'],
  ['198.18.0.0', 15, 'ipv4'],
  ['198.51.100.0', 24, 'ipv4'],
  ['203.0.113.0', 24, 'ipv4'],
  ['224.0.0.0', 4, 'ipv4'],
  ['240.0.0.0', 4, 'ipv4'],
  ['::', 128, 'ipv6'],
  ['::1', 128, 'ipv6'],
  ['2001:db8::', 32, 'ipv6'],
  ['2002::', 16, 'ipv6'],
  ['fc00::', 7, 'ipv6'],
  ['fe80::', 10, 'ipv6'],
  ['ff00::', 8, 'ipv6']
].forEach(([address, prefix, family]) => {
  blockedAddresses.addSubnet(address as string, prefix as number, family as 'ipv4' | 'ipv6');
});

const PARKED_DOMAINS = [
  'dell.com',
  'sedoparking.com',
  'parkingcrew.net',
  'bodis.com',
  'hugedomains.com',
  'afternic.com',
  'dan.com',
  'parked.com',
  'domainmarket.com',
  'above.com',
  'namecheap.com'
];

const NETWORK_ERROR_CODES = new Set([
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EPRIVATEIP',
  'UNSAFE_REDIRECT'
]);

export class InvalidVerificationTargetError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidVerificationTargetError';
  }
}

function isBlockedAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 6) {
    const mappedAddress = address.match(/^::ffff:(?:(\d{1,3}(?:\.\d{1,3}){3})|([0-9a-f]{1,4}):([0-9a-f]{1,4}))$/i);
    if (mappedAddress) {
      const ipv4Address = mappedAddress[1] || [
        Number.parseInt(mappedAddress[2], 16) >> 8,
        Number.parseInt(mappedAddress[2], 16) & 255,
        Number.parseInt(mappedAddress[3], 16) >> 8,
        Number.parseInt(mappedAddress[3], 16) & 255
      ].join('.');
      return isBlockedAddress(ipv4Address);
    }
  }

  return family === 0 || blockedAddresses.check(address, family === 4 ? 'ipv4' : 'ipv6');
}

const publicDnsLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { all: true, verbatim: true }, (error, addresses) => {
    if (error) {
      callback(error, '', 0);
      return;
    }

    const records = Array.isArray(addresses) ? addresses : [addresses];
    if (records.length === 0 || records.some(({ address }) => isBlockedAddress(address))) {
      callback(Object.assign(new Error('Target resolves to a non-public address.'), { code: 'EPRIVATEIP' }), '', 0);
      return;
    }

    if (options.all) {
      callback(null, records);
      return;
    }

    const selected = records.find(record => !options.family || record.family === options.family);
    if (!selected) {
      callback(Object.assign(new Error('No address matches the requested IP family.'), { code: 'ENOTFOUND' }), '', 0);
      return;
    }

    callback(null, selected.address, selected.family);
  });
};

function validateTarget(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new InvalidVerificationTargetError('A valid absolute URL is required.');
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new InvalidVerificationTargetError('Only public HTTP or HTTPS URLs are supported.');
  }

  if (url.port && !['80', '443'].includes(url.port)) {
    throw new InvalidVerificationTargetError('Only standard HTTP and HTTPS ports can be verified.');
  }

  if (url.hostname && isIP(url.hostname) && isBlockedAddress(url.hostname)) {
    throw new InvalidVerificationTargetError('Private and reserved network addresses cannot be verified.');
  }

  return url;
}

function isParkingDomain(hostname: string): boolean {
  const normalizedHost = hostname.toLowerCase().replace(/^www\./, '');
  return PARKED_DOMAINS.some(domain =>
    normalizedHost === domain || normalizedHost.endsWith(`.${domain}`)
  );
}

export function createThreatIntelligenceStatus(
  originalUrl: string,
  finalUrl: string,
  httpStatus: number
): ThreatIntelligenceStatus {
  let finalHostname = '';
  try {
    finalHostname = new URL(finalUrl).hostname;
  } catch {
    finalHostname = '';
  }

  const checkedAt = new Date().toISOString();

  if (finalHostname && isParkingDomain(finalHostname)) {
    return {
      status: 'Cloaked / Parked',
      color: 'orange',
      code: 'CLOAKED',
      originalUrl,
      finalUrl,
      httpStatus,
      checkedAt
    };
  }

  if (httpStatus === 404) {
    return {
      status: 'Dead Mirror (404)',
      color: 'red',
      code: 'DEAD',
      originalUrl,
      finalUrl,
      httpStatus,
      checkedAt
    };
  }

  if (httpStatus >= 200 && httpStatus < 400) {
    return {
      status: 'Active Pirate Infrastructure',
      color: 'green',
      code: 'ACTIVE',
      originalUrl,
      finalUrl,
      httpStatus,
      checkedAt
    };
  }

  return {
    status: 'ISP Blocked / Offline',
    color: 'purple',
    code: 'BLOCKED',
    originalUrl,
    finalUrl,
    httpStatus,
    checkedAt,
    errorCode: `HTTP_${httpStatus}`
  };
}

export async function verifyUrl(rawUrl: string): Promise<ThreatIntelligenceStatus> {
  const targetUrl = validateTarget(rawUrl);
  let destroyRequest: (() => void) | undefined;

  try {
    const { gotScraping } = await import('got-scraping');
    const activeRequest = gotScraping.stream(targetUrl, {
      method: 'GET',
      timeout: { request: 5000 },
      followRedirect: true,
      maxRedirects: 5,
      throwHttpErrors: false,
      retry: { limit: 0 },
      dnsLookup: publicDnsLookup,
      hooks: {
        beforeRedirect: [
          options => {
            const redirectUrl = options.url;
            if (!redirectUrl) {
              throw new InvalidVerificationTargetError('Redirect destination is missing.');
            }
            validateTarget(redirectUrl.toString());
          }
        ]
      }
    });
    destroyRequest = () => activeRequest.destroy();
    const response = await new Promise<{ url: string; statusCode: number }>((resolve, reject) => {
      activeRequest.once('response', result => {
        resolve({ url: result.url, statusCode: result.statusCode });
      });
      activeRequest.once('error', reject);
    });
    activeRequest.destroy();
    destroyRequest = undefined;

    return createThreatIntelligenceStatus(
      targetUrl.toString(),
      response.url,
      response.statusCode
    );
  } catch (error) {
    destroyRequest?.();
    const errorCode =
      error instanceof InvalidVerificationTargetError
        ? 'UNSAFE_REDIRECT'
        : typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : error instanceof Error
            ? error.name
            : 'NETWORK_ERROR';

    if (!NETWORK_ERROR_CODES.has(errorCode)) {
      throw error;
    }

    return {
      status: 'ISP Blocked / Offline',
      color: 'purple',
      code: 'BLOCKED',
      originalUrl: targetUrl.toString(),
      checkedAt: new Date().toISOString(),
      errorCode
    };
  }
}
