const chai = require('chai'),
  chaiHttp = require('chai-http'),
  expect = chai.expect,
  fs = require('fs'),
  server = require('../app');

chai.use(chaiHttp);

describe('create Lessons', () => {
  const TEST_DATA = [
    //Invalid data (11 elements)
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,7',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-34',
      lessonsCount: '',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: 'asdfa',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: 'asdfafd',
    },
    {
      teacherIds: 'saflj;slfj;',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: 'asdfasdf',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '5,0,6',
      firstDate: '2020-01-11',
      lessonsCount: '12',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '301',
      lastDate: '',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '2021-01-12',
    },
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '24',
      lastDate: '2020-03-25',
    },
    //Valid data -> proper id list of created lessons
    {
      teacherIds: '1,2',
      title: 'The World Oceans',
      days: '0,5,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '2020-01-26',
    },
    {
      teacherIds: '1,2',
      title: 'Simple math operations',
      days: '1,3,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '2021-01-11',
    },
    {
      teacherIds: '1,2,3',
      title: 'Crime and Punishment: Fyodor Dostoevskiy',
      days: '1,6',
      firstDate: '2020-01-11',
      lessonsCount: '5',
      lastDate: '',
    },
    {
      teacherIds: '3',
      title: 'Cooking tacos',
      days: '1,2,6',
      firstDate: '2020-01-11',
      lessonsCount: '20',
      lastDate: '',
    },
    {
      teacherIds: '1',
      title: '100m running',
      days: '1,6',
      firstDate: '2020-01-11',
      lessonsCount: '',
      lastDate: '2020-06-15',
    },
    {
      teacherIds: '2',
      title: 'History: Alexander The Great',
      days: '0,3,6',
      firstDate: '2020-01-12',
      lessonsCount: '10',
      lastDate: '',
    },
  ];
  for (let i = 0; i < 11; i++) {
    it(`expect get an error with wrong data`, (done) => {
      chai
        .request(server)
        .post('/lessons')
        .send(TEST_DATA[i])
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body.error).to.be.not.null;
          console.log(i);
          console.log(res.body.error);
          done();
        });
    });
  }
  it(`expect get a proper list of created lessons with length equal to 8`, (done) => {
    chai
      .request(server)
      .post('/lessons')
      .send(TEST_DATA[11])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body.createdLessons.length);
        expect(res.body.createdLessons.length).to.equal(8);
        done();
      });
  });
  it(`expect get a proper list of created lessons with length equal to 158`, (done) => {
    chai
      .request(server)
      .post('/lessons')
      .send(TEST_DATA[12])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body.createdLessons.length);
        expect(res.body.createdLessons.length).to.equal(158);
        done();
      });
  });
  it(`expect get a proper list of created lessons with length equal to 5`, (done) => {
    chai
      .request(server)
      .post('/lessons')
      .send(TEST_DATA[13])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body.createdLessons.length);
        expect(res.body.createdLessons.length).to.equal(5);
        done();
      });
  });
  it(`expect get a proper list of created lessons with length equal to 20`, (done) => {
    chai
      .request(server)
      .post('/lessons')
      .send(TEST_DATA[14])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body.createdLessons.length);
        expect(res.body.createdLessons.length).to.equal(20);
        done();
      });
  });
  it(`expect get a proper list of created lessons with length equal to 46`, (done) => {
    chai
      .request(server)
      .post('/lessons')
      .send(TEST_DATA[15])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body.createdLessons.length);
        expect(res.body.createdLessons.length).to.equal(46);
        done();
      });
  });
  it(`expect get a proper list of created lessons with length equal to 46`, (done) => {
    chai
      .request(server)
      .post('/lessons')
      .send(TEST_DATA[15])
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        console.log(res.body.createdLessons.length);
        expect(res.body.createdLessons.length).to.equal(46);
        done();
      });
  });
});
