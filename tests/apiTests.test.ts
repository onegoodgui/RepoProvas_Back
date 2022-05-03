import {createUser, Login} from './factories/authFactory.js'
import supertest from 'supertest'
import { client } from '../src/database.js';
import app from '../src/app.js'
import { createDiscipline } from './factories/filterFactory.js';
import { createAndInsertTest, createDisciplineByName, createTeacherByName, createTest, findDisciplineIdByName, findTeacherIdByName } from './factories/testFactory.js';

const agent = supertest(app);

describe('POST /sign-in', () => {

    beforeEach(async () => {
       await client.$executeRaw`TRUNCATE TABLE users, sessions;`
    });

    it('should answer with status 200 when credentials are valid', async () => {
        const userData = await createUser();
        const response = await agent.post('/sign-in').send({email: userData.user.email, password: userData.user.password});
        expect(response.status).toBe(200);
    })
})

describe('GET /filter/:filterType/?filterSearch=', () => {
    
    beforeEach(async () => {
       await client.$executeRaw`TRUNCATE TABLE users, sessions;`
    });

    it('should retrieve `Cálculo` and `Cálculo II` when filtering by `discipline` with `Cálculo`', async () => {
        const {user} = await createUser();
        const token = await Login(user.email, user.password);

        const {body: results} = await agent.get('/filter/disciplines').set('Authorization', `Bearer ${token}`).query({filterSearch: 'Cálculo'});
        const [[res1], [res2]] = results.map(arr => arr.discipline.map(d => d.name));

        expect(res1).toBe('Cálculo');
        expect(res2).toBe('Cálculo II');
    })

    it('should retrieve `Inácio` and `Ivone` when filtering by `teachers` with `I`', async () => {
        const {user} = await createUser();
        const token = await Login(user.email, user.password);

        const {body: results} = await agent.get('/filter/teachers').set('Authorization', `Bearer ${token}`).query({filterSearch: 'I'});

        const [res1, res2] = results.map(teacher => teacher.name); 

        expect(res1).toBe('Ivone');
        expect(res2).toBe('Inácio');
    })


    it('should retrieve every discipline when filter is empty', async () => {

        await client.$executeRaw`TRUNCATE TABLE disciplines, "teachersDisciplines", tests;`

        const newDiscipline = await createDiscipline();

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const {body: results} = await agent.get('/filter/disciplines').set('Authorization', `Bearer ${token}`).query({filterSearch: ''});
        const [[discipline]] = results.map(arr => arr.discipline.map(d => d.name));


        expect(newDiscipline.name).toBe(discipline);
    })

    it('should retrieve empty when filter does not match any discipline. In this example, I will be searching for `Cálculo`, but only `Algoritmos will be stored`', async() => {

        await client.$executeRaw`TRUNCATE TABLE disciplines, "teachersDisciplines", tests;`

        await createDiscipline();

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const {body: results} = await agent.get('/filter/disciplines').set('Authorization', `Bearer ${token}`).query({filterSearch: 'Cálculo'});

        expect(results).toHaveLength(0);
    })
})

describe('PATCH /tests/:id', () => {

    beforeEach(async () => {
        await client.$executeRaw`TRUNCATE TABLE users, sessions;`
     });

    it('should add 1 in the view count when valid test id is requested', async() => {
        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const test = await createAndInsertTest();

        const {user} = await createUser();
        const token = await Login(user.email, user.password);

        const {views: initialViews} = await client.tests.findUnique({where:{id: test.id}});

        await agent.patch(`/tests/${test.id}`).set('Authorization', `Bearer ${token}`);

        const {views: updatedViews} = await client.tests.findUnique({where:{id: test.id}});


        expect(updatedViews).toBe(initialViews+1);
    })

    it('should return an `Unprocessable entity error` when invalid test id is requested', async () => {
        const invalidId = 12312311;

        const {user} = await createUser();
        const token = await Login(user.email, user.password);

        const result = await agent.patch(`/tests/${invalidId}`).set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(422);
        expect(result.text).toBe('test id does not exist');
    })
})

describe('POST /tests', () => {

    it('should return an `Unprocessable entity error` when there is missing data on submit', async () => {

        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const test = await createAndInsertTest();
        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name: test.name, pdfUrl:'', categoryId:test.categoryId, teacherDisciplineId: test.teacherDisciplineId});

        expect(result.status).toEqual(422);
        expect(result.text).toBe('invalid data');

    })

    it('should return an `Unprocessable entity error` when the pdf URL is not valid', async () => {
        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const test = await createAndInsertTest();
        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name: test.name, pdfUrl:'https://www.hltv.org/', categoryId:test.categoryId, teacherDisciplineId: test.teacherDisciplineId});

        expect(result.status).toEqual(422);
        expect(result.text).toBe('invalid data');
    })

    it('should return a `Conflict error` when inserting a test with same categoryId, teacherDisciplineId and name as previously stored', async () =>{
        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const test = await createAndInsertTest();

        const {name: category} = await client.categories.findFirst({
            where:{
                id: test.categoryId
            }
        })

        const {teacher: {name: teacher}, discipline:{name: discipline}} = await client.teachersDisciplines.findFirst({
            where:{
                id: test.teacherDisciplineId
            },
            select:{
                discipline: true,
                teacher:true
            }
        })

        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name: test.name, url:test.pdf, category, teacher, discipline});

        expect(result.status).toEqual(409);
        expect(result.text).toBe('this test already exists');
    })

    it('should return an `Unprocessable entity error` when the pdf URL is not valid', async () => {
        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const test = await createAndInsertTest();
        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name: test.name, pdfUrl:'https://www.hltv.org/', categoryId:test.categoryId, teacherDisciplineId: test.teacherDisciplineId});

        expect(result.status).toEqual(422);
        expect(result.text).toBe('invalid data');
    })

    it('should return a `Not found error` when inserting a test with unexisting category', async () =>{
        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const test = await createTest();
        const unexistingCategory = 'P12341234'

        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name: test.name, url:test.pdf, category:unexistingCategory, teacher:test.teacher.name, discipline:test.discipline.name});

        expect(result.status).toEqual(404);
        expect(result.text).toBe('this category does not exist');
    })

    it('should return a `Conflict error` when inserting a discipline not lectured by the selected teacher', async () =>{
        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const name = '2019/2'
        const category = 'P1';
        const url = 'https://educapes.capes.gov.br/retrieve/166324/eBook_Equacoes_Diferenciais-Licenciatura_Matematica_UFBA.pdf';

        const firstDiscipline = await createDisciplineByName('Cálculo');
        const secondDiscipline = await createDisciplineByName('Equações Diferenciais');
        const firstTeacher = await createTeacherByName('Ivone');
        const secondTeacher = await createTeacherByName('Cydara');

        await client.teachersDisciplines.createMany({
            data:[
                {disciplineId: firstDiscipline.id, teacherId: firstTeacher.id},
                {disciplineId: secondDiscipline.id, teacherId: secondTeacher.id}
            ]
        })

        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name, url, category, teacher:'Cydara', discipline:'Cálculo'});

        expect(result.status).toEqual(409);
        expect(result.text).toBe('this discipline does not belong to this teacher');
    })

    it('should return status 201 when submit data is fully valid', async () => {

        await client.$executeRaw`TRUNCATE TABLE disciplines, teachers, "teachersDisciplines", tests, users, sessions;`

        const {user} = await createUser();
        const token = await Login(user.email, user.password);
        const name = '2019/2'
        const category = 'P1';
        const url = 'https://educapes.capes.gov.br/retrieve/166324/eBook_Equacoes_Diferenciais-Licenciatura_Matematica_UFBA.pdf';

        const discipline = await createDisciplineByName('Cálculo');
        const teacher = await createTeacherByName('Ivone');

        await client.teachersDisciplines.create({
            data:
                {disciplineId: discipline.id, teacherId: teacher.id},
            
        })

        const result = await agent.post('/tests').set('Authorization', `Bearer ${token}`).send({name, url, category, teacher:teacher.name, discipline:discipline.name});
        
        expect(result.status).toEqual(201)
    })

    
})