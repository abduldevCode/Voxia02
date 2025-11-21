class ApiError extends Error {

    constructor(
        statusCode,                       // represents the HTTP status code define the type of error , 404, 500 etc.
        massage = "something went wrong", //This is the error message that provides a human-readable explanation of what went wrong. If not provided, it defaults to "something went wrong".
        errors = [],                     //This is an array intended to hold additional error details.
        stack=""                        //
    ) {
        super(massage),
            this.statusCode = statusCode,
            this.data = null,
            this.massage = massage,
            this.success = false,
            this.errors = errors,
            this.stack = stack || this.stack;
    }


}

export default ApiError