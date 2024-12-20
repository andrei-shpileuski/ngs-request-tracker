import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, Observable, throwError, finalize } from 'rxjs';
import { RequestTrackerService } from '../services/request-tracker.service';

/**
 * HTTP Interceptor for tracking HTTP request metrics.
 *
 * This interceptor integrates with the `RequestTrackerService` to monitor HTTP requests,
 * enabling real-time tracking of:
 * - Number of ongoing requests.
 * - Success and error counts.
 * - Average response time.
 * - Success and error rates.
 *
 * ### Workflow
 * 1. Assigns a unique ID to each HTTP request.
 * 2. Notifies the `RequestTrackerService` when a request is initiated.
 * 3. Uses RxJS operators to track successful completions, errors, and aborts.
 * 4. Updates metrics in `RequestTrackerService` based on request outcomes.
 *
 * ### Request Lifecycle
 * - On initiation: Notifies the tracker service with a unique request ID.
 * - On success (2xx status): Marks the request as successful.
 * - On error (non-2xx or network error): Marks the request as failed.
 * - On request cancellation: Marks the request as aborted.
 *
 * @param req - The HTTP request being processed.
 * @param next - The next handler in the interceptor chain.
 * @returns An Observable emitting HTTP events or propagating errors if any occur.
 */
export const requestTrackerInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const requestTrackerService = inject(RequestTrackerService);
  const currentRequestId = requestTrackerService.requestId++;
  let requestWasHandled = false;

  requestTrackerService.requestSent(currentRequestId);

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          requestWasHandled = true;
          if (event.status >= 200 && event.status < 300) {
            requestTrackerService.requestSuccess(currentRequestId);
          } else {
            requestTrackerService.requestError(currentRequestId);
          }
        }
      },
      error: () => {
        requestWasHandled = true;
        requestTrackerService.requestError(currentRequestId);
      },
    }),
    finalize(() => {
      if (!requestWasHandled) {
        requestTrackerService.requestAborted(currentRequestId);
      }
    }),
    catchError((error) => {
      return throwError(() => error);
    }),
  );
};
