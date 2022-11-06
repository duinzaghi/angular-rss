import { Route } from '@angular/router';
import { CanDeactivateRssfeedDetails } from 'app/modules/admin/rssFeed/rssFeed.guards';
import { RssfeedContactResolver, RssfeedCountriesResolver, RssFeedResolver } from 'app/modules/admin/rssFeed/rssFeed.resolvers';
import { RssFeedComponent } from 'app/modules/admin/rssFeed/rssFeed.component';
import { RssFeedListComponent } from 'app/modules/admin/rssFeed/list/list.component';
import { RssFeedDetailsComponent } from 'app/modules/admin/rssFeed/details/details.component';

export const rssfeedRoutes: Route[] = [
    {
        path     : '',
        component: RssFeedComponent,
        children : [
            {
                path     : '',
                component: RssFeedListComponent,
                resolve  : {
                    news : RssFeedResolver,
                },
                children : [
                    {
                        path         : ':id',
                        component    : RssFeedDetailsComponent,
                        resolve      : {
                            newItem  : RssfeedContactResolver,
                        },
                        canDeactivate: [CanDeactivateRssfeedDetails]
                    }
                ]
            }
        ]
    }
];
