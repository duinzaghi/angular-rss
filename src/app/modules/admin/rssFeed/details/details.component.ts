import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {Contact, Country, NewItem, Tag} from 'app/modules/admin/rssFeed/rssFeed.types';
import { RssFeedListComponent } from 'app/modules/admin/rssFeed/list/list.component';
import { RssFeedService } from 'app/modules/admin/rssFeed/rssFeed.service';

@Component({
    selector       : 'rssfeed-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RssFeedDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    newItem: NewItem;
    newItemForm: UntypedFormGroup;
    news: NewItem[];
    countries: Country[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _rssFeedListComponent: RssFeedListComponent,
        private _rssFeedService: RssFeedService,
        private _formBuilder: UntypedFormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Open the drawer
        this._rssFeedListComponent.matDrawer.open();

        // Create the newItem form
        this.newItemForm = this._formBuilder.group({
            id          : [''],
            avatar      : [null],
            name        : ['', [Validators.required]],
            emails      : this._formBuilder.array([]),
            phoneNumbers: this._formBuilder.array([]),
            title       : [''],
            company     : [''],
            birthday    : [null],
            address     : [null],
            notes       : [null],
            tags        : [[]]
        });

        // Get the news
        this._rssFeedService.news$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((news: NewItem[]) => {
                this.news = news;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get the newItem
        this._rssFeedService.newItem$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((newItem: NewItem) => {
                // Open the drawer in case it is closed
                this._rssFeedListComponent.matDrawer.open();

                // Get the newItem
                this.newItem = newItem;

                // Patch values to the form
                this.newItemForm.patchValue(newItem);

                // Toggle the edit mode off
                this.toggleEditMode(false);

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._rssFeedListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
