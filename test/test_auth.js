var chai = require('chai')
    ,chaiHttp = require('chai-http')
chai.use((chaiHttp))
var expect = chai.expect
var baseUrl = "http://localhost:8080"

describe('Auth test',function (){
    var authCookie = ""
    it('Login test', function (){
        chai.request(baseUrl)
            .post('/api/login')
            .send({email:'inesni426@gmail.com', password:'1234'})
            .end(function (err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res).to.have.cookie('authToken')
            })
    })
    it ('Check token test', function (){
        chai.request(baseUrl)
            .post('/api/login')
            .send({email:'inesni426@gmail.com', password:'1234'})
            .end(function (err,res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res).to.have.cookie('authToken')
                authCookie = res.header['set-cookie'][0]
                cookie = authCookie.split("=")[1]
                token = authCookie.split(";")[0].split("=")[1]
                //Correct token
                chai.request(baseUrl)
                .post('/api/check-token')
                .send({"token":token})
                .end(function (err,res){
                    expect(res).to.have.status(200)
                })
                //Wrong token
                chai.request(baseUrl)
                .post('/api/check-token')
                .send({"token":"test"})
                .end(function (err,res){
                    expect(res).to.have.status(401)
                })
            })
    })
})