import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { RssFeedService } from 'app/modules/admin/rssFeed/rssFeed.service';
import {Contact, Country, NewItem, Tag} from 'app/modules/admin/rssFeed/rssFeed.types';

@Injectable({
    providedIn: 'root'
})
export class RssFeedResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _rssFeedService: RssFeedService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NewItem[]>
    {
        return this._rssFeedService.getNews();
    }
}

@Injectable({
    providedIn: 'root'
})
export class RssfeedContactResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _rssFeedService: RssFeedService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NewItem>
    {
        return this._rssFeedService.getNewById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested contact is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

@Injectable({
    providedIn: 'root'
})
export class RssfeedCountriesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _rssFeedService: RssFeedService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Country[]>
    {
        return this._rssFeedService.getCountries();
    }
}
