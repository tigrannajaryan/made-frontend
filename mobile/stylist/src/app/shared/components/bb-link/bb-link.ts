import { Directive, HostListener, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { PageNames } from '~/shared/page-names';

@Directive({
  selector: '[bb-link]'
})
export class BbLinkComponent {
  @Input() params?: Object;
  @Input() to: PageNames;

  constructor(
    private navCtrl: NavController
  ) {
  }

  @HostListener('click') redirectOnClick() {
    if (PageNames.hasOwnProperty(this.to)) {
      this.navCtrl.push(PageNames[this.to], this.params || {}, {animate: false});
    } else {
      throw new Error(`Error when navigating to ${this.to}. ${this.to} doesn’t exist in PageNames`);
    }
  }

}
