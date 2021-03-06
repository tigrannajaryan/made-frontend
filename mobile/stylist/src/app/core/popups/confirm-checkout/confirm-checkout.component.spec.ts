import { async, ComponentFixture } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { prepareSharedObjectsForTests } from 'app/core/test-utils.spec';
import { ConfirmCheckoutComponent } from '~/core/popups/confirm-checkout/confirm-checkout.component';
import { TestUtils } from '../../../../test';
import { HomeService } from '~/core/api/home.service';

let fixture: ComponentFixture<ConfirmCheckoutComponent>;
let instance: ConfirmCheckoutComponent;
describe('Pages: ConfirmCheckoutComponent', () => {

  prepareSharedObjectsForTests();

  // TestBed.createComponent(ProfileComponent) inside
  // see https://angular.io/guide/testing#component-class-testing for more info
  beforeEach(async(() => TestUtils.beforeEachCompiler([
    ConfirmCheckoutComponent
  ], [DatePipe, HomeService], [HttpClientTestingModule]).then(compiled => {
    fixture = compiled.fixture; // https://angular.io/api/core/testing/ComponentFixture
    instance = compiled.instance;
  })));

  it('component should be created', () => {
    expect(instance)
      .toBeTruthy();
  });
});
