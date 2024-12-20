import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {RequestTrackerService} from '../../../ngs-request-tracker/src/lib/data-access/services/request-tracker.service';
import {DecimalPipe} from '@angular/common';
import {
  RequestTrackerComponent
} from '../../../ngs-request-tracker/src/lib/data-access/components/request-tracker/request-tracker.component';
import {ApiService} from './services/api.service';
import {take} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DecimalPipe,RequestTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  apiService = inject(ApiService)
  requestTrackerService = inject(RequestTrackerService);

  isLoading = this.requestTrackerService.isInProgress;

  sendTestRequest(): void {
    this.apiService.getInternalJsonData().pipe(take(1)).subscribe()
  }
}
