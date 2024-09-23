/* HTTP Status Codes */

export const HttpStatus = {
    // Informational 1xx
    continue: 100 as const,
    switchingProtocols: 101 as const,
    processing: 102 as const,

    // Success 2xx
    ok: 200 as const,
    created: 201 as const,
    accepted: 202 as const,
    noContent: 204 as const,

    // Redirection 3xx
    multipleChoices: 300 as const,
    movedPermanently: 301 as const,
    found: 302 as const,
    seeOther: 303 as const,
    notModified: 304 as const,

    // Client Errors 4xx
    badRequest: 400 as const,
    unauthorized: 401 as const,
    paymentRequired: 402 as const,
    forbidden: 403 as const,
    notFound: 404 as const,
    methodNotAllowed: 405 as const,
    notAcceptable: 406 as const,
    requestTimeout: 408 as const,
    unProcessableEntity: 422 as const,

    // Server Errors 5xx
    internalServerError: 500 as const,
    notImplemented: 501 as const,
    badGateway: 502 as const,
    serviceUnavailable: 503 as const,
    gatewayTimeout: 504 as const,
} as const;