import { BehaviorSubject, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class RequestTrackerService {
  requestId = 0;

  /**
   * Tracks the number of ongoing HTTP requests.
   *
   * @default 0
   */
  private _countInProgress$ = new BehaviorSubject<number>(0);

  /**
   * Tracks the number of aborted HTTP requests.
   *
   * @default 0
   */
  private _countAborted$ = new BehaviorSubject<number>(0);

  /**
   * Tracks the number of all HTTP requests.
   *
   * @default 0
   */
  private _count$ = new BehaviorSubject<number>(0);

  /**
   * Tracks the number of successfully completed HTTP requests.
   *
   * @default 0
   */
  private _countSuccess$ = new BehaviorSubject<number>(0);

  /**
   * Tracks the number of failed HTTP requests.
   *
   * @default 0
   */
  private _countError$ = new BehaviorSubject<number>(0);

  /**
   * Stores the duration of completed HTTP requests in milliseconds.
   * Used for calculating the average response time.
   */
  private _requestTimes: number[] = [];

  /**
   * A map to associate each request ID with its start time.
   * Used to calculate the duration of individual requests.
   */
  private startTimes: Map<number, number> = new Map();

  /**
   * Observable stream of the number of ongoing HTTP requests.
   */
  countInProgress$ = this._countInProgress$.asObservable();

  /**
   * Signal for the number of ongoing HTTP requests.
   *
   * Provides real-time access to the count.
   */
  countInProgress = toSignal(this.countInProgress$, { requireSync: true });

  /**
   * Observable stream of the number of all HTTP requests.
   */
  count$ = this._count$.asObservable();

  /**
   * Signal for the number of all HTTP requests.
   *
   * Provides real-time access to the count.
   */
  count = toSignal(this.count$, { requireSync: true });

  /**
   * Observable stream of the number of successful HTTP requests.
   */
  countSuccess$ = this._countSuccess$.asObservable();

  /**
   * Signal for the number of successful HTTP requests.
   *
   * Provides real-time access to the count.
   */
  countSuccess = toSignal(this.countSuccess$, { requireSync: true });

  /**
   * Observable stream of the number of failed HTTP requests.
   */
  countError$ = this._countError$.asObservable();

  /**
   * Signal for the number of failed HTTP requests.
   *
   * Provides real-time access to the count.
   */
  countError = toSignal(this.countError$, { requireSync: true });

  /**
   * Observable stream of the number of failed HTTP requests.
   */
  countAborted$ = this._countAborted$.asObservable();

  /**
   * Signal for the number of failed HTTP requests.
   *
   * Provides real-time access to the count.
   */
  countAborted = toSignal(this.countAborted$, { requireSync: true });

  /**
   * Observable stream indicating whether there are any ongoing HTTP requests.
   */
  isInProgress$ = this.countInProgress$.pipe(map((count) => Boolean(count)));

  /**
   * Signal indicating whether there are any ongoing HTTP requests.
   */
  isInProgress = toSignal(this.isInProgress$, { requireSync: true });

  /**
   * Observable stream of the average response time (in milliseconds) for completed HTTP requests.
   */
  averageResponseTime$ = new BehaviorSubject<number>(0);

  /**
   * Signal for the average response time (in milliseconds) for completed HTTP requests.
   */
  averageResponseTime = toSignal(this.averageResponseTime$, {
    requireSync: true,
  });

  /**
   * Observable stream of the success rate as a percentage.
   */
  successRate$ = new BehaviorSubject<number>(0);

  /**
   * Signal for the success rate as a percentage.
   */
  successRate = toSignal(this.successRate$, { requireSync: true });

  /**
   * Observable stream of the aborted rate as a percentage.
   */
  abortedRate$ = new BehaviorSubject<number>(0);

  /**
   * Signal for the aborted rate as a percentage.
   */
  abortedRate = toSignal(this.abortedRate$, { requireSync: true });

  /**
   * Observable stream of the error rate as a percentage.
   */
  errorRate$ = new BehaviorSubject<number>(0);

  /**
   * Signal for the error rate as a percentage.
   */
  errorRate = toSignal(this.errorRate$, { requireSync: true });

  /**
   * Marks the start of an HTTP request.
   *
   * @param requestId Unique identifier for the request.
   */
  requestSent(requestId: number): void {
    this.startTimes.set(requestId, performance.now());
    this._count$.next(this._count$.value + 1);
    this._countInProgress$.next(this._countInProgress$.value + 1);
  }

  /**
   * Marks the successful completion of an HTTP request.
   *
   * @param requestId Unique identifier for the request.
   */
  requestSuccess(requestId: number): void {
    const startTime = this.startTimes.get(requestId);
    if (startTime !== undefined) {
      const duration = performance.now() - startTime;
      this._requestTimes.push(duration);
      this.startTimes.delete(requestId);
    }
    this._countInProgress$.next(this._countInProgress$.value - 1);
    this._countSuccess$.next(this._countSuccess$.value + 1);
    this.updateMetrics();
  }

  /**
   * Marks the failure of an HTTP request.
   *
   * @param requestId Unique identifier for the request.
   */
  requestError(requestId: number): void {
    this.startTimes.delete(requestId);
    this._countInProgress$.next(this._countInProgress$.value - 1);
    this._countError$.next(this._countError$.value + 1);
    this.updateMetrics();
  }

  /**
   * Marks the aborted HTTP request.
   *
   * @param requestId Unique identifier for the request.
   */
  requestAborted(requestId: number): void {
    this.startTimes.delete(requestId);
    this._countInProgress$.next(this._countInProgress$.value - 1);
    this._countAborted$.next(this._countAborted$.value + 1);
    this.updateMetrics();
  }

  /**
   * Updates metrics including average response time, success rate, and error rate.
   */
  private updateMetrics(): void {
    if (this._requestTimes.length > 0) {
      const averageTime =
        this._requestTimes.reduce((sum, time) => sum + time, 0) /
        this._requestTimes.length;
      this.averageResponseTime$.next(averageTime);
    }

    if (this.count() > 0) {
      this.errorRate$.next((this.countError() / this.count()) * 100);
      this.successRate$.next((this.countSuccess() / this.count()) * 100);
      this.abortedRate$.next((this.countAborted() / this.count()) * 100);
    }
  }
}
