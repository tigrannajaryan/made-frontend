import { $ } from 'protractor';

import { click, waitFor, waitForNot } from '../shared-e2e/utils';
import { selectServiceListPage } from './select-service-list-page';
import { servicesPage } from './services-page';

/**
 * Profile page definition
 */
class ProfilePage {
  // UI element declarations
  get getProfileEditTab() { return $('page-profile [data-test-id=ProfileEditTab]'); }
  get getProfileEditAccountInfoHoursBtn() { return $('page-profile [data-test-id=ProfileEditAccountInfoHours]'); }
  get getProfileEditAccountInfoServiceBtn() { return $('page-profile [data-test-id=ProfileEditAccountInfoService]'); }
  get getProfileEditAccountInfoDiscountsBtn() { return $('page-profile [data-test-id=ProfileEditAccountInfoDiscounts]'); }
  get getEducationalNextBtn() { return $('educational-popup [data-test-id=educational_next]'); }
  get getEducationalGotItBtn() { return $('educational-popup [data-test-id=educational_gotIt]'); }

  // Operations
  async goToHoursPage() {
    await waitFor(profilePage.getProfileEditTab);
    await click(profilePage.getProfileEditAccountInfoHoursBtn);
  }
  async goToServicePage() {
    await waitFor(profilePage.getProfileEditTab);
    await click(profilePage.getProfileEditAccountInfoServiceBtn);
    await waitFor(selectServiceListPage.getSelectSetButton(0));
    await click(selectServiceListPage.getSelectSetButton(0));
    await waitForNot(selectServiceListPage.getSelectSetButton(0));
    await waitFor(servicesPage.continueButton);
    await click(servicesPage.continueButton);
    await waitForNot(servicesPage.continueButton);
  }
  async goToDiscountsPage() {
    await waitFor(profilePage.getProfileEditTab);
    await click(profilePage.getProfileEditAccountInfoDiscountsBtn);
  }
  async watchEducationalPopup() {
    await waitFor(profilePage.getEducationalNextBtn);
    await click(profilePage.getEducationalNextBtn);
    await click(profilePage.getEducationalNextBtn);
    await click(profilePage.getEducationalNextBtn);
    await click(profilePage.getEducationalGotItBtn);
    await waitForNot(profilePage.getEducationalNextBtn);
  }
}

export const profilePage = new ProfilePage();
