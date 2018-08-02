import * as mysql from "mysql";
import { ActionResult } from '../component/actionResult'
import { BaseKnowError } from '../component/baseKnowError';

export class MySqlHelper {

    public static async checkConnection(connection: mysql.Connection | mysql.PoolConnection): Promise<ActionResult> {
        return new Promise((resolve: (result: ActionResult) => void) => {
            let result = new ActionResult();
            if (connection) {
                connection.ping((err: mysql.MysqlError) => {
                    if (err) {
                        result.Result = false;
                        result.Message = err.message;
                        result.Code = err.code;
                    }
                    else {
                        result.Result = true;
                    }
                    connection.end();
                });
            }
            else {
                result.Result = false;
                result.Code = "";
                result.Message = "connection object is null";
            }
            resolve(result);
        });
    }

    private _connectionPool: mysql.Pool;

    /**
     * 测试MySql连接
     */
    public async testConnection(): Promise<ActionResult> {
        return new Promise((resolve: (result: ActionResult) => void) => {
            let result = new ActionResult();
            try {
                this._connectionPool.getConnection((err: mysql.MysqlError, connection: mysql.Connection) => {
                    if (!err) {
                        connection.ping((err: mysql.MysqlError) => {
                            if (!err) {
                                result.Result = true;
                                result.Code = "1";
                                result.Message = "MySql connection successful";
                            }
                            else {
                                result.initKnowError(BaseKnowError.MYSQLSERVERERROR);
                            }
                            resolve(result);
                        });
                    }
                    else {
                        result.initKnowError(BaseKnowError.MYSQLSERVERERROR);
                        resolve(result);
                    }
                })

            } catch (error) {
                result.ErrorData = error;
                result.Result = false;
                result.initKnowError(BaseKnowError.MYSQLSERVERERROR);
                resolve(result);
            }
        });
    }


    private con = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Zjj19911031',
        database: 'tokenlist',
    }).connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });


    public async queryToken(connection: mysql.Connection, tokenName: string) {
        var sql = "select * from tokenlist." + tokenName;
        connection.query(sql, function (err, result) {
            if (err) throw err;
            else
                console.log(result)
                return result
        });
    }

}