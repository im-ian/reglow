import { bootstrapApplication } from '@angular/platform-browser';
import { defineElements } from '@reglow/elements';
import { RgBadgeElement } from '@reglow/elements/components/badge';
import { RgButtonElement } from '@reglow/elements/components/button';
import { RgInputElement } from '@reglow/elements/components/input';
import { RgRatingElement } from '@reglow/elements/components/rating';
import { RgSelectElement } from '@reglow/elements/components/select';
import { RgSwitchElement } from '@reglow/elements/components/switch';

import { App } from './app/app';
import { appConfig } from './app/app.config';

defineElements([
  { tagName: RgBadgeElement.tagName, constructor: RgBadgeElement },
  { tagName: RgButtonElement.tagName, constructor: RgButtonElement },
  { tagName: RgInputElement.tagName, constructor: RgInputElement },
  { tagName: RgRatingElement.tagName, constructor: RgRatingElement },
  { tagName: RgSelectElement.tagName, constructor: RgSelectElement },
  { tagName: RgSwitchElement.tagName, constructor: RgSwitchElement },
]);

bootstrapApplication(App, appConfig).catch((error: unknown) => {
  console.error(error);
});
