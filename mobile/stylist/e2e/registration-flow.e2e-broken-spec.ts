import { browser } from 'protractor';
import * as faker from 'faker';

import { getRandomNumber, getRandomString, waitFor, waitForNot, globals, click } from './shared-e2e/utils';
import { almostDonePage } from './shared-e2e/almost-done-page';
import { howPricingWorksPage } from './shared-e2e/how-pricing-works-page';

import { logregPage } from './pages/logreg-page';
import { profilePage } from './pages/profile-page';
import { welcomeToMadePage } from './pages/welcome-to-made-page';
import { firstPage } from './pages/first-page';
import { servicesPage } from './pages/services-page';
import { worktimePage } from './pages/worktime-page';
import { discountsWeekdayPage } from './pages/discounts-weekday-page';
import { discountsRevisitPage } from './pages/discounts-revisit-page';
import { discountsFirstVisitPage } from './pages/discounts-first-visit-page';
import { invitationsPage } from './pages/invitations-page';
import { selectServiceListPage } from './pages/select-service-list-page';
import { mainTabsPage } from './pages/main-tabs-page';

describe('Registration Flow', () => {

  const email = `${getRandomString(15)}-test@madebeauty.com`;
  const password = getRandomString(10);
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const salonName = faker.company.companyName(0);
  const address = faker.address.streetAddress();
  const phoneNumber = getRandomNumber(10);
  const instagramName = getRandomString(8);
  const websiteName = getRandomString(8);

  it('should be able to start registration', async () => {
    browser.get('');
    await waitFor(firstPage.registerLink);

    // Client the register link
    await firstPage.navigateToRegister();

    // Register using email and password
    await logregPage.register(email, password);
    await waitForNot(logregPage.registerBtn);
  });

  it('should be able to fill registration form', async () => {
    await waitForNot(globals.ionLoading);

    // We should arive to profile screen, check it.
    await waitFor(profilePage.continueButton);

    expect(profilePage.takePhotoBtn.isPresent()).toBeTruthy();
    expect(profilePage.firstNameInput.isPresent()).toBeTruthy();
    expect(profilePage.lastNameInput.isPresent()).toBeTruthy();
    expect(profilePage.salonNameInput.isPresent()).toBeTruthy();
    expect(profilePage.salonAddressInput.isPresent()).toBeTruthy();
    expect(profilePage.phoneNumberInput.isPresent()).toBeTruthy();
    expect(profilePage.instagramNameInput.isPresent()).toBeTruthy();
    expect(profilePage.websiteInput.isPresent()).toBeTruthy();
    expect(profilePage.continueButton.isPresent()).toBeTruthy();
    expect(profilePage.continueButton.isEnabled()).toBeFalsy();

    // Fill registration form
    await profilePage.fillForm(firstName, lastName, salonName, address, phoneNumber, instagramName, websiteName);

    await profilePage.submitForm();
  });

  it('can navigate through Welcome To Made page', async () => {
    await welcomeToMadePage.continue();
  });

  it('can navigate through How pricing works page', async () => {
    await howPricingWorksPage.continue();
  });

  it('should show service list selection', async () => {

    expect(selectServiceListPage.getServiceSetName(0).getText()).toEqual('Naturally Straight Hair');
    expect(selectServiceListPage.getServiceSetName(1).getText()).toEqual('Naturally Curly Hair');

    expect(selectServiceListPage.getServiceCountText(0).getText()).toMatch(/\d Services/);
    expect(selectServiceListPage.getServiceCountText(1).getText()).toMatch(/\d Services/);

    await selectServiceListPage.selectSet(0);
  });

  it('should see list of services', async () => {
    const set1CategoryNames = ['', 'Color', 'Conditioners', 'Cuts', '', 'Special Occassions', 'Treatments', 'Wash and Style'];
    // TODO: verify set #2
    // const set2categoryNames = ['', 'Color', 'Conditioners', 'Cuts', 'Special Occasions', 'Treatments', 'Wash and Style'];

    for (let i = 0; i < set1CategoryNames.length; i++) {
      expect(servicesPage.getCategoryName(i).getText()).toEqual(set1CategoryNames[i]);
      const expectedMinServiceCount = set1CategoryNames[i] ? 1 : 0;
      expect(servicesPage.getServicesInCategory(i).count()).toBeGreaterThanOrEqual(
        expectedMinServiceCount,
        `Incorrect service count for category #${i}: ${set1CategoryNames[i]}`);
    }

    await servicesPage.continue();
  });

  it('can toggle week days on Worktime page', async () => {
    await worktimePage.toggleWeekDay(0, 5); // toggle Sat
    await worktimePage.toggleWeekDay(0, 6); // toggle Sun
    await worktimePage.continue();
  });

  it('should show Weekday Discounts page', async () => {
    await discountsWeekdayPage.continue();
  });

  it('should show Revisit Discounts page', async () => {
    await discountsRevisitPage.continue();
  });

  it('should show First Visit Discounts page', async () => {
    await discountsFirstVisitPage.continue();
  });

  it('should show Invitations page', async () => {
    await invitationsPage.skip();
  });

  it('should show Almost Done page', async () => {
    await almostDonePage.continue();
  });

  it('should see Congratulations message', async () => {
    waitFor(globals.alertSubtitle);
    expect(globals.alertSubtitle.getText()).toContain('Congratulations! Your registration is complete.');

    const alertButton = globals.alertButton('Dismiss');
    click(alertButton);
    waitForNot(alertButton);

    waitFor(mainTabsPage.homeTab);
  });
});