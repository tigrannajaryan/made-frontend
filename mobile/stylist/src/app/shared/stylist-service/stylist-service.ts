import * as moment from 'moment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiService } from '../base-api-service';
import { ServiceItem, ServicesTemplate, ServiceTemplateSet, StylistProfile } from './stylist-models';
import { Logger } from '../logger';
import { ServerStatusTracker } from '../server-status-tracker';

import { DiscountsApi } from '~/discounts/discounts.api';
import { WorktimeApi } from '~/worktime/worktime.api';

export interface ServicesResponse {
  services: ServiceItem[];
}

export interface ServiceTemplatesResponse {
  service_templates: ServicesTemplate[];
}

export interface ServiceTemplateSetResponse {
  template_set: ServiceTemplateSet;
}

/**
 * StylistServiceProvider provides authentication against server API.
 * The service requires the current user to be authenticated using
 * AuthServiceProvider.
 */
@Injectable()
export class StylistServiceProvider extends BaseApiService {
  discountsApi: DiscountsApi;
  worktimeApi: WorktimeApi;

  constructor(
    public http: HttpClient,
    public logger: Logger,
    protected serverStatus: ServerStatusTracker) {
    super(http, logger, serverStatus);

    this.discountsApi = new DiscountsApi(http, logger, serverStatus);
    this.worktimeApi = new WorktimeApi(http, logger, serverStatus);
  }

  /**
   * Set the profile of the stylist. The stylist must be already authenticated as a user.
   */
  async setProfile(data: StylistProfile): Promise<StylistProfile> {
    return this.post<StylistProfile>('stylist/profile', data);
  }

  /**
   * Get the profile of the stylist. The stylist must be already authenticated as a user.
   */
  async getProfile(): Promise<StylistProfile> {
    return this.get<StylistProfile>('stylist/profile');
  }

  /**
   * Get data for stylist settings screen stylist. The stylist must be already authenticated as a user.
   */ // TODO: should be removed after the API is implemented
  async getStylistSummary(): Promise<any> {
    return Promise.all([
      this.getProfile(),
      this.getStylistServices(),
      this.worktimeApi.getWorktime(),
      this.discountsApi.getDiscounts()
    ]).then(([profile, services, worktime, discounts]) => {
      return {
        profile,
        services: {
          services:
            services.services
              .slice(0, 3)
              .map(({name, base_price}) => ({
                name,
                regular_price: base_price,
                today_price: base_price,
              })),
          count: services.services.length,
        },
        worktime:
          worktime.weekdays
            .filter(({is_available}) => is_available)
            .map(({label, work_end_at, work_start_at}) => ({
              day: label,
              working_hours: `${moment(work_start_at, 'HH:mm:ss').format('HH:mm')} – ${moment(work_end_at, 'HH:mm:ss').format('HH:mm')}`,
              slots: '',
            }))
      };
    });
  }

  /**
   * Get default service Templates. The stylist must be already authenticated as a user.
   */
  async getServiceTemplateSets(): Promise<ServiceTemplatesResponse> {
    return this.get<ServiceTemplatesResponse>('stylist/service-template-sets');
  }

  /**
   * Get default service Templates by Id. The stylist must be already authenticated as a user.
   */
  async getServiceTemplateSetById(uuid: string): Promise<ServiceTemplateSetResponse> {
    return this.get<ServiceTemplateSetResponse>(`stylist/service-template-sets/${uuid}`);
  }

  /**
   * Get stylist services. The stylist must be already authenticated as a user.
   */
  async getStylistServices(): Promise<ServicesResponse> {
    return this.get<ServicesResponse>('stylist/services');
  }

  /**
   * Set service to stylist. The stylist must be already authenticated as a user.
   */
  async setStylistServices(data: any): Promise<ServiceItem> {
    return this.post<ServiceItem>('stylist/services', data);
  }

  /**
   * Deletes service of a stylist. The stylist must be already authenticated as a user.
   */
  async deleteStylistService(id: number): Promise<ServiceItem> {
    return this.delete<ServiceItem>(`stylist/services/${id}`);
  }
}
