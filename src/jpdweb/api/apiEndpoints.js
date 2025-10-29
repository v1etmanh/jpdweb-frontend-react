// src/api/constants/apiEndpoints.js
export const API_ENDPOINTS = {
    // Customer
    CUSTOMER: {
        GET_ACCOUNT: '/api/customer/account_infor',
        UPLOAD_PROFILE: '/api/customer/upload_profile',
        LEARNING_LIST: '/api/customer/learning_course_list',
        COURSE_OVERVIEW: '/api/customer/learning/:courseId/courseOverview',
        MODULE_CONTENT: '/api/customer/learning/:courseId/:chapterId/:moduleId/moduleContent',
        EVALUATE: '/api/customer/evaluate/evaluate',
        ADD_WISHLIST: '/api/wishlist/:courseId',
        ENROLL_COURSE: '/api/enroll/:courseId',
        FINISH_CONTENT:'/api/customer/learning/:courseId/:moduleId/finish_content'
    },

    // Creator
    CREATOR: {
        GET_ACCOUNT: '/api/creator/getAccount',
        UPLOAD_PAYPAL_EMAIL: '/api/creator/upload/paypalEmail',
        UPLOAD_CERTIFICATE: '/api/creator/upade_certificate',
        CREATE_COURSE: '/api/creator/course/create',
        GET_COURSES: '/api/creator/course',
        GET_COURSE_BY_ID: '/api/creator/course/:id',
        UPDATE_COURSE: '/api/creator/course/:id',
        GET_STATISTIC: '/api/creator/getStatisticInfor',
        CHANGE_COURSE_STATUS: '/api/creator/course/:id/setCourseStatus',
        GET_COMMERCIAL_COURSES: '/api/creator/course/retrieve_CommercialCourese',
        GET_ENROLLMENT: '/api/creator/enrollment/:courseId',
        CREATE_WITHDRAW: '/api/creator/createWithdraw',
        TRANSACTION_HISTORY: '/api/creator/history_transaction',

        // Chapter
        CREATE_CHAPTER: '/api/creator/:courseId/chapter',
        DELETE_CHAPTER: '/api/creator/:courseId/chapter/:chapterId',
        UPDATE_CHAPTER: '/api/creator/:courseId/chapter/:chapterId/update',

        // Module
        CREATE_MODULE: '/api/creator/:courseId/:chapterId/module',
        DELETE_MODULE: '/api/creator/:courseId/:chapterId/module/:moduleId',
        UPDATE_MODULE:  '/api/creator/:courseId/:chapterId/module/:moduleId/update',

        // Module Content
        UPDATE_MODULE_CONTENT: '/api/creator/:courseId/:chapterId/:moduleId',
        DELETE_MODULE_CONTENT: '/api/creator/:courseId/:chapterId/:moduleId/:contentId',
        DELETE_CONTENT_BY_TYPE: '/api/creator/:courseId/:chapterId/:moduleId/deleteModuleContentByType',
        GET_CONTENT_BY_TYPE: '/api/creator/:courseId/:chapterId/:moduleId',

        // File Upload
        SAVE_IMAGE: '/api/creator/uploadFile/saveImg',
        SAVE_PDF: '/api/creator/uploadFile/savePdf',

        // AI
        GENERATE_FEEDBACK: '/api/creator/AI/generateFeeback',
        ANALYZE_IMAGE: '/api/creator/AI/task1/analyze',
    },

    // Course
    COURSE: {
        GET_DETAIL: '/api/course/:id',
        SEARCH: '/api/course/search',
        SEARCH_PAGINATION: '/api/course/search_pagination',
        GET_RECOMMEND: '/api/course/recommend_courses',
    },

    // Payment
    PAYMENT: {
        CREATE_ORDER: '/api/paypal/create-order/:courseId',
    },
    REMEMBERWORD:{
        RETRIEVE_ALL:'/api/customer/dictionary',
        CREATE_NEW:'/api/customer/dictionary',
        DELETE_WORD:'/api/customer/dictionary/:id',
        UPDATE_WORS:'/api/customer/dictionary'
    }
    ,
    AI:{
        WRITING_EVALUATE:'/api/customer/evaluate/evaluateWriting'
    },
    REPORT:{
      REPORT_COURSE:'/api/customer/report'
    },
    FEEDBACK:{
        CREATE_FEEDBACK:'/api/customer/feedback/:courseId'
    }
};