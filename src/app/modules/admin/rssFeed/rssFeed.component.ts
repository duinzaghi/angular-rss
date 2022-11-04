import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'rssFeed',
    templateUrl    : './rssFeed.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RssFeedComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
