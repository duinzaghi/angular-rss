import { Route } from '@angular/router';
import { CanDeactivateRssfeedDetails } from 'app/modules/admin/rssFeed/rssFeed.guards';
import { RssfeedContactResolver, RssfeedCountriesResolver, RssFeedResolver, RssfeedTagsResolver } from 'app/modules/admin/rssFeed/rssFeed.resolvers';
import { RssFeedComponent } from 'app/modules/admin/rssFeed/rssFeed.component';
import { RssFeedListComponent } from 'app/modules/admin/rssFeed/list/list.component';
import { RssFeedDetailsComponent } from 'app/modules/admin/rssFeed/details/details.component';

export const rssfeedRoutes: Route[] = [
    {
        path     : '',
        component: RssFeedComponent,
        resolve  : {
            tags: RssfeedTagsResolver
        },
        children : [
            {
                path     : '',
                component: RssFeedListComponent,
                resolve  : {
                    contacts : RssFeedResolver,
                    countries: RssfeedCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : RssFeedDetailsComponent,
                        resolve      : {
                            contact  : RssfeedContactResolver,
                            countries: RssfeedCountriesResolver
                        },
                        canDeactivate: [CanDeactivateRssfeedDetails]
                    }
                ]
            }
        ]
    }
];
