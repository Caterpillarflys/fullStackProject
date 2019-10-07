const express = require('express');
const app = express();
const mysql = require('mysql');

const bodyParser = require('body-parser');//用于req.body获取值的

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',     
    database: 'test'    
});

connection.connect();

// 下面是解决跨域请求问题
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header('Content-Type', 'application/x-www-form-urlencoded' )
    next();
 });



//get请求，查询
app.get('/search' ,(err,res)=>{
    const sql = 'select * from message'; 
    connection.query(sql,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }
        res.json(result); 
    }); 
}) 

//body解析
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


//post请求，删除
app.post('/del', (req, res,)=>{
    const sql = 'DELETE FROM message where id='+req.body.id; 
    connection.query(sql,function(err,result){
        if(err){
            console.log('[SELECT ERROR] - ', err.message);
            return;
        }else{
            console.log('删除成功！')
            res.json(result)
        } 
    }); 
    // console.log(req.body.id)
}) 

//post请求，修改
app.post('/change',(req, res)=>{
    console.log('有body',req.body?req.body:'没有body')
    let updateSql = 'UPDATE message SET name = ?,gender = ?,phoneNumber = ?,birthday = ? WHERE ID ='+(req.body.idx+1);
    let updateSqlParams = [req.body.name, req.body.gender,req.body.phone,req.body.birthday];
    connection.query(updateSql, updateSqlParams, (error, result) => {
        if (error) {
            console.log("修改失败！");
            console.log(error);
            return;
        } else {
            console.log("修改成功！");
            res.json(result);
        };
    });
})

//post请求，增加
app.post('/add',(req, res)=>{
    console.log('有body',req.body?req.body:'没有body')
    let addSql = 'INSERT INTO message(id,name,gender,phoneNumber,birthday) VALUES(0,?,?,?,?)';
    let addSqlParams = [req.body.name, req.body.gender,req.body.phone,req.body.birthday];
    connection.query(addSql, addSqlParams, (err, result) => {
        if (err) {
            console.log("新增失败！");
            console.log(err);
            return;
        } else {
            console.log("新增成功！");
            res.json(result);
        };
    });
})




var server = app.listen(4000, 'localhost', function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("地址为 http://%s:%s", host, port);
})
