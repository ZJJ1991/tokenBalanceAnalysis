import { Core } from './core'
import { write } from 'fs';
import { EINVAL } from 'constants';

// This function calculates the accounts balances of all time. 
async function processToken(core: Core, tokenName: string) {
    const token = await core.queryToken(tokenName)
    let sender: string;
    let receiver: string;
    let amount: number;
    let balance = new Map();

    // console.log(AE)
    var num = 5.568844445555222267;
    var n = (num + 0.000000000000000921);
    console.log(n.toFixed(18))
    if (token.length > 0) {
        for (var i = 0; i < token.length; i++) {
            sender = token[i].sender;
            receiver = token[i].receiver;
            amount = parseFloat(token[i].amount);
            if (balance.has(sender)) {
                console.log('sender balance: ', balance.get(sender))
                balance.set(sender, ((balance.get(sender)) - amount))
            }
            else {
                balance.set(sender, (0 - amount))
            }
            if (balance.has(receiver)) {
                balance.set(receiver, (balance.get(receiver) + amount))
            }
            else {
                balance.set(receiver, (0 + amount))
            }
        }

        console.log("balance of creator: ", (-balance.get("0x0000000000000000000000000000000000000000")).toPrecision())
        console.log("balance size", balance.size)
        balance.forEach(function (value, key) {
            // console.log("key: "+ key, "value: "+value)
            core.writeCSV(key, value)
        })
    }
}

async function calBal(token: Array<any>, prevDayBal: Map<string, number> | null) {
    var updatePreDay = prevDayBal;
    let sender;
    let receiver;
    let amount: number;
    if (token.length > 0) {
        for (var i = 0; i < token.length; i++) {
            // console.log('token : '+i, token[i])
            updatePreDay = await processEachToken(token[i], updatePreDay)
            // console.log('calBal1: ', updatePreDay)

        }
        // console.log('calBal: ', updatePreDay)
        return updatePreDay
    } else {
        return updatePreDay
    }
}

async function processEachToken(token: any, updatePreDay: Map<string, number> | null) {

    var sender = token.sender;
    var receiver = token.receiver;
    var amount = parseFloat(token.amount);

    if (updatePreDay != null) {
        if (updatePreDay.has(sender)) {
            var bl = updatePreDay.get(sender)
            if (bl != undefined) {
                // console.log(sender + ' sender balance: ', bl)
                updatePreDay.set(sender, bl - amount)
            }
        }
        else {
            // console.log(sender + ' sender 1st time balance: ', 0)
            updatePreDay.set(sender, (0 - amount))
        }
        if (updatePreDay.has(receiver)) {
            var bl = updatePreDay.get(receiver)
            // console.log(receiver + ' receiver balance: ', bl)
            if (bl != undefined)
                updatePreDay.set(receiver, bl + amount)
        }
        else {
            // console.log(receiver + ' receiver 1st time balance: ', 0)
            updatePreDay.set(receiver, (0 + amount))
        }
        // console.log('processEach: ', updatePreDay)
        return updatePreDay
    } else {  // if the historical balance is null, that means we calculate the balance from the first day
        let firstDaybalance = new Map();
        if (firstDaybalance.has(sender)) {
            // console.log(sender + ' 1st sender balance: ', firstDaybalance.get(sender))
            firstDaybalance.set(sender, ((firstDaybalance.get(sender)) - amount))
        }
        else {
            // console.log(sender + ' 1st sender 1st time balance: ', 0)
            firstDaybalance.set(sender, (0 - amount))
        }
        if (firstDaybalance.has(receiver)) {
            // console.log(receiver + ' 1st receiver balance: ', (firstDaybalance.get(receiver)))
            firstDaybalance.set(receiver, (firstDaybalance.get(receiver) + amount))
        }
        else {
            // console.log(receiver + ' 1st receiver 1st time balance: ', 0)
            firstDaybalance.set(receiver, (0 + amount))
        }
        // console.log('processEach: ', firstDaybalance)
        return firstDaybalance
    }
}
// This function updates the daily balances. : Promise<Map<string, number> | undefined>
async function UpdateDaily(core: Core, tokenName: string, timestampRange: Array<number>, prevDayBal: Map<string, number> | null) {
    const token = await core.rangeQueryToken(tokenName, timestampRange)
    // console.log('tokenlist of a day ' + ' length: ', token.length)
    return await calBal(token, prevDayBal)
}



async function BatchProcess(tokenName: any) {
    var core = new Core(tokenName);
    var token = await core.queryToken(tokenName)


    var firstTimestamp = token[0].timestamp;
    // console.log('first time : ', firstTimestamp)
    var lastTimestamp = token[token.length - 1].timestamp;
    // console.log('last time : ', lastTimestamp)

    var firstdayRange = await core.timestampRangeOfDay(firstTimestamp)
    console.log(firstdayRange)
    var lastdayRange = await core.timestampRangeOfDay(lastTimestamp)
    var day = ((lastdayRange[0] - firstdayRange[0]) / 86400) + 1   //calculate the historical days of token since ICO
    console.log('day', day)
    // 1530782298   1502782714

    var historydayilyBal = new Map()
    const firstDayBal = await UpdateDaily(core, tokenName, firstdayRange, null)
    // console.log('first day balance:', firstDayBal)


    historydayilyBal.set(1, firstDayBal)
    console.log('size of map: ', historydayilyBal.size)
    console.log('first day balance:', historydayilyBal.get(1))
    if(firstDayBal!=null){
        await queryDailyBal(core, firstDayBal, 0)
    }

    for (var i = 1; i < day; i++) {
        // if(day<81){

        // }
        // input a random timestamp of specific (i+1)th day and you will get corresponding timestamp range of that day
        var ith_1dayRange = await core.timestampRangeOfDay(firstdayRange[0] + 86400 * i + 1000)

        // console.log('historydayilyBal.get(i)', historydayilyBal.get(i))
        // calculate the (i+1) day balance
        var ithPlus1dayBal = await UpdateDaily(core, tokenName, ith_1dayRange, historydayilyBal.get(i))
        // console.log('NO: '+ i + ' +1dayBal: ', ithPlus1dayBal)
        if (ithPlus1dayBal != undefined) {
            historydayilyBal.set(i + 1, ithPlus1dayBal) // initilize the new day balance data based on the previous day data
            // console.log(historydayilyBal.get(i+1))
            await queryDailyBal(core, ithPlus1dayBal, i)
        }
    }
    console.log('end')
}

async function queryDailyBal(core: Core, ithPlus1dayBal: Map<string, number>, i: number) {
    if (ithPlus1dayBal != undefined) {
        ithPlus1dayBal.forEach((v: number, k: string) => {
            core.writedailyBal(k, v, i + 1)
        })
    }
}

BatchProcess('ven')

