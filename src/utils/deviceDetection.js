/**
 * Device & Browser Detection Utility
 * Comprehensive, production-grade platform detection logic.
 */

export function detectDevice() {
  if (typeof window === 'undefined') {
    return {
      isIOS: false,
      isAndroid: false,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      browserName: 'Unknown',
      deviceType: 'Desktop',
      platform: 'Desktop',
      osName: 'Unknown',
      osVersion: 'Unknown',
      screenResolution: '0x0',
      pixelRatio: 1,
      orientation: 'portrait',
      hasTouch: false,
      hasSafeArea: false,
    };
  }

  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const platform = navigator.platform || '';
  const maxTouchPoints = navigator.maxTouchPoints || 0;

  // 1. iOS Detection (handles modern iPadOS identifying as MacIntel with touch)
  const isIPhone = /iPhone/i.test(ua);
  const isIPod = /iPod/i.test(ua);
  const isIPadUA = /iPad/i.test(ua);
  // iPadOS 13+ detection: reports MacIntel but has touch points
  const isIPadOS = (platform === 'MacIntel' || platform === 'Macintosh') && maxTouchPoints > 1;
  const isIOS = isIPhone || isIPod || isIPadUA || isIPadOS;

  // 2. Android Detection
  const isAndroid = /Android/i.test(ua);

  // 3. Tablet & Mobile Classification
  const isTablet = isIPadUA || isIPadOS || (isAndroid && !/Mobile/i.test(ua)) || /Tablet/i.test(ua);
  const isMobile = (isIPhone || isIPod || (isAndroid && /Mobile/i.test(ua)) || /Windows Phone/i.test(ua)) && !isTablet;
  const isDesktop = !isIOS && !isAndroid && !isMobile && !isTablet;

  // 4. Detailed Device Type String
  let deviceType = 'Desktop';
  if (isIPhone) {
    // Attempt specific model estimation by screen size if available
    const w = Math.min(window.screen.width, window.screen.height);
    const h = Math.max(window.screen.width, window.screen.height);
    if (w === 430 && h === 932) deviceType = 'iPhone 15/14 Pro Max';
    else if (w === 393 && h === 852) deviceType = 'iPhone 15/14 Pro';
    else if (w === 390 && h === 844) deviceType = 'iPhone 14/13/12';
    else if (w === 375 && h === 812) deviceType = 'iPhone X/XS/11 Pro/13 mini';
    else if (w === 414 && h === 896) deviceType = 'iPhone 11/XR/11 Pro Max';
    else if (w === 375 && h === 667) deviceType = 'iPhone SE / 8 / 7';
    else deviceType = 'iPhone';
  } else if (isIPadUA || isIPadOS) {
    deviceType = 'iPad';
  } else if (isAndroid) {
    if (isTablet) {
      deviceType = 'Android Tablet';
    } else {
      if (/Samsung/i.test(ua) || /SM-/i.test(ua)) deviceType = 'Samsung Galaxy';
      else if (/Pixel/i.test(ua)) deviceType = 'Google Pixel';
      else if (/OnePlus/i.test(ua)) deviceType = 'OnePlus';
      else if (/Xiaomi|Redmi|POCO/i.test(ua)) deviceType = 'Xiaomi';
      else if (/Realme/i.test(ua)) deviceType = 'Realme';
      else if (/OPPO/i.test(ua)) deviceType = 'Oppo';
      else if (/vivo/i.test(ua)) deviceType = 'Vivo';
      else deviceType = 'Android Phone';
    }
  } else if (/Mac/i.test(platform)) {
    deviceType = 'Mac Desktop';
  } else if (/Win/i.test(platform)) {
    deviceType = 'Windows PC';
  } else if (/Linux/i.test(platform)) {
    deviceType = 'Linux Desktop';
  }

  // 5. Browser Detection
  let browserName = 'Other';
  if (/SamsungBrowser/i.test(ua)) {
    browserName = 'Samsung Internet';
  } else if (/Edg|EdgiOS|EdgA/i.test(ua)) {
    browserName = 'Microsoft Edge';
  } else if (/FxiOS|Firefox/i.test(ua)) {
    browserName = 'Firefox';
  } else if (/OPR|Opera/i.test(ua)) {
    browserName = 'Opera';
  } else if (/CriOS/i.test(ua)) {
    browserName = 'Chrome (iOS)';
  } else if (/Chrome/i.test(ua) && !/Chromium|Edg|OPR/i.test(ua)) {
    browserName = 'Chrome';
  } else if (/Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|Edg/i.test(ua)) {
    browserName = 'Safari';
  } else if (isIOS) {
    // WebKit fallback for iOS in-app browsers or custom webviews
    browserName = 'Safari WebKit';
  }

  // 6. OS Name & Version Extraction
  let osName = 'Unknown OS';
  let osVersion = 'Unknown';

  if (isIOS) {
    osName = isIPadOS && !isIPhone ? 'iPadOS' : 'iOS';
    const match = ua.match(/OS (\d+[_.]\d+([_.]\d+)?)/i);
    if (match) {
      osVersion = match[1].replace(/_/g, '.');
    } else if (isIPadOS) {
      osVersion = '13+';
    }
  } else if (isAndroid) {
    osName = 'Android';
    const match = ua.match(/Android\s+([\d.]+)/i);
    if (match) {
      osVersion = match[1];
    }
  } else if (/Mac/i.test(ua) || /Mac/i.test(platform)) {
    osName = 'macOS';
    const match = ua.match(/Mac OS X\s+([\d_]+)/i);
    if (match) {
      osVersion = match[1].replace(/_/g, '.');
    }
  } else if (/Windows/i.test(ua) || /Win/i.test(platform)) {
    osName = 'Windows';
    if (/NT 10.0/i.test(ua)) osVersion = '10 / 11';
    else if (/NT 6.3/i.test(ua)) osVersion = '8.1';
    else if (/NT 6.2/i.test(ua)) osVersion = '8';
    else if (/NT 6.1/i.test(ua)) osVersion = '7';
  } else if (/Linux/i.test(platform)) {
    osName = 'Linux';
  }

  // 7. Screen & Capabilities
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const height = window.innerHeight || document.documentElement.clientHeight || 0;
  const screenResolution = `${window.screen.width}x${window.screen.height} (Viewport: ${width}x${height})`;
  const pixelRatio = window.devicePixelRatio || 1;
  const orientation = width > height ? 'landscape' : 'portrait';
  const hasTouch = ('ontouchstart' in window) || maxTouchPoints > 0;

  // Safe area CSS support check
  const hasSafeArea = isIOS || (typeof CSS !== 'undefined' && CSS.supports && (CSS.supports('padding-top: env(safe-area-inset-top)') || CSS.supports('padding-top: constant(safe-area-inset-top)')));

  const activePlatform = isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop';

  return {
    isIOS,
    isAndroid,
    isMobile,
    isTablet,
    isDesktop,
    browserName,
    deviceType,
    platform: activePlatform,
    osName,
    osVersion,
    screenResolution,
    pixelRatio,
    orientation,
    hasTouch,
    hasSafeArea,
    userAgent: ua,
    maxTouchPoints
  };
}

/**
 * Format device info into standard JSON payload for submit flow
 */
export function createSubmissionPayload(user, customNotes = '') {
  const dev = detectDevice();
  return {
    userId: user?.id || user?.userId || 'guest_user',
    email: user?.email || 'unauthenticated@domain.com',
    platform: dev.platform,
    deviceType: dev.deviceType,
    browser: dev.browserName,
    submittedAt: new Date().toISOString(),
    status: user ? 'authenticated' : 'guest',
    osName: dev.osName,
    osVersion: dev.osVersion,
    screenResolution: dev.screenResolution,
    touchPoints: dev.maxTouchPoints,
    notes: customNotes || `Submitted via ${dev.browserName} on ${dev.deviceType}`
  };
}
