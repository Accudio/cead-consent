# Cead Consent Manager

Cead ([pronounced kee-yed](http://ipa-reader.xyz/?text=kjed%CC%AA%CC%8A%20))is a cookie and tracking consent manager that is extremely simple and lightweight. It is designed to help websites implement a simple Accept or Deny dialog that will actually enable or disable tracking.

Many websites implement a notice that doesn't allow opt-out, some offer an option that does nothing, whilst others only offer an opt-out solution - conveniently after they've collected all of your data.
Cead helps you fix this, allowing you to meet your privacy obligations with little effort or code. In opt-in mode, tracking scripts won't even run until consent is given. In opt-out mode withdrawing consent will clear tracking cookies entirely.

Cead is primarily created in response an increase in unsolicited web surveillance, but also to assist with meeting the standards of regulation including the EU GDPR &amp; ePrivacy and California's CCPA. As privacy legislation becomes more strict it's important that solutions offer compliant opt-in and opt-out controls which Cead offers at it's core.

*Note:* I am not a lawyer, and Cead isn't a magic fix for privacy compliance. When implemented correctly it meets commonly-understood privacy standards, but you may need legal advice for your specific usecase.

## Features

- ***Simple*** — Most sites don't need a fancy system with different purposes, just a simple opt-in/opt-out that can be used for all tracking and cookies;
- ***Lightweight*** — Weighs in at just 3.3kB minified and 1.9kB gzip;
- ***Flexible*** — HTML is provided by you so all text and classes are fully configurable, with lots of options on attributes, cookie name and mode in the JavaScript;
- ***Standalone*** — Entirely self-contained, Cead doesn't link with any complex external system or have hundreds of dependencies;
- ***Open Source*** — Free to use, modify and extend as you'd like! Licensed under the permissive Apache-2.0 license.

I wrote a blog post giving an [introduction to and basic tutorial getting started with Cead Consent](https://alistairshepherd.uk/writing/cead-consent/).

## Table of Contents

1. [Installation](#installation)
   1. [NPM Install](#npm-install-and-import-advanced)
1. [Managing tracking scripts and images](#managing-tracking-scripts-and-images)
   1. [External Scripts](#external-scripts)
   1. [Inline Scripts](#inline-scripts)
   1. [Image Pixels](#image-pixels)
1. [Managing Cookies](#managing-cookies)
1. [Events](#events)
1. [Options](#options)
1. [Examples](#examples)
   1. [Google Analytics (gtag.js)](#google-analytics-gtagjs)
   1. [Google Tag Manager](#google-tag-manager)
   1. [Facebook Pixel](#facebook-pixel)
   1. [Matomo / Piwik](#matomo--piwik)
   1. [LinkedIn Insights](#linkedIn-insights)
   1. [Hubspot Analytics](#hubspot-analytics)
   1. [Fathom Analytics](#fathom-analytics)
   1. [Plausible Analytics](#plausible-analytics)
1. [Changelog](#changelog)
1. [License, Copyright and Credits](#license-copyright-and-credits)

## Installation

The easiest way to install Cead is to link to the [browser.js](https://github.com/Accudio/cead-consent/blob/main/dist/browser.js) script and [cead.css](https://github.com/Accudio/cead-consent/blob/main/dist/cead.css) stylesheet, and include the required HTML manually in your document.
You can download them from the [dist/](https://github.com/Accudio/cead-consent/blob/main/dist/) folder of the repo or you can use an asset CDN like [JSDelivr](https://www.jsdelivr.com) as below.

```html
<html>
  <head>
    <!-- include the CSS in the <head> of your html -->
    <link rel="stylesheet" href="/cead.css">
    <!--<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/cead-consent@1/dist/cead.css">-->
  </head>

  <body>
    <!-- cead required markup, insert before your page content -->
    <!-- you can customise the content of the <p> element and buttons as you'd like, just keep the classes -->
    <div class="cead" role="region" aria-label="Cookie consent">
      <p>Hi! Could we please enable some services and cookies to improve your experience and our website?</p>
      <div class="cead__btns">
        <button class="cead__btn cead__btn--decline">No, thanks.</button>
        <button class="cead__btn cead__btn--accept">Okay!</button>
      </div>
    </div>

    <!-- your page content -->

    <!-- set your options as an object on window.cead before loading cead -->
    <script>
      window.cead = {
        cookie: 'consent'
      }
    </script>
    <!-- include the browser.js file before the closing </body> -->
    <script src="/browser.js"></script>
    <!--<script src="https://cdn.jsdelivr.net/npm/cead-consent@1/dist/browser.js"></script>-->
  </body>
</html>
```

### NPM Install and Import (advanced)

Cead can also be [installed via NPM](https://www.npmjs.com/package/cead-consent) and imported via your build tool.

```bash
npm install cead-consent
```

```js
import Cead from 'cead-consent'
new Cead({
  cookie: 'consent'
})
```

Default styles are provided in `dist/cead.css` or source styles in `src/sass/cead.scss` but you are free to provide your own.

You will need to add your own markup, the below is provided as an example.
The only required classes are `.cead` for the container and `.cead__btn--decline` & `.cead__btn--accept` for the buttons.

```html
<div class="cead" role="region" aria-label="Cookie consent">
  <p>Hi! Could we please enable some services and cookies to improve your experience and our website?</p>
  <div class="cead__btns">
    <button class="cead__btn cead__btn--decline">No, thanks.</button>
    <button class="cead__btn cead__btn--accept">Okay!</button>
  </div>
</div>
```

## Managing tracking scripts and images

Cead manages tracking scripts and images by modifying their code slightly so they can only run when Cead allows them to. This will be done instantly if the `default: true` option is set or the user has already consented, otherwise it will wait until consent is received. The attribute used can be customised with the `attr` option but defaults to `data-cead` - which will be used in these examples.

### External scripts

Change the `src` attribute to `data-src` and add the consent attribute.

```html
<script data-src="https://example.com/tracking.js" data-cead></script>
```

### Inline scripts

Add `type="text/plain"` to the `script` tag and add the consent attribute.

```html
<script type="text/plain" data-cead>
  console.log('inline tracking script');
</script>
```

### Image Pixels

Change the `src` attribute to `data-src` and add the consent attribute. If this is a tracking pixel that shouldn't be displayed `display:none` will prevent a missing image icon. If this is to be displayed you can show/hide the image with css as below:

```html
<img data-src="https://example.com/tracking.jpg" data-cead alt="" class="display:none">
```
```css
img[data-cead]:not([src]) {
  display: none;
}
```

## Managing Cookies
When initializing Cead, you can provide a `cookies` option as an array of cookie names or regular expression objects. Upon opting out, Cead will automatically remove any cookies with names listed in this array, or with names matching any of the regular expressions in the array. This prevents trackers from linking user sessions across visits.

Example configuration for Google Analytics and Facebook pixel cookies:

```html
<script>
window.cead = {
  cookies: [
    '_ga',
    '_gid',
    new RegExp('^_fb') // matches all cookies starting with _fb
  ]
}
</script>
```

## Events

For more advanced use-cases you can use Cead's global events to get the tracking state and to watch for changes.

All events provide a `status` property on the event detail which will be true or false depending on the consent status.

Events available:

- `cead:ready` — On initialisation of Cead, after activate/deactivate functionality
- `cead:change` — On click of either the accept or decline button

Example implementation:

```js
// watch for ready
window.addEventListener('cead:ready', e => {
  console.log('cead ready. status:', e.detail.status)
})

// on click
window.addEventListener('cead:change', e => {
  console.log('cead change. new status:', e.detail.status)
})
```

## Public Methods

Cead exposes several methods on the `window.ceadConsent` object for advanced integrations. For example, you can programmatically open or close the consent banner using the `toggleBanner` method.

### `toggleBanner()`

Toggles the visibility of the consent banner. If the banner is currently visible, it will be hidden; if hidden, it will be shown.

**Example:**
```js
window.ceadConsent.toggleBanner();
```

This can be useful if you want to provide users with a way to reopen the consent dialog from a menu or footer link.

## Options

For the browser version, options are set on `window.cead` before loading the script. For the npm version, pass an options object in when calling `new Cead({})`.

All options available:

| Option name | Default value | Description |
| ----------- | ------------- | ----------- |
| `default`   | `false`       | Default state for tracking when a user hasn't made a consent decision. Set to `true` for opt-out mode. |
| `cookie`    | `cead`        | Name of the cookie that stores Cead preferences   |
| `attr`      | `data-cead`   | Attribute set on tracking elements |
| `srcAttr`   | `data-src`    | Attribute for script src. You may need to change this if you use other libraries that use `data-src` |
| `link`      | `#cead`       | Cead will open the consent manager when links with this `href` are clicked. |
| `cookies`   | `[]`          | Array of cookies to remove on opt-out. |

## Examples

Here are some of the major analytics/tracking scripts modified to work with Cead using default options. These are based on the provided code at time of writing but may change.
You should be able to modify any tracking script and image to a format Cead will be able to control. If you have any problems doing so [file an Issue](https://github.com/Accudio/cead-consent/issues/new) and I can take a look.

### Google Analytics (gtag.js)

Replace `GA_MEASUREMENT_ID` with your Analytics ID provided by Google.

Script Tag:

```html
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments)};
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID', {
  'send_page_view': true,
  'anonymize_ip': true
});
</script>
<script async data-src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" data-cead></script>
```

Cookies: `'_ga', '_gid'`

### Google Tag Manager

Replace `GTM_MEASUREMENT_ID` with your Tag Manager ID provided by Google.

Script Tag:

```html
<script>
dataLayer=[];
(function(w,l){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'})})(window,'dataLayer');
</script>
<script async data-src="https://www.googletagmanager.com/gtm.js?id=GTM_MEASUREMENT_ID&l=dataLayer" data-cead></script>
```

Cookies (will depend on tags loaded): `'_ga', '_gid'`

### Facebook Pixel

Replace `FB_PIXEL_ID` with your Pixel ID provided by Facebook.

Script Tag:

```html
<script>
!function(f,n){if(f.fbq){return}n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq){f._fbq=n}n.push=n;n.loaded=!0;n.version='2.0';n.queue=[]
}(window);fbq('init','FB_PIXEL_ID');fbq('track', 'PageView');
</script>
<script async data-src="https://connect.facebook.net/en_US/fbevents.js" data-cead></script>
```

Cookeis: `'_fbp', '_fbc'`

### Matomo / Piwik

Replace `MATOMO_URL` and `MATOMO_SITE` to the URL and Site ID provided by your Matomo install.

Script Tag:

```html
<script>
var _paq = window._paq = window._paq || [];
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
var u="MATOMO_URL/";
_paq.push(['setTrackerUrl', u+'matomo.php']);
_paq.push(['setSiteId', MATOMO_SITE]);
var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
g.setAttribute('data-src', u+'matomo.js');g.setAttribute('data-cead', 'true');
g.async=true;s.parentNode.insertBefore(g,s);
})();
</script>
```

Cookies: `'_pk_ref', '_pk_cvar', '_pk_id', '_pk_ses', '_pk_hsr'`

### LinkedIn Insights

Replace `LI_PARTNER_ID` with your LinkedIn Partner ID.

Script Tag:

```html
<script>_linkedin_data_partner_id = "LI_PARTNER_ID";</script>
<script async data-src="https://snap.licdn.com/li.lms-analytics/insight.min.js" data-cead></script>
```

Cookies: `'li_fat_id'`

### Hubspot Analytics

Replace `HS_TRACKING_ID` with your Hubspot tracking ID.

Script Tag:

```html
<script id="hs-script-loader" async data-src="https://js.hs-scripts.com/HS_TRACKING_ID.js" data-cead></script>
```

Cookies: `'__hstc', '__hssc', '__hssrc'`

### Fathom Analytics

Replace `FATHOM_URL` with the Script URL provided by Fathom and `FATHOM_SITE` with your Fathom site ID.

Script Tag:

```html
<script
  async data-cead
  data-src="FATHOM_URL"
  data-site="FATHOM_SITE"
  data-honor-dnt="true"
></script>]
```

### Plausible Analytics

Replace `PLAUSIBLE_SRC` and `PLAUSIBLE_DOMAIN` with the code source and domain provided by Plausible.

Script Tag:

```html
<script>
(function() {
var tag = document.createElement('script');
tag.async = true;
tag.setAttribute("data-src","PLAUSIBLE_SRC");
tag.setAttribute("data-cead", "true");
tag.setAttribute("data-domain", "PLAUSIBLE_DOMAIN");
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();
</script>
```

---

## Changelog

- 1.1.5 — Enhance cookie removal logic to support regex patterns in config.cookies ([PR #6](https://github.com/Accudio/cead-consent/pull/6) by @rozhnev)
- 1.1.4 — Added `SameSite=Lax` to Cead cookie
- 1.1.3 — Changed `dependencies` for `devDependencies` to prevent unnecessary installs when installed in another project
- 1.1.2 — Changed default files in `package.json` to fix webpack + jsdelivr support
- 1.1.1 — Updated README with correct gtag.js example
- 1.1.0 — Adds custom events, making it a little easier for advanced integrations
- 1.0.1 — Readme and docs update
- 1.0.0 — First stable release and npm publish
- 0.1.0 — Initial development version (August 2021)

## License, Copyright and Credits

This project is licensed under the Apache-2.0 license.

The full license is included at [LICENSE.md](https://github.com/Accudio/cead-consent/blob/main/LICENSE.md), or at [apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0).

Copyright © 2021 [Alistair Shepherd](https://alistairshepherd.uk).
