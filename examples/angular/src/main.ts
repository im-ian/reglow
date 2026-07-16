import { bootstrapApplication } from '@angular/platform-browser';
import '@reglow/elements/register';

import { App } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((error: unknown) => {
  console.error(error);
});
