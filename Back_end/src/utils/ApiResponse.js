class ApiResponse{
    constructor(statusCode,data,massage="Success"){
     this.statusCode=statusCode,
     this.data=data,
     this.massage=massage,
     this.success=statusCode<399
    }
}

export default ApiResponse;
/*
information_Response(100-199)
Success_Response(200-299)
Redirection_Response(300-399)
Client_error_Response(400-499)
Server_error_Response(500-599)
*/