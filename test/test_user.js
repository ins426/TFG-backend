var chai = require('chai')
    ,chaiHttp = require('chai-http')
chai.use((chaiHttp))
var expect = chai.expect
var baseUrl = "http://localhost:8080"

describe('User test',function (){
    it('User management test', function () {
        chai.request(baseUrl)
            .post('/api/login')
            .send({email: 'inesni426@gmail.com', password: '1234'})
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res).to.have.cookie('authToken')
                authCookie = res.header['set-cookie'][0]

                //Test patients
                //Create user
                chai.request(baseUrl)
                    .post('/api/user')
                    .set({'Cookie': authCookie})
                    .send({
                        email: "e.ins26+test@gmail.com", name: "Test", surname: "Test", rol: "paciente",
                        idPsychologist: undefined
                    })
                    .end(function (err, res) {
                       expect(res).to.have.status(201)
                        idUser = res.body['id']

                        //List of patients
                        chai.request(baseUrl)
                        .get('/api/patients')
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                            expect(res.body.length).to.not.equals(0)
                           expect(res).to.have.status(201)
                        })

                        //Edit user
                        chai.request(baseUrl)
                        .put('/api/patient')
                            .send({idPatient: idUser, name:"Test2", surname:"Test2"})
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })
                        //Delete user
                        chai.request(baseUrl)
                        .delete('/api/user/'+idUser)
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })
                    })

                //Test psychologist
                //Create user
                chai.request(baseUrl)
                    .post('/api/user')
                    .set({'Cookie': authCookie})
                    .send({
                        email: "e.ins26+test2@gmail.com", name: "Test", surname: "Test", rol: "psicologo",
                        ColorCategory:"85f79b",
                        idPsychologist: undefined
                    })
                    .end(function (err, res) {
                       expect(res).to.have.status(201)
                        idUser = res.body['id']

                        //List of psychologists
                        chai.request(baseUrl)
                        .get('/api/psychologists')
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                            expect(res.body.length).to.not.equals(0)
                           expect(res).to.have.status(201)
                        })

                        //Edit user
                        chai.request(baseUrl)
                        .put('/api/psychologist')
                            .send({idPatient: idUser, name:"Test2", surname:"Test2", ColorCategory:"85f79b"})
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })
                        //Delete user
                        chai.request(baseUrl)
                        .delete('/api/user/'+idUser)
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })
                    })

            })

    })
    it('Forget password test', function () {
        chai.request(baseUrl)
            .put('/api/forget-password')
            .send({email:'e.ins26+test@go.ugr.es'})
            .end(function (err, res) {
                expect(res).to.have.status(201)
            })
    })

    it('Set password test',function (){
        chai.request(baseUrl)
            .post('/api/login')
            .send({email: 'inesni426@gmail.com', password: '1234'})
            .end(function (err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res).to.have.cookie('authToken')
                authCookie = res.header['set-cookie'][0]
                token = authCookie.split(";")[0].split("=")[1]

                //First, a user is created
                chai.request(baseUrl)
                    .post('/api/user')
                    .set({'Cookie': authCookie})
                    .send({
                        email: "e.ins26+test3@gmail.com", name: "Test", surname: "Test", rol: "psicologo",
                        ColorCategory:"85f79b",
                        idPsychologist: undefined
                    })
                    .end(function (err, res) {
                        expect(res).to.have.status(201)
                        idUser = res.body['id']

                            //Second password is changed
                        chai.request(baseUrl)
                            .post('/api/activate-account')
                            .send({token:token,email:"e.ins26+test@gmail.com",password:"1234"})
                            .end(function (err,res){
                                expect(res).to.have.status(201)
                            })

                        //Delete user
                            chai.request(baseUrl).delete('/api/user/'+idUser)
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })
                    }

                    )
            })
    })

    it("Get user's psychologist",function (){
         chai.request(baseUrl)
            .post('/api/login')
            .send({email: 'inesni426@gmail.com', password: '1234'})
            .end(function (err, res) {
                                chai.request(baseUrl)
                    .post('/api/user')
                    .set({'Cookie': authCookie})
                    .send({
                        email: "e.ins26+test4@gmail.com", name: "Test", surname: "Test", rol: "psicologo",
                        ColorCategory:"85f79b",
                        idPsychologist: undefined
                    })
                    .end(function (err, res) {
                        expect(res).to.have.status(201)
                        idPsychologist = res.body['id']

                                        chai.request(baseUrl)
                    .post('/api/user')
                    .set({'Cookie': authCookie})
                    .send({
                        email: "e.ins26+test5@gmail.com", name: "Test", surname: "Test", rol: "paciente",
                        idPsychologist: idPsychologist
                    })
                    .end(function (err, res) {
                       expect(res).to.have.status(201)
                        idPatient = res.body['id']

                        chai.request(baseUrl).post('/api/patient-psychologist')
                            .set({'Cookie': authCookie})
                            .send({patientId:idPatient})
                            .end(function (err,res){
                                expect(res.body['_id']).to.be.equals(idPsychologist)
                            })

                        //Delete patient
                            chai.request(baseUrl).delete('/api/user/'+idPatient)
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })

                        //Delete psychologist
                        chai.request(baseUrl).delete('/api/user/'+idPsychologist)
                        .set({'Cookie': authCookie})
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                        })
                    })
                    })
            })

    })
})