const http=require('http');
const fs=require('fs');
const urlLib=require('url');
const querystring=require('querystring');
var users={};

var server=http.createServer(function(req,res){
	var str='';
	req.on('data',function(data){
		str=str+data;
	});

	req.on('end',function(){
		var obj=urlLib.parse(req.url,true);
		var url=obj.pathname;
		const GET=obj.query;

		const POST=querystring.parse(str);

		if (url=='/user') {
			switch(GET.act){
				case 'reg':
				if (users[GET.user]) {
					res.write('{"ok":false,"msg":"该用户已注册"}')
				} else {
					users[GET.user]=GET.pass;
					res.write('{"ok":true,"msg":"注册成功"}')
				};
				break;

				case 'login':
				if (users[GET.user]==null) {
					res.write('{"ok":false,"msg":"该用户不存在"}')
				} else if(users[GET.user]!=GET.pass){
					res.write('{"ok":false,"msg":"密码错误"}')
				}else{
					res.write('{"ok":true,"msg":"成功"}')
				};
				break;
				default:
				res.write('{"ok":false,"msg":"未知错误"}')
			}
			res.end();
		} else {
			var file_name='./www'+req.url;
			fs.readFile(file_name,function(err,data){
				if (err) {
					res.write('404')
				} else {
					res.write(data)
				}
				res.end();
			})
		}
	
	})
});
server.listen(8026);