const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  fs = require('fs'),
  server = require('../app');

chai.use(chaiHttp);

describe('find Lessons', () => {
  const TEST_DATA = [
    //Invalid data
    {
      date: '2019-09-01,as;lkdfjals;fja;',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '201-09-01',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '2019-9-01',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '2019-09-33',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '2019-09-01,2019-05-15,2019-06-24',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '2019-0-01',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: 'jas;dfj;as',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '2',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: 'jas;lfjal;sdjfa',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '',
      studentsCount: 'jasd;flja',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: 'sajf;asjdf;',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: 'asljdf;sjdf',
    },
    //Valid filter data -> proper list of lessons
    {
      date: '2019-09-01',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '2019-09-01,2019-05-15',
      status: '0',
      teacherIds: '',
      studentsCount: '1,2',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '1',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '1,2',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '',
      studentsCount: '1,2',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '3',
      lessonsPerPage: '1',
    },
    {
      date: '',
      status: '0',
      teacherIds: '1,3',
      studentsCount: '1,7',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '2019-05-10,2019-06-24',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
    {
      date: '',
      status: '',
      teacherIds: '',
      studentsCount: '',
      page: '',
      lessonsPerPage: '',
    },
  ];
  for (let i = 0; i < 12; i++) {
    for (let prop in TEST_DATA[i])
      if (TEST_DATA[i][prop]) {
        it(`expect get an error with wrong ${prop} ${TEST_DATA[i][prop]}`, (done) => {
          chai
            .request(server)
            .post('/')
            .send(TEST_DATA[i])
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(400);
              expect(res.body.error).to.equal(`Invalid data (${prop})`);
              done();
            });
        });
      }
  }
  it(`expect get a proper list of all lessons meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[12])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[13])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[14])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[15])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[16])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[17])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[18])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[19])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
  it(`expect get a proper list of lessons  meeting the filter requirement`, (done) => {
    chai
      .request(server)
      .post('/')
      .send(TEST_DATA[20])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        res.body.resultLessons.forEach((lesson) =>
          console.log(JSON.stringify(lesson)),
        );
        done();
      });
  });
});
