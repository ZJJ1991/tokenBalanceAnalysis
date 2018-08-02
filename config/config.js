const path = require('path');

module.exports = {
    serviceName:"ethereum-tokenswap-scan-client",                                                     //服务名称
    env: process.env["SERVER_ENV"] || "local",                          //运行环境标识(local、test、dev、pro)
    logpath:path.join(__dirname,"../log/"),                             //日志路径
    mySqlConfig:{                                                       //MySql数据库连接配置
        actived: true,            //是否需要连接MySql服务
        host: "127.0.0.1",                   //MySql Host
        port: 33306,                 //MySql服务端口
        user: "root",                   //MySql用户名
        password: "Zjj19911031",           //MySql密码
        database: "tokenlist"                  //MySql数据库
    },
    ethereumConfig:{
        actived:process.env["ETHEREUM_NODE_ACTIVE"] || true,
        safeBlockOffset:100,
        contractAddress:process.env["ETHEREUM_CONTRACT_ADDRESS"] || "0xd850942ef8811f2a866692a623011bde52a462c1",       // ERC20-VEN智能合约地址
        venBeginTransactionBlock:process.env["TOKENSWAP_START_BLOCKNUM"] || 5916594,                                   // 换币服务起始区块高度(包含Xnode绑定)
        web3HttpApis:[
            process.env["ETHETEUM_NODE_API_URL_01"] || "https://mainnet.infura.io/UjFZeQExiBEvdPDmWlps"
        ]
    }
}