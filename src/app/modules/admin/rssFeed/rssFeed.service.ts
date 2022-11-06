import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { NewItem, Country, Tag } from 'app/modules/admin/rssFeed/rssFeed.types';
import {environment} from "../../../../environments/environment";
import * as uuid from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class RssFeedService
{
    private apiUrl = environment.apiUrl + '/rss';
    // Private
    private _newItem: BehaviorSubject<NewItem | null> = new BehaviorSubject(null);
    private _news: BehaviorSubject<NewItem[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for contact
     */
    get newItem$(): Observable<NewItem>
    {
        return this._newItem.asObservable();
    }

    /**
     * Getter for news
     */
    get news$(): Observable<NewItem[]>
    {
        return this._news.asObservable();
    }

    /**
     * Getter for countries
     */
    get countries$(): Observable<Country[]>
    {
        return this._countries.asObservable();
    }

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get news
     */
    getNews(): Observable<NewItem[]>
    {
        return this._httpClient.get<any>(this.apiUrl).pipe(
            tap((news) => {
                const temp = this.parseNews(news.data[0].item);
                this._news.next(temp);
            })
        );
    }

    /**
     * Get news
     */
    parseNews(data): NewItem[]
    {
        let result = [];
        for(let i=0;i<data.length;i++){
            let tempObj = {
                id: uuid.v4(),
                title: data[i].title[0],
                pubDate: data[i].pubDate? data[i].pubDate[0]: '',
                fullpubdate: data[i].fullpubdate? data[i].fullpubdate[0]: '',
                description: data[i].description[0],
                link: data[i].link[0],
                originalLink: data[i].originalLink[0],
                guid: data[i].guid[0],
                category: data[i].category[0],
                author: data[i].author[0],
                name: data[i].author[0],
            }
            result.push(tempObj);
        }
        return result;
    }

    /**
     * Search news with given query
     *
     * @param query
     */
    searchNews(query: string): Observable<NewItem[]>
    {
        return this._httpClient.get<NewItem[]>('api/apps/news/search', {
            params: {query}
        }).pipe(
            tap((news) => {
                this._news.next(news);
            })
        );
    }

    /**
     * Get contact by id
     */
    getNewById(id: string): Observable<NewItem>
    {
        return this._news.pipe(
            take(1),
            map((news) => {

                // Find the contact
                const newItem = news.find(item => item.id === id) || null;

                // Update the contact
                this._newItem.next(newItem);

                // Return the contact
                return newItem;
            }),
            switchMap((contact) => {

                if ( !contact )
                {
                    return throwError('Could not found contact with id of ' + id + '!');
                }

                return of(contact);
            })
        );
    }


    /**
     * Get countries
     */
    getCountries(): Observable<Country[]>
    {
        return this._httpClient.get<Country[]>('api/apps/news/countries').pipe(
            tap((countries) => {
                this._countries.next(countries);
            })
        );
    }

}
