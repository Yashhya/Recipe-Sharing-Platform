// Condensed comment block.

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    // Provides the Angular Router with our defined routes
    provideRouter(routes),

    // Provides HttpClient with our JWT auth interceptor
    provideHttpClient(withInterceptors([authInterceptor])),

    // Enables Angular Material animations
    provideAnimationsAsync(),

    // Provide generic charts
    provideCharts(withDefaultRegisterables())
  ]
};
