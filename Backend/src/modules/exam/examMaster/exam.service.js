const examRepository = require("./exam.repository");


exports.getExams = async()=>{

    return await examRepository.getExams();

};


exports.getExamById = async(id)=>{

    return await examRepository.getExamById(id);

};


exports.createExam = async(data)=>{

    return await examRepository.createExam(data);

};


exports.updateExam = async(id,data)=>{

    return await examRepository.updateExam(
        id,
        data
    );

};


exports.deleteExam = async(id)=>{

    return await examRepository.deleteExam(id);

};

exports.changeExamStatus = async (
    id,
    status
) => {

    return await examRepository.changeExamStatus(
        id,
        status
    );

};