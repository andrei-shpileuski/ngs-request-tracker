import { Component, inject, input } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { RequestTrackerService } from '../../services/request-tracker.service';

@Component({
  selector: 'ngs-request-tracker',
  standalone: true,
  imports: [DecimalPipe, NgClass],
  templateUrl: './request-tracker.component.html',
  styleUrl: './request-tracker.component.scss',
})
export class RequestTrackerComponent {
  xPosition = input<'left' | 'center' | 'right'>('left');
  yPosition = input<'top' | 'center' | 'bottom'>('top');

  requestTrackerService = inject(RequestTrackerService);

  isLoading = this.requestTrackerService.isInProgress;
  countInProgress = this.requestTrackerService.countInProgress;
  count = this.requestTrackerService.count;
  countSuccess = this.requestTrackerService.countSuccess;
  countError = this.requestTrackerService.countError;
  countAborted = this.requestTrackerService.countAborted;
  averageResponseTime = this.requestTrackerService.averageResponseTime;
  successRate = this.requestTrackerService.successRate;
  abortedRate = this.requestTrackerService.abortedRate;
  errorRate = this.requestTrackerService.errorRate;
}
