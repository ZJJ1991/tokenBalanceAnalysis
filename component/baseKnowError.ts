export interface IKnowErrorInfo
{
    status:number;
    code:number;
    message:string
    erreoType?:number;
}

export class BaseKnowError
{
    public static INTERNALSERVERERROR:IKnowErrorInfo = {status:500,code:-1,message:"Internal Server Error"};
    public static MYSQLSERVERERROR:IKnowErrorInfo = {status:500,code:-2,message:"MySql Server Error"};
    public static REDISSERVERERRPR:IKnowErrorInfo = {status:500,code:-3,message:"Redis Server Error"};
    public static REDISSEMPTY:IKnowErrorInfo = {status:500,code:-3,message:"Redis Server data empty"};
    public static HTTPREQUESTERROR:IKnowErrorInfo = {status:500,code:-4,message:"HTTP Request Server Error"};
    public static PAGEINVALID:IKnowErrorInfo = {status:400,code:-2000,message:"Page must be a Integer and between 1 to 5000"};
    public static PAGESIZEINVALID:IKnowErrorInfo = {status:400,code:-2001,message:"Pagesize must be a Integer and between 1 to 100"};
    public static ETHWEB3APIERROR:IKnowErrorInfo = {status:400,code:-2002,message:"Ethereum Web3 Api Error"};
    public static THORAPIERROR:IKnowErrorInfo = {status:400,code:-2003,message:"VeChain Thor Api Error"};
    public static GETMYSQLCONNECTIONERROR:IKnowErrorInfo = {status:400,code:-2003,message:"get mysql connection error"};
    public static SQLNOTFOUND:IKnowErrorInfo = {status:400,code:-2003,message:"mysql not found"};
}