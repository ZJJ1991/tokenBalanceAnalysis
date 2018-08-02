export class ActionResult
{
    public Result:boolean;
    public Code:string;
    public Message:string;
    public ErrorData:any|null|undefined;
    private _ErrorData:any|null|undefined;

    constructor(){
        this.Result = false;
        this.Code = "";
        this.Message = "";
        this._ErrorData = undefined;
    }

    public copyBase(source:ActionResult)
    {
        this.Result = source.Result;
        this.Code = source.Code;
        this.Message = source.Message;
        this._ErrorData = source.ErrorData;
    }

    public initKnowError(knowerror:IKnowErrorInfo)
    {
        this.Result = false;
        this.Code = String(knowerror.code);
        this.Message = knowerror.message;
        this.ErrorData = knowerror;
    }
}

export interface IKnowErrorInfo
{
    status:number;
    code:number;
    message:string
    erreoType?:number;
}