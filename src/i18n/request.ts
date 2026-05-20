// =============================================================================
// i18n: Basic Configuration for next-intl
// =============================================================================
// This file provides the foundation for internationalization.
// Expand this as needed with locale detection, routing, etc.
//
// For a full setup guide, see:
// https://next-intl.dev/docs/getting-started/app-router
// =============================================================================

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
  // For now, use a static locale. In a full setup, you would
  // detect the locale from the URL, cookies, or Accept-Language header.
  const locale = 'en';

  return {
    locale,
    messages: (await import(`@/i18n/messages/${locale}.json`)).default,
  };
});
