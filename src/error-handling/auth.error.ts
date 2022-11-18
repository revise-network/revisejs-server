export class AuthError extends Error {
    code=null;
    constructor(errorCode,errorMsg) {
        super();
        this.name = "AuthError";
        this.message = errorMsg;
        this.code=errorCode;
    }
}

export class UserIdError extends AuthError {
    constructor(errorCode,errorMsg) {
        super(errorCode,errorMsg);
        this.name="UserIdError";
        this.message = errorMsg;
        this.code=errorCode;
    }
}
