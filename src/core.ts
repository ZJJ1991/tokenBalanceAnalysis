import * as mysql from "mysql";
import { resolve } from "dns";
import { rejects } from "assert";
import { print } from "util";
var fs = require('fs')

const con = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Zjj19911031',
    database: 'tokenlist'
});

const csvWriter = require('csv-write-stream')
export class Core {

    private writer = csvWriter()
    private dailyBalWriter = csvWriter()
    constructor(tokenName: string) {

        // con.connect(function (err: any) {
        //     if (err) throw err;
        //     console.log("Connected!");
        // });

        this.writer.pipe(fs.createWriteStream('./dataStorage/' + tokenName + '_Balance.csv'))
        this.dailyBalWriter.pipe(fs.createWriteStream('./dataStorage/' + tokenName + '_daily_Balance.csv'))

    }

    async queryToken(tokenName: string) {
        var sql = "select * from tokenlist." + tokenName;

        return new Promise<Array<any>>(function (resolve, reject) {
            con.query(sql, function (err: any, result: any) {
                if (err)
                    reject(err)
                else
                    resolve(result)
            })
        });
    }

    async rangeQueryToken(tokenName: string, timestampRange: Array<number>) {
        var sql = "select * from tokenlist." + tokenName + ' where timestamp >= ' + timestampRange[0] + ' &&timestamp<= ' + timestampRange[1];
        return new Promise<Array<any>>(function (resolve, reject) {
            con.query(sql, function (err: any, result: any) {
                if (err) {
                    console.log('error pf rangeQuery')
                    reject(err)
                }
                else
                    resolve(result)
            })
        });
    }

    writeCSV(Account: any, Balance: any) {
        const record = { account: Account, balance: Balance }
        this.writer.write(record)
        // console.log(this.writer.write(record))
        // this.writer.end()
    }

    createDailyBalFile(tokenName:any, batch:any){
        this.dailyBalWriter.pipe(fs.createWriteStream('./dataStorage/' + tokenName + '_batch'+batch+'_daily_Balance.csv'))
    }

    async writedailyBal(Account: any, Balance: any, Day:any){
        const record = { account: Account, balance: Balance, day: Day}
        this.dailyBalWriter.write(record)
    }

    // This function calculates the daily timestamp range within which one given timestamp is.
    async timestampRangeOfDay(timestamp: number) {
        var epoch = timestamp * 1000
        var d = new Date(0);
        d.setUTCSeconds(timestamp)
        // console.log("human date string: ", d.toISOString())
        var year = d.toISOString().split('-')[0]
        var month = d.toISOString().split('-')[1]
        var day = d.toISOString().split('-')[2].split('T')[0]
        var hour = d.toISOString().split('-')[2].split('T')[1].split(':')[0]
        var minutes = d.toISOString().split('-')[2].split('T')[1].split(':')[1]
        var seconds = d.toISOString().split('-')[2].split('T')[1].split(':')[2].split('.')[0]
        var UtCHumanTime = [year, month, day, hour, minutes, seconds]

        var date = new Date(timestamp * 1000)
        // console.log("date to human: ", date.getDay())


        var type2 = 'Thu ' + 'July' + ' ' + day + ' ' + '00' + ':' + '00' + ':' + '00' + ' +0000 ' + year;
        var date2 = new Date(type2)
        // console.log('type2: ', type2)
        // console.log('getTime: ', date2.getTime())
        // 1530748800000
        // var type3 = 'Thu '+ 'July' +' '+day +' '+'23'+':'+'59'+':'+'59' +' +0000 '+year;
        // var date3 = new Date(type3)
        // console.log('type3: ', type3)
        // console.log('getTime: ', date3.getTime())

        var type4 = 'Fri ' + 'July' + ' ' + '06 ' + ' ' + '00' + ':' + '00' + ':' + '00' + ' +0000 ' + year;
        var date4 = new Date(type4)
        // console.log('type4: ', type4)
        // console.log('getTime: ', date4.getTime())
        var dd = new Date(timestamp * 1000)
        var dayofWeek = dd.getDay();
        // console.log('local day of a week: ', dayofWeek)

        var moment = require('moment');
        var offset = moment().utcOffset();
        var timeZone = ''.concat(offset < 0 ? "-" : "+", moment(''.concat((Math.abs(offset / 60)).toString(), Math.abs(offset % 60) < 10 ? "0" : "", (Math.abs(offset % 60)).toString()), "hmm").format("HH:mm"))
        var currentTimeZone = parseFloat(timeZone)
        // console.log(currentTimeZone)

        if (currentTimeZone && dd.getHours() < currentTimeZone) {
            dayofWeek = dayofWeek - 1
        }
        if (currentTimeZone < 0 && dd.getHours() - currentTimeZone > 24) {
            dayofWeek = dayofWeek + 1
        }
        var DayInWeek;
        if (dayofWeek == -1) {
            DayInWeek = 'Mon';
        }
        if (dayofWeek == 0) {
            DayInWeek = 'Sun';
        }
        if (dayofWeek == 1) {
            DayInWeek = 'Mon';
        }
        if (dayofWeek == 2) {
            DayInWeek = 'Tue';
        }
        if (dayofWeek == 3) {
            DayInWeek = 'Wed';
        }
        if (dayofWeek == 4) {
            DayInWeek = 'Thu';
        }
        if (dayofWeek == 5) {
            DayInWeek = 'Fri';
        }
        if (dayofWeek == 6) {
            DayInWeek = 'Sat';
        }

        var Mon;
        if (parseInt(month) == 1) {
            Mon = 'Jan'
        }
        if (parseInt(month) == 2) {
            Mon = 'Feb'
        }
        if (parseInt(month) == 3) {
            Mon = 'Mar'
        }
        if (parseInt(month) == 4) {
            Mon = 'Apr'
        }
        if (parseInt(month) == 5) {
            Mon = 'May'
        }
        if (parseInt(month) == 6) {
            Mon = 'Jun'
        }
        if (parseInt(month) == 7) {
            Mon = 'July'
        }
        if (parseInt(month) == 8) {
            Mon = 'Aug'
        }
        if (parseInt(month) == 9) {
            Mon = 'Sep'
        }
        if (parseInt(month) == 10) {
            Mon = 'Oct'
        }
        if (parseInt(month) == 11) {
            Mon = 'Nov'
        }
        if (parseInt(month) == 12) {
            Mon = 'Dec'
        }

        var HumanTimeFormat = DayInWeek + ' ' + Mon + ' ' + day + ' ' + '00:00:00 +0000 ' + year
        // console.log('human format ', HumanTimeFormat)
        var convertHumanDate = new Date(HumanTimeFormat)
        var beginTimestamp = convertHumanDate.getTime() / 1000
        // console.log("earliest timestamp of a day", convertHumanDate.getTime())
        var latestTimestamp = beginTimestamp + 86400 - 1
        // console.log([earliestTimestamp, latestTimestamp])
        return [beginTimestamp, latestTimestamp]
    }


}


// timestampRangeOfDay(1530794441)
function rangeQueryToken(tokenName: string, timestampRange: Array<number>) {
    var sql = "select * from tokenlist." + tokenName + ' where timestamp >= ' + timestampRange[0] + ' &&timestamp<= ' + timestampRange[1];
    console.log('sql: ', sql)
    return new Promise<Array<any>>(function (resolve, reject) {
        con.query(sql, function (err: any, result: any) {
            if (err) {
                console.log('error pf rangeQuery')
                reject(err)
            }
            else {
                // console.log('result of range query: ', result)
                resolve(result)
            }
        })
    });
}

rangeQueryToken('ven', [1502755200, 1502841599])