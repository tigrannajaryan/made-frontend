import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

import { ApiError } from '~/shared/api-errors';
import { RequestState } from '~/shared/api/request.models';
import { ServiceModel } from '~/shared/api/price.models';
import { ServiceCategoryModel } from '~/core/api/services.models';

export enum servicesActionTypes {
  GET_STYLIST_SERVICES = 'SERVICES_GET_STYLIST_SERVICES',
  GET_STYLIST_SERVICES_LOADING = 'SERVICES_GET_STYLIST_SERVICES_LOADING',
  GET_STYLIST_SERVICES_ERROR = 'SERVICES_GET_STYLIST_SERVICES_ERROR',
  GET_STYLIST_SERVICES_SUCCESS = 'SERVICES_GET_STYLIST_SERVICES_SUCCESS'
}

export class GetStylistServicesAction implements Action {
  readonly type = servicesActionTypes.GET_STYLIST_SERVICES;
  constructor(public stylistUuid: string) {}
}

export class GetStylistServicesLoadingAction implements Action {
  readonly type = servicesActionTypes.GET_STYLIST_SERVICES_LOADING;
}

export class GetStylistServicesErrorAction implements Action {
  readonly type = servicesActionTypes.GET_STYLIST_SERVICES_ERROR;
  constructor(public error: ApiError) {}
}

export class GetStylistServicesSuccessAction implements Action {
  readonly type = servicesActionTypes.GET_STYLIST_SERVICES_SUCCESS;
  constructor(
    public stylistUuid: string,
    public serviceCategories: ServiceCategoryModel[]
  ) {}
}

type Actions =
  | GetStylistServicesAction
  | GetStylistServicesLoadingAction
  | GetStylistServicesErrorAction
  | GetStylistServicesSuccessAction;

export interface ServicesState {
  stylistUuid?: string;
  serviceCategories?: ServiceCategoryModel[];

  requestState: RequestState;
  error?: ApiError;
}

const initialState = {
  requestState: RequestState.NotStarted
};

export function servicesReducer(state: ServicesState = initialState, action: Actions): ServicesState {
  switch (action.type) {
    case servicesActionTypes.GET_STYLIST_SERVICES:
      return {
        ...state,
        requestState: RequestState.NotStarted,
        error: undefined
      };

    case servicesActionTypes.GET_STYLIST_SERVICES_LOADING:
      return {
        ...state,
        requestState: RequestState.Loading
      };

    case servicesActionTypes.GET_STYLIST_SERVICES_ERROR:
      return {
        ...state,
        requestState: RequestState.Failed,
        error: action.error
      };

    case servicesActionTypes.GET_STYLIST_SERVICES_SUCCESS:
      return {
        ...state,
        stylistUuid: action.stylistUuid,
        serviceCategories: action.serviceCategories,
        requestState: RequestState.Succeeded
      };

    default:
      return state;
  }
}

export const servicesPath = 'services';

const selectServicesFromState = createFeatureSelector<ServicesState>(servicesPath);

export const selectServicesRequestState = createSelector(
  selectServicesFromState,
  (state: ServicesState): RequestState => state.requestState
);

export const selectRequestedStylistUuid = createSelector(
  selectServicesFromState,
  (state: ServicesState): string | undefined => state.stylistUuid
);

export const selectStylistServiceCategories = (stylistUuid: string) => createSelector(
  selectServicesFromState,
  (state: ServicesState): ServiceCategoryModel[] | undefined => {
    if (stylistUuid !== state.stylistUuid) {
      return undefined;
    }
    return (
      state.serviceCategories &&
      state.serviceCategories
        .filter((category: ServiceCategoryModel) => category.services.length > 0)
    );
  }
);

export const selectStylistCategory = (stylistUuid: string, categorytUuid: string) => createSelector(
  selectStylistServiceCategories(stylistUuid),
  (categories?: ServiceCategoryModel[]): ServiceCategoryModel | undefined =>
    categories && categories.find((category: ServiceCategoryModel) => category.uuid === categorytUuid)
);

export const selectStylistCategoryServices = (stylistUuid: string, categorytUuid: string) => createSelector(
  selectStylistCategory(stylistUuid, categorytUuid),
  (category?: ServiceCategoryModel): ServiceModel[] | undefined => category && category.services
);
