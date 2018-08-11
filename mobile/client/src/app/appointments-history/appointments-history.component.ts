import { Component, ViewChild } from '@angular/core';
import { IonicPage, Refresher } from 'ionic-angular';
import { Observable } from 'rxjs';

import { Logger } from '~/shared/logger';
import { loading } from '~/core/utils/loading';
import { AppointmentModel, AppointmentsHistoryResponse } from '~/core/api/appointments.models';
import { ApiResponse } from '~/core/api/base.models';
import { AppointmentsDataStore } from '~/core/api/appointments.datastore';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'appointments-history.component.html'
})
export class AppointmentsHistoryComponent {

  // Declare refresher to make it accessible for loading() function
  @ViewChild(Refresher) refresher: Refresher;

  historyObservable: Observable<ApiResponse<AppointmentsHistoryResponse>>;
  isLoading: boolean;

  constructor(
    private dataStore: AppointmentsDataStore,
    private logger: Logger
  ) {
    this.historyObservable = this.dataStore.history.asObservable();
  }

  ionViewWillEnter(): void {
    this.logger.info('HistoryPageComponent.ionViewWillEnter');
    this.onLoad();
  }

  onLoad(): void {
    this.logger.info('HistoryPageComponent.onLoad');

    // Load the data. Indicate loading.
    loading(this, this.dataStore.history.get({ refresh: true }));
  }

  onAppointmentClick(appointment: AppointmentModel): void {
    // TODO: show details of appointment
    this.logger.info('onAppointmentClick', appointment);
  }

  onRebookClick(appointment: AppointmentModel): void {
    // TODO: add rebooking logic when appointment creation flow is implemented
    this.logger.info('onRebookClick', appointment);
  }
}