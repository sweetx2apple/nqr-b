const { Handler } = require('./Handler');

const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const app = new Koa();
const handler = new Handler();
const port = process.env.PORT||7070;
const server = http.createServer(app.callback());

app.use( koaBody({
    urlencoded: true,
    multipart: true,
    json: true,
}));

app.use(cors({
  origin: "*",
  exposeHeaders: ['application/json'],
  maxAge: 5000,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type'],
}));

app.use( async(ctx,next) => {
    const origin = ctx.request.get('Origin');
    if(!origin){ 
        return await next();
    } 
    const headers = {'Access-Control-Allow-Origin':'*',};
    
    if( ctx.request.method !== 'OPTIONS'){
        ctx.response.set({...headers});
        try{
            return await next();
        } catch(e){
            e.headers = {...e.headers,...headers};
            throw e;
        }
    } 
    
    if(ctx.request.get('Access-Control-Request-Method')){
        ctx.response.set( {
            ...headers,
            'Access-Control-Allow-Methods':'GET, POST, PUT, DELETE, PATCH',
        });
        
        if(ctx.request.get('Access-Control-Request-Headers')){
            ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Allow-Request-Headers'));
        } 

        ctx.response.status = 204;
    }
});


app.use(async (ctx,next) => {
    if( ctx.request.method === 'POST' && ctx.request.url == "/users"){
        handler.registerAnswers(ctx.request.body);
        ctx.response.body = {
            ok: 'ok'
        }
    } 

    if( ctx.request.method === 'POST' && ctx.request.url == "/admin"){
        
        let admin = handler.findAdmin(ctx.request.body.id);
        if (admin == "0" || admin){
            if (handler.admins[admin].pswd === ctx.request.body.pswd){
                ctx.response.body = {
                    ok: true
                }
            } else {
                ctx.response.body = {
                    ok: false
                }
            }
        } else {
            ctx.response.body = {
                ok: false
            }
        }
        
    } 

    if( ctx.request.method === 'GET' && ctx.request.url.search){
        let srchString = ctx.request.search;
        if (srchString.slice(1,3) === "id"){
            let id = srchString.slice(4);
            let user = handler.findUser(id);
            if (user == "0" || user){
                ctx.response.body = handler.users[user].questions; 
            }
        }

    if (ctx.request.method === 'GET' && ctx.request.url == '/userbank'){
        ctx.response.body = handler.users;
    }    
        
    } 

});

server.listen(port);