import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ImageErrorUrlDirective } from 'src/app/shared/ui/directive/image-error-url.directive';
import { provideComponentStore } from '@ngrx/component-store';
import { HomeStore } from '../data-access/store/home.store';
import { RxLet } from '@rx-angular/template/let';
import { AuthStore } from 'src/app/shared/data-access/store/auth.store';
import { OnScrollDirective } from 'src/app/shared/ui/directive/on-scroll.directive';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from "@angular/material/select";
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,
    ImageErrorUrlDirective,
    RxLet,
    OnScrollDirective,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSliderModule
  ],
  template: `
    <div class="h-full w-full overflow-hidden flex flex-col" *rxLet="vm$ as vm">
      <div class="flex justify-between items-center py-2 gap-6 px-4">
        <div class="w-1/6"></div>
        <div class="w-4/6 flex items-center gap-x-2 justify-center">
          <mat-form-field class="w-full mat-form-field-custom sm:w-96" appearance="outline"
                [floatLabel]="'always'">
            <input matInput type="text" placeholder="Search..." [(ngModel)]="hStore.pagingRequest.name" name="search" #search />
            <button matPrefix type="button" class="flex items-center justify-center" (click)="hStore.onFilterAdvance()">
              <mat-icon fontIcon="search" class="text-lg">
              </mat-icon>
            </button>
            <button matSuffix type="button" class="flex items-center justify-center cursor-pointer"
                    *ngIf="search.value !== ''" (click)="hStore.pagingRequest.name = ''">
              <mat-icon fontIcon="close" class="text-lg">
              </mat-icon>
            </button>
          </mat-form-field>
          <button type="button" [matMenuTriggerFor]="filterMenu" class="btn flex-shrink-0 w-[42px] h-[42px] bg-[#184E77] text-[#f2f2f2] rounded-md cursor-pointer hover:bg-opacity-90">
            <mat-icon fontIcon="filter_alt" class="text-lg"></mat-icon>
          </button>
          <!-- filter -->
          <mat-menu #filterMenu="matMenu" [xPosition]="'before'">
            <ng-template matMenuContent>
              <div class="flex bg-white w-full shadow-md rounded-sm flex-col p-3 pr-10" (click)="$event.stopPropagation()">
                <div class="relative">
                  <mat-label class="mb-1 inline-block">Owner</mat-label>
                  <mat-form-field class="w-full mat-form-field-custom" appearance="outline"
                      [floatLabel]="'always'">
                    <input matInput type="text" placeholder="Enter text..." [(ngModel)]="hStore.pagingRequest.owner" name="owner" #owner />
                    
                    <button matSuffix type="button" class="flex items-center justify-center cursor-pointer"
                            *ngIf="owner.value !== ''" (click)="hStore.pagingRequest.owner = ''">
                      <mat-icon fontIcon="close" class="text-lg">
                      </mat-icon>
                    </button>
                  </mat-form-field>
                </div>

                <div class="relative" *ngIf="hStore.isShowLanguage">
                  <mat-label class="mb-1 inline-block">Programming language</mat-label>
                  <mat-form-field
                    class="w-full mat-form-field-custom"
                    appearance="outline"
                  >
                    <mat-select [(ngModel)]="hStore.pagingRequest.language">
                      <mat-option *ngFor="let option of vm().languages" [value]="option.name"
                      >{{ option.name}}</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <mat-icon fontIcon="delete" class="text-lg absolute -right-8 mt-2 cursor-pointer"
                  (click)="hStore.pagingRequest.language = '';hStore.isShowLanguage = false ">
                  </mat-icon>
                </div>

                <div class="relative" *ngIf="hStore.isShowDate">
                  <mat-label class="mb-1 inline-block">Minimum created date</mat-label>
                  <mat-form-field class="w-full mat-form-field-custom" appearance="outline">
                        <input matInput [matDatepicker]="picker1" placeholder="" name="date" [(ngModel)]="hStore.pagingRequest.created_at"/>
                        <mat-datepicker-toggle matSuffix [for]="picker1">
                            <mat-icon matDatepickerToggleIcon fontIcon="calendar_month"
                                class="!text-grey-400 icon-size-5"></mat-icon>
                        </mat-datepicker-toggle>
                        <mat-datepicker #picker1></mat-datepicker>
                    </mat-form-field>
                  <mat-icon fontIcon="delete" class="text-lg absolute -right-8 mt-2 cursor-pointer"
                  (click)="hStore.pagingRequest.created_at = '';hStore.isShowDate = false ">
                  </mat-icon>
                </div>

                <div class="relative" *ngIf="hStore.isShowSize">
                  <mat-label class="mb-1 inline-block">Repository size (kb)</mat-label>
                  <mat-slider min="0" max="100000" step="1" discrete class="w-[calc(100%-18px)]">
                    <input matSliderThumb [(ngModel)]="hStore.pagingRequest.size">
                  </mat-slider>
                  <mat-icon fontIcon="delete" class="text-lg absolute -right-8 mt-2 cursor-pointer" 
                  (click)="hStore.pagingRequest.size = 0;hStore.isShowSize = false ">
                  </mat-icon>
                </div>
                
                <div class="flex items-center justify-end gap-x-2">
                  <a class="text-[blue] underline cursor-pointer hover:text-opacity-70 mr-auto" [matMenuTriggerFor]="addFieldMenu" *ngIf="!hStore.isShowAllField()">+ Add more field</a>
                  <button matSuffix type="button" (click)="hStore.onFilterAdvance()"
                  class="flex items-center justify-center cursor-pointer p-2 bg-black text-white rounded-md">
                    Search
                  </button>
                </div>

                <mat-menu #addFieldMenu="matMenu" [xPosition]="'before'">
                  <ng-template matMenuContent>
                    <div class="flex bg-white w-full shadow-md rounded-sm flex-col p-3" (click)="$event.stopPropagation()">
                      <div class="flex items-center justify-between gap-x-2" *ngIf="!hStore.isShowLanguage">
                        <span>Programming language</span>
                        <mat-icon fontIcon="add" class="text-lg cursor-pointer" (click)="hStore.isShowLanguage = true"></mat-icon>
                      </div>
                      <div class="flex items-center justify-between gap-x-2" *ngIf="!hStore.isShowDate">
                        <span>Minimum created date</span>
                        <mat-icon fontIcon="add" class="text-lg cursor-pointer" (click)="hStore.isShowDate = true"></mat-icon>
                      </div>
                      <div class="flex items-center justify-between gap-x-2" *ngIf="!hStore.isShowSize">
                        <span>Repository size</span>
                        <mat-icon fontIcon="add" class="text-lg cursor-pointer" (click)="hStore.isShowSize = true"></mat-icon>
                      </div>
                    </div>
                  </ng-template>
                </mat-menu>
              </div>
            </ng-template>
          </mat-menu>
        </div>
        <div class="flex justify-end w-1/6">
          <div class="w-12 h-12 rounded-full object-contain p-2 border border-solid border-gray-200 cursor-pointer" [matMenuTriggerFor]="actionMenu">
            <img [src]="vm().user.avatar_url" alt="" appImageErrorUrl>
          </div>
          <!-- profile -->
          <mat-menu #actionMenu="matMenu" [xPosition]="'before'">
            <ng-template matMenuContent>
            <div class="flex bg-white w-full shadow-md rounded-sm flex-col">
              <div class="p-3 font-semibold">{{vm().user.login}}</div>
              <button matRipple type="button" (click)="aStore.signOut()"
                      class="flex justify-center items-center text-[red] cursor-pointer w-full p-3 hover:bg-opacity-20 hover:bg-gray-200">
                Logout
              </button>
            </div>
            </ng-template>
          </mat-menu>
        </div>
      </div>
      <div class="flex-grow flex flex-col overflow-auto bg-gray-200 bg-opacity-50 pt-4" appOnScroll (emitScroll)="hStore.onScroll($event)">
        <div class="p-4">
          <div class="flex items-stretch flex-wrap">
            <div class="w-full sm:w-[calc(50%-1rem)] bg-white p-3 rounded-md m-2 flex-col" *ngFor="let repo of vm().repository.items">
              <div class="flex items-center gap-x-3">
                <div class="w-8 h-8 rounded-full object-contain p-2 border border-solid border-gray-200">
                  <img src="" alt="" appImageErrorUrl class="w-full">
                </div>
                <h3 class="font-bold mb-0 truncate">{{repo.full_name}}</h3>
              </div>
              <div class="my-2 text-gray-400 flex-1 flex-grow text-ellipsis line-clamp-2">{{repo.description}}</div>
              <div class="flex items-center gap-x-6 text-gray-800">
                <span class="font-semibold">{{repo.language}}</span>
                <div class="flex items-center">
                  <mat-icon fontIcon="star" class="text-lg flex items-center justify-center"></mat-icon><span>{{repo.score}}</span>
                </div>
                <span>{{repo.updated_at | date:'mediumDate'}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host ::ng-deep .mat-mdc-form-field-bottom-align {
        display: none !important;
      }
    `
  ],
  providers: [provideComponentStore(HomeStore)],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  hStore = inject(HomeStore)
  aStore = inject(AuthStore)
  vm$ = this.hStore.selectSignal(s => s);
}
