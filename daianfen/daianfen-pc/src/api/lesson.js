import fetch from './config';

const lesson = {
  // 课程列表
  listLesson(params) {
    return fetch.get('api/admin/v1/course/page', params)
  },
  // 查询课程
  getLesson(params) {
    return fetch.get('api/admin/v1/course/page', params)
  },
  // 发布课程
  addLesson(params) {
    return fetch.postJson('api/admin/v1/course/insert', params)
  },
  // 更新课程
  updateLesson(params) {
    return fetch.postJson('api/admin/v1/course/update', params)
  },
  // 查询课程详情
  getLesson(params) {
    return fetch.get('api/admin/v1/course/get', params)
  },
  //  删除课程
  deleteLesson(params) {
    return fetch.post('api/admin/v1/course/delete', params)
  },
  // 课程报名列表
  courseSign(params) {
    return fetch.get('api/admin/v1/courseSign/page', params)
  },

  //  新增 课程回顾
  saveLessonReview(params) {
    return fetch.postJson('api/admin/v1/reviewSummary/add', params)
  },
  //  更新 课程回顾
  updeteLessonReview(params) {
    return fetch.postJson('api/admin/v1/reviewSummary/update', params)
  },
  //  获取课 程回顾详情
  lessonReviewDetail(params) {
    return fetch.get('api/admin/v1/reviewSummary/get', params)
  },
  //  删除 课程回顾
  deleteLessonReview(params) {
    return fetch.post('api/admin/v1/reviewSummary/delete', params)
  },
  //  获取课后感
  getLessonFeel(params) {
    return fetch.get('api/admin/v1/partakeSense/page', params)
  },

  // 获取讲师列表
  listLecturer(params) {
    return fetch.get('api/admin/v1/lecturer/page', params)
  },
  // 新增讲师
  addLecturer(params) {
    return fetch.post('api/admin/v1/lecturer/insert', params)
  },
  // 讲师详情
  getLecturer(params) {
    return fetch.get('api/admin/v1/lecturer/get', params)
  },
  // 修改讲师
  updateLecturer(params) {
    return fetch.post('api/admin/v1/lecturer/update', params)
  },
  // 删除讲师
  deleteLecturer(params) {
    return fetch.post('api/admin/v1/lecturer/delete', params)
  },

  //  获取日程
  getScheduleList(params) {
    return fetch.get('api/admin/v1/calendarEvent/page', params)
  },

  // 新增班级
  addClass(params) {
    return fetch.post('api/admin/v1/courseClass/insert', params)
  },
  // 班级详情
  getClass(params) {
    return fetch.get('api/admin/v1/courseClass/get', params)
  },
  // 修改班级
  updateClass(params) {
    return fetch.post('api/admin/v1/courseClass/update', params)
  },
  // 删除班级
  deleteClass(params) {
    return fetch.post('api/admin/v1/courseClass/delete', params)
  },

  // 新增课时
  addClassHour(params) {
    return fetch.post('api/admin/v1/courseClassLesson/insert', params)
  },
  // 课时详情
  getClassHour(params) {
    return fetch.get('api/admin/v1/courseClassLesson/get', params)
  },
  // 修改课时
  updateClassHour(params) {
    return fetch.post('api/admin/v1/courseClassLesson/update', params)
  },
  // 删除课时
  deleteClassHour(params) {
    return fetch.post('api/admin/v1/courseClassLesson/delete', params)
  },

}

export default lesson
