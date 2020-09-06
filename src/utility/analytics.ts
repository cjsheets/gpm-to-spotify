export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

declare global {
  interface Window {
    _paq: any;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window._paq.push(['setCustomUrl', url]);
  window._paq.push(['setDocumentTitle', 'My New Title']);

  // remove all previously assigned custom variables, requires Matomo (formerly Piwik) 3.0.2
  window._paq.push(['deleteCustomVariables', 'page']);
  window._paq.push(['setGenerationTimeMs', 0]);
  window._paq.push(['trackPageView']);

  // make Matomo aware of newly added content
  var content = document.getElementById('content');
  window._paq.push(['MediaAnalytics::scanForMedia', content]);
  window._paq.push(['FormAnalytics::scanForForms', content]);
  window._paq.push(['trackContentImpressionsWithinNode', content]);
  window._paq.push(['enableLinkTracking']);
};
