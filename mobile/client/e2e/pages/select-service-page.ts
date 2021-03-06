import { $, by } from 'protractor';
import { click, firstVisible, waitForNot } from '../shared-e2e/utils';

class SelectServicePage {
  // UI element declarations.
  get categoryName() {
    return firstVisible(by.css('page-services [data-test-id=categoryName]'));
  }

  serviceRow(serviceName: string) {
    return firstVisible(by.css(`page-services [data-test-id=service${serviceName}]`));
  }

  servicePrice(serviceName: string) {
    return firstVisible(by.css(`page-services [data-test-id=service${serviceName}] [data-test-id=servicePrice]`));
  }

  // Operations
  async selectService(serviceName: string) {
    await click(this.serviceRow(serviceName));
    await waitForNot(this.serviceRow(serviceName));
  }
}

export const selectServicePage = new SelectServicePage();
