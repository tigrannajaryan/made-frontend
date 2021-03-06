import { ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { StripeService } from '~/payment/stripe.service';

import { AuthProcessState } from '~/shared/storage/auth-process-state';
import { DataStore } from '~/shared/storage/data-store';

import { AuthService } from '~/shared/api/auth.api';
import { NotificationsApi } from '~/shared/push/notifications.api';

import { AppointmentsApi } from '~/core/api/appointments.api';
import { AppointmentsDataStore } from '~/core/api/appointments.datastore';

import { BookingApi } from '~/core/api/booking.api';
import { BookingApiMock } from '~/core/api/booking.api.mock';
import { BookingData } from '~/core/api/booking.data';
import { FollowersApi } from '~/core/api/followers.api';
import { PaymentsApi } from '~/core/api/payments.api';
import { PreferredStylistsData } from '~/core/api/preferred-stylists.data';
import { ProfileApi } from '~/core/api/profile-api';
import { ServicesService } from '~/core/api/services.service';
import { StylistsService } from '~/core/api/stylists.service';

import { AppModule } from '~/app.module';
import { ProfileDataStore } from '~/profile/profile.data';

/**
 * Common data module that includes singletons for the entire app.
 */

@NgModule({
  imports: [
    IonicModule
  ],
  // Add API service providers in the 'providers' array here
  providers: [
    // services
    AppointmentsApi,
    AuthService,
    BookingApi,
    BookingApiMock,
    FollowersApi,
    NotificationsApi,
    PaymentsApi,
    ProfileApi,
    ServicesService,
    StylistsService
  ]
})
export class DataModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DataModule,
      // Add singletons in the 'providers' array here. Note: do not add these providers anywhere else in
      // 'providers' property of any other module, otherwise you will have duplicate objects instead
      // of singletons.
      providers: [
        StripeService,

        AppointmentsDataStore,
        AuthProcessState,
        BookingData,
        PreferredStylistsData,
        ProfileDataStore
      ]
    };
  }
}

/**
 * Clear cached content of all data stores. Normally used by Logout or Login actions
 * to make sure we don't have stale data (e.g. if we need to login using a different user).
 * Note that this uses DataStore.reinit() method which clears cache and invalidates
 * all subscribed observers. If you have an observer that you want to continue receiving
 * updates to the data changes you must subscribe to the corresponding DataStore observable
 * again after calling this function.
 */
export async function clearAllDataStores(): Promise<void> {
  // Get all data store classes:
  const dataStores = DataModule.forRoot().providers;
  // Require one by one and clear it’s data:
  for (const storeClass of dataStores) {
    const store = AppModule.injector.get(storeClass);
    if (store instanceof DataStore) {
      await store.reinit();
    } else {
      // Search for DataStore as a prop and call DataStore.prototype.clear on it:
      for (const propName of Object.getOwnPropertyNames(store)) {
        const prop = store[propName];
        if (prop instanceof DataStore) {
          await prop.reinit();
        }
      }
    }
  }
}
