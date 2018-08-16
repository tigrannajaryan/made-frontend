import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http/src/params';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ENV } from '../../environments/environment.default';
import { Logger } from '~/shared/logger';
import { ApiFieldAndNonFieldErrors, ApiRequestOptions, processApiResponseError } from '~/shared/api-errors';
import { ServerStatusTracker } from '~/shared/server-status-tracker';
import { AppModule } from '~/app.module';

enum HttpContentType {
  ApplicationJson = 'application/json'
}

/**
 * BaseApiService provides basic HTTP API call capability.
 */
@Injectable()
export class BaseApiService {

  protected static isInternalErrorStatus(status: number): boolean {
    return status >= 500 && status <= 599;
  }

  constructor(
    protected http: HttpClient,
    protected logger: Logger,
    protected serverStatus: ServerStatusTracker) {
  }

  protected request<ResponseType>(
    method: string, apiPath: string, data?: any, queryParams?: HttpParams,
    options?: ApiRequestOptions): Promise<ResponseType> {

    // For help on how to use HttpClient see https://angular.io/guide/http

    // Prepare the header and the body
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': HttpContentType.ApplicationJson
      }),
      body: data ? JSON.stringify(data) : undefined,
      params: queryParams
    };

    const url = ENV.apiUrl + apiPath;

    return this.http.request<ResponseType>(method, url, httpOptions)
      .toPromise()
      .catch(e => {
        this.processResponseError(e, method, url, options);
        throw e;
      });
  }

  protected processResponseError(error: any, method: string, url: string, options?: ApiRequestOptions): void {
    this.logger.error(`Error in response to API request ${method.toUpperCase()} ${url} failed:`, JSON.stringify(error));

    const apiError = processApiResponseError(error);

    // Check if the caller requested to suppress ApiFieldAndNonFieldErrors generic handling, don't notify tracker
    const notifyTracker = !(apiError instanceof ApiFieldAndNonFieldErrors &&
      options && options.hideGenericAlertOnFieldAndNonFieldErrors);

    if (!notifyTracker) {
      // there is a server status error, notify status tracker about it
      const serverStatus = AppModule.injector.get(ServerStatusTracker);
      serverStatus.notify(apiError);
    }

    // and throw an error for callers to catch and process
    throw apiError;
  }

  protected get<ResponseType>(apiPath: string, queryParams?: HttpParams, options?: ApiRequestOptions): Promise<ResponseType> {
    return this.request<ResponseType>('get', apiPath, undefined, queryParams, options);
  }

  protected post<ResponseType>(apiPath: string, data: any, options?: ApiRequestOptions): Promise<ResponseType> {
    return this.request<ResponseType>('post', apiPath, data, undefined, options);
  }

  protected patch<ResponseType>(apiPath: string, data: any, options?: ApiRequestOptions): Promise<ResponseType> {
    return this.request<ResponseType>('patch', apiPath, data, undefined, options);
  }

  protected delete<ResponseType>(apiPath: string, options?: ApiRequestOptions): Promise<ResponseType> {
    return this.request<ResponseType>('delete', apiPath, undefined, undefined, options);
  }

  uploadFile<ResponseType>(formData: FormData): Promise<ResponseType> {
    const url = `${ENV.apiUrl}common/image/upload`;

    return this.http.post<ResponseType>(url, formData)
      .toPromise()
      .catch(e => {
        this.logger.error('API request failed:', JSON.stringify(e));
        throw e;
      });
  }
}
