import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { StylistProfile, StylistProfileCompleteness } from '~/shared/api/stylist-app.models';

import { ProfileDataStore } from '~/core/profile.data';
import { calcProfileCompleteness } from '~/core/utils/stylist-utils';

@Component({
  selector: '[madeMenuHeader]',
  templateUrl: 'made-menu-header.component.html'
})
export class MadeMenuHeaderComponent implements OnDestroy, OnInit {
  @Input() hideBackButton;
  @Input() hideBackAndMenuButtons;

  stylistProfileCompleteness: StylistProfileCompleteness;
  profile: StylistProfile;
  private subscription: Subscription;

  constructor(
    private profileData: ProfileDataStore
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.subscription = this.profileData.asObservable().subscribe(
      ({ response: profile }) => {
        this.profile = profile;
      }
    );

    if (this.profile) {
      this.stylistProfileCompleteness = calcProfileCompleteness(this.profile);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
