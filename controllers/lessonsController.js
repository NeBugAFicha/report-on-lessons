const {
  lesson_students,
  lesson_teachers,
  lessons,
  students,
  teachers,
  sequelize,
  DataTypes,
} = require('../db/sequelizeConnection');
const fs = require('fs');
const { Op, Sequelize } = require('sequelize');
const { resolveObjectURL } = require('buffer');
const { group } = require('console');
class LessonController {
  getLessons_get(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexStream = fs.createReadStream(
      '/Users/anastas/VSCode-projects/report-on-lessons/views/index.html',
      'utf-8',
    );
    indexStream.pipe(res);
  }
  static validateAndReadyArgumentObj({
    date,
    status,
    studentsCount,
    page,
    teacherIds,
    lessonsPerPage,
  }) {
    const dateCheck =
      /^([1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01]),)?[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/;
    const statusCheck = /^[01]$/;
    const teacherIdsCheck = /^([1-9]\d*,)*[1-9]\d*$/;
    const studentsCountCheck = /^(\d+,)?\d+$/;
    const pageAndLessonsPerPageCheck = /^\d+$/;
    let argumentObj = {
      attributes:['id',[Sequelize.literal('COUNT(CASE WHEN lesson_students.visit THEN 1 ELSE 0 END)'), 'visitCount']],
      include:[{
        attributes:[],
        model: lesson_students,
        as: 'lesson_students'
      }],
      order:[['id','asc']],
      group: ['id'],
      where:{},
      having:[]
    };
    if(studentsCount) {
      if (studentsCountCheck.test(studentsCount)){
        studentsCount =
          studentsCount.split(',').length == 1
            ? [Number(studentsCount), Number(studentsCount)]
            : studentsCount
                .split(',')
                .sort()
                .map((studentsCount) => Number(studentsCount));
      }else throw new Error('Invalid data (studentsCount');
      argumentObj.having.push(Sequelize.where(Sequelize.fn('COUNT', Sequelize.col('student_id')), {
        [Op.between]: studentsCount
      }));
    }
    if (teacherIds) {
      if (teacherIdsCheck.test(teacherIds)) {
        teacherIds = teacherIds.split(',').map((id) => Number(id));
      } else throw new Error('Invalid data (teacherIds)');
      argumentObj.group.push('teacher_id');
      argumentObj.include.push({
        attributes:[],
        model: lesson_teachers,
        as: 'lesson_teachers',
      });
      argumentObj.having.push(Sequelize.where(Sequelize.col('teacher_id'), {
        [Op.in]: teacherIds
      }));
    }
    if (date) {
      if (dateCheck.test(date)) {
        let dates =
          date.split(',').length == 1
            ? [new Date(date), new Date(date)]
            : date
                .split(',')
                .sort()
                .map((date) => new Date(date));
        argumentObj.where.date = { [Op.between]: dates } ;
      } else throw new Error('Invalid data (date)');
    }
    if (status) {
      if (statusCheck.test(status)) {
        argumentObj.where.status = status;
      } else throw new Error('Invalid data (status)');
    }
    if (page) {
      if (pageAndLessonsPerPageCheck.test(page)) page = Number(page);
      else throw new Error('Invalid data (page)');
    } else page = 1;
    if (lessonsPerPage) {
      if (pageAndLessonsPerPageCheck.test(lessonsPerPage))
        lessonsPerPage = Number(lessonsPerPage);
      else throw new Error('Invalid data (lessonsPerPage)');
    } else lessonsPerPage = 5;
    return {
      argumentObj,
      page,
      lessonsPerPage
    };
  }

  async getLessons_post(req, res) {
    let resultLessons = [];
    let {
        argumentObj,
        page,
        lessonsPerPage
      } = LessonController.validateAndReadyArgumentObj(req.body);
    
    try{
      let lessonsFiltered = await lessons.findAll(argumentObj);
      lessonsFiltered.forEach((lesson)=>{
        resultLessons.push({visitCount:lesson.dataValues.visitCount});
      })
      if(lessonsFiltered.length==0) return res.json({resultLessons,page,lessonsPerPage});
      argumentObj = {
        include: [
          {
            model: lesson_students,
            as: 'lesson_students',
            include: [
              {
                model: students,
                as: 'student',
              },
            ]
          },
          {
            model: lesson_teachers,
            as: 'lesson_teachers',
            include: [
              {
                model: teachers,
                as: 'teacher',
              },
            ],
          }
        ],
        order: [['id','asc']],
        where: {
          'id':{
            [Op.in]: lessonsFiltered.map(lesson=>lesson.dataValues.id)
          }
        }
      }
      
      lessonsFiltered = await lessons.findAll(argumentObj);
      lessonsFiltered.forEach((lesson,i)=>{
        const { id, date, title, status } = lesson.dataValues;
        let resultLesson = { id, date, title, status, visitCount: resultLessons[i].visitCount};
        resultLesson.teachers = lesson.lesson_teachers.map(
          (lesson_teacher) => {
            const { id, name } = lesson_teacher.dataValues.teacher.dataValues;
            return { id, name };
          },
        );
        resultLesson.students = lesson.lesson_students.map(
            (lesson_student) => {
              const { id, name } =
                lesson_student.dataValues.student.dataValues;
              return { id, name, visit: lesson_student.visit };
            },
        );
        resultLessons[i] = resultLesson;
       }
      )
      res.json({ resultLessons, page, lessonsPerPage });
    }catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  createLesson_get(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const indexStream = fs.createReadStream(
      '/Users/anastas/VSCode-projects/report-on-lessons/views/createLessons.html',
      'utf-8',
    );
    indexStream.pipe(res);
  }

  async createLesson_post(req, res) {
    let { teacherIds, days, title, firstDate, lessonsCount, lastDate } =
      req.body;
    const dateCheck = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/;
    const teacherIdsCheck = /^([1-9]\d*,)*[1-9]\d*$/;
    const lessonsCountCheck = /^[1-9]\d*$/;
    const daysCheck = /^([0-6],)*[0-6]$/;
    if (
      dateCheck.test(firstDate) &&
      teacherIdsCheck.test(teacherIds) &&
      daysCheck.test(days) &&
      (lessonsCount || lastDate)
    ) {
      teacherIds = teacherIds.split(',').map((id) => Number(id));
      days = days.split(',').map((day) => Number(day));
      firstDate = new Date(firstDate);
      if (days.indexOf(firstDate.getDay()) == -1)
        return res.status(400).json({ error: 'There is no day of firstDate' });
      for (let i = 0; i < days.length - 1; i++) {
        if (days.indexOf(days[i + 1]) != i + 1)
          return res
            .status(400)
            .json({ error: 'There is should be only unique days' });
        if (days[i] >= days[i + 1])
          return res
            .status(400)
            .json({ error: 'Days must be written in ascending order' });
      }
    } else return res.status(400).json({ error: 'Invalid data' });
    let lessonsDB = [];
    let oneYearBorder = new Date(
      firstDate.getFullYear() + 1,
      firstDate.getMonth(),
      firstDate.getDate(),
      3,
    );
    let newDate = firstDate;
    if (lessonsCount && lastDate)
      return res
        .status(400)
        .json({ error: 'Enter only one field: lessonsCount / lastDate' });
    if (lessonsCount && !lastDate) {
      if (!lessonsCountCheck.test(lessonsCount))
        return res.status(400).json({ error: 'Invalid data' });
      lessonsCount = Number(lessonsCount);
      if (lessonsCount > 300)
        return res.status(400).json({ error: 'Invalid data' });
      while (lessonsDB.length < lessonsCount && newDate < oneYearBorder) {
        days.forEach((day) => {
          if (lessonsDB.length == 0) {
            if (day == firstDate.getDay()) {
              lessonsDB.push({ date: firstDate, title, status: 0 });
              return;
            } else return;
          }
          let previousDate = lessonsDB[lessonsDB.length - 1].date;
          let incrementTime =
            (day -
              previousDate.getDay() +
              (previousDate.getDay() < day ? 0 : 7)) *
            1000 *
            60 *
            60 *
            24;
          newDate = new Date(previousDate.getTime() + incrementTime);
          if (lessonsDB.length < lessonsCount && newDate <= oneYearBorder)
            lessonsDB.push({ date: newDate, title, status: 0 });
        });
      }
    }
    if (!lessonsCount && lastDate) {
      if (
        !dateCheck.test(lastDate) ||
        new Date(lastDate) > oneYearBorder ||
        firstDate > lastDate
      )
        return res.status(400).json({ error: 'Invalid data' });
      lastDate = new Date(lastDate);
      while (lessonsDB.length < 300 && newDate <= lastDate) {
        days.forEach((day) => {
          if (lessonsDB.length == 0) {
            if (day == firstDate.getDay()) {
              lessonsDB.push({ date: firstDate, title, status: 0 });
              return;
            } else return;
          }
          let previousDate = lessonsDB[lessonsDB.length - 1].date;
          let incrementTime =
            (day -
              previousDate.getDay() +
              (previousDate.getDay() < day ? 0 : 7)) *
            1000 *
            60 *
            60 *
            24;
          newDate = new Date(previousDate.getTime() + incrementTime);
          if (lessonsDB.length < 300 && newDate <= lastDate)
            lessonsDB.push({ date: newDate, title, status: 0 });
        });
      }
    }
    try {
      let createdLessons = await lessons.bulkCreate(lessonsDB, {
        returning: true,
      });
      lessonsDB = [];
      createdLessons.forEach((lesson) => {
        teacherIds.forEach((teacher_id) =>
          lessonsDB.push({ lesson_id: lesson.id, teacher_id }),
        );
      });
      await lesson_teachers.bulkCreate(lessonsDB, { returning: true });
      res
        .status(200)
        .json({ createdLessons: createdLessons.map((lesson) => lesson.id) });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new LessonController();
