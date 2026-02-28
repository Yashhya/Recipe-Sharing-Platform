// Condensed comment block.

import { HttpInterceptorFn } from '@angular/common/http';

// Comment block removed.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');

    // If a token exists, clone the request and add the Authorization header
    if (token) {
        const clonedReq = req.clone({
            setHeaders: {
                // Bearer token format: "Bearer <token>"
                // This is the OAuth 2.0 standard for token-based auth
                Authorization: `Bearer ${token}`
            }
        });
        // Pass the modified request to the next handler in the chain
        return next(clonedReq);
    }

    // No token - pass the request as-is (for public endpoints)
    return next(req);
};
