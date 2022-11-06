var chai = require('chai')
    ,chaiHttp = require('chai-http')
chai.use((chaiHttp))
var expect = chai.expect
var baseUrl = "http://localhost:8080"

describe('Appointments test test',function (){
    it("Add patient and psychologist",function (){
       chai.request(baseUrl)
            .post('/api/login')
            .send({email: 'inesni426@gmail.com', password: '1234'})
            .end(function (err, res) {
                authCookie = res.header['set-cookie'][0]
                chai.request(baseUrl)
                    .post('/api/user')
                    .set({'Cookie': authCookie})
                    .send({
                        email: "e.ins26+test7@gmail.com", name: "Test", surname: "Test", rol: "psicologo",
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
                            email: "e.ins26+test6@gmail.com", name: "Test", surname: "Test", rol: "paciente",
                            idPsychologist: idPsychologist
                        })
                        .end(function (err, res) {
                           expect(res).to.have.status(201)
                            idPatient = res.body['id']

                            //Get available start appointments
                            chai.request(baseUrl)
                                .post('/api/available-start-appointment')
                            .set({'Cookie': authCookie})
                                .send({day:"2022-11-10", id_psychologist: idPsychologist})
                                .end(function (err,res){
                                    expect(res).to.have.status(201)
                                    startHour = res.body[0]

                                    //Get available end appointments
                                    chai.request(baseUrl)
                                        .post("/api/available-end-appointment")
                                        .set({'Cookie': authCookie})
                                        .send({chosen_start:startHour,day:"2022-11-10",
                                            id_psychologist:idPsychologist})
                                        .end(function (err,res){
                                            expect(res).to.have.status(201)
                                            endHour = res.body[0]
                                            nextEndHour = res.body[1]

                                            //Create an appointment
                                            chai.request(baseUrl)
                                                .post("/api/appointment")
                                            .set({'Cookie': authCookie})
                                                .send({
                                                    StartTime:startHour,
                                                    EndTime:endHour,
                                                    id_patient:idPatient,
                                                    id_psychologist: idPsychologist,
                                                    Subject: "Test"
                                                }).end(async function (err, res) {
                                                appointmentId = res.body['_id']
                                                expect(res).to.have.status(201)

                                                //Edit an appointment
                                                chai.request(baseUrl).put("/api/appointment/"+appointmentId)
                                                .set({'Cookie': authCookie})
                                                    .send({
                                                        StartTime:startHour,
                                                        EndTime:nextEndHour,
                                                        id_patient:idPatient,
                                                        id_psychologist: idPsychologist,
                                                        Subject: "Test"
                                                    }).end(function (err,res){
                                                        expect(res).to.have.status(201)
                                                })

                                                //Delete appointment
                                                chai.request(baseUrl).delete("/api/appointment/"+appointmentId)
                                                .set({'Cookie': authCookie})
                                                    .end(function (err,res){
                                                        expect(res).to.have.status(201)
                                                })

                                                //Delete patient
                                                await chai.request(baseUrl).delete('/api/user/' + idPatient)
                                                    .set({'Cookie': authCookie})
                                                    .end(function (err, res) {
                                                        expect(res).to.have.status(201)
                                                    })

                                                //Delete psychologist
                                                await chai.request(baseUrl).delete('/api/user/' + idPsychologist)
                                                    .set({'Cookie': authCookie})
                                                    .end(function (err, res) {
                                                        expect(res).to.have.status(201)
                                                    })
                                            })

                                        })
                                })
                        })
                })
            })
        })
    })