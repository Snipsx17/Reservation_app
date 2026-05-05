import { createHash } from 'node:crypto';

export class DeviceFingerprintHelper {
  static create(
    userAgent: string = 'unknown',
    ipAddress: string = 'unknown',
  ): string {
    const normalizedUserAgent = this.normalizeUserAgent(userAgent);
    const normalizedIpAddress = this.normalizeIpAddress(ipAddress);

    return createHash('sha256')
      .update(`${normalizedUserAgent}-${normalizedIpAddress}`)
      .digest('hex');
  }

  private static normalizeUserAgent(userAgent: string): string {
    if (!userAgent || userAgent.trim() === '') {
      return 'unknown';
    }
    return userAgent.toLowerCase().trim();
  }

  private static normalizeIpAddress(ipAddress: string): string {
    if (!ipAddress || ipAddress.trim() === '') {
      return 'unknown';
    }

    if (ipAddress === '::1') {
      return '127.0.0.1';
    }

    return ipAddress.trim();
  }
}
