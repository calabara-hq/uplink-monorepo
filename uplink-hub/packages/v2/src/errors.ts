

export class AuthorizationError extends Error {
    name = 'AuthorizationError';

    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}

export class InvalidArgumentError extends Error {
    name = 'InvalidArgument';

    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, InvalidArgumentError.prototype);
    }
}

export class NotFoundError extends Error {
    name = 'NotFoundError';

    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class TransactionRevertedError extends Error {
    name = 'TransactionRevertedError';

    constructor(m?: string) {
        super(m);
        Object.setPrototypeOf(this, TransactionRevertedError.prototype);
    }
}