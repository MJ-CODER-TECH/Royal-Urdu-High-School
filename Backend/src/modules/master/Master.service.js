const masterRepository = require("./master.repository");


// Don't touch this route ok this is all conection 

exports.getAllClasses = async () => {

    return await masterRepository.getAllClasses();

};

// close 


/*
|--------------------------------------------------------------------------
| Class Management
|--------------------------------------------------------------------------
*/

exports.getClasses = async () => {

    return await masterRepository.getClasses();

};


exports.getClassById = async (id) => {

    return await masterRepository.getClassById(id);

};


exports.createClass = async (data) => {

    return await masterRepository.createClass(data);

};


exports.updateClass = async (id, data) => {

    return await masterRepository.updateClass(
        id,
        data
    );

};


exports.deleteClass = async (id) => {

    return await masterRepository.deleteClass(id);

};


exports.changeClassStatus = async (id, status) => {

    return await masterRepository.changeClassStatus(
        id,
        status
    );

};

/*
|--------------------------------------------------------------------------
| Section Management
|--------------------------------------------------------------------------
*/

exports.getSections = async () => {
    return await masterRepository.getSections();
};


exports.getAllSections = async () => {
    return await masterRepository.getSections();
};


exports.getSectionById = async (id) => {

    return await masterRepository.getSectionById(id);

};


exports.createSection = async (data) => {

    return await masterRepository.createSection(data);

};


exports.updateSection = async (id, data) => {

    return await masterRepository.updateSection(
        id,
        data
    );

};


exports.deleteSection = async (id) => {

    return await masterRepository.deleteSection(id);

};


exports.changeSectionStatus = async (id, status) => {

    return await masterRepository.changeSectionStatus(
        id,
        status
    );

};


    
// dont touch this 
exports.getAllAcademicYears = async () => {

    return await masterRepository.getAllAcademicYears();

};

// close 

/*
|--------------------------------------------------------------------------
| Academic Year Management
|--------------------------------------------------------------------------
*/


exports.getAcademicYears = async () => {

    return await masterRepository.getAcademicYears();

};



exports.getAcademicYearById = async (id) => {

    return await masterRepository.getAcademicYearById(id);

};



exports.createAcademicYear = async (data) => {

    return await masterRepository.createAcademicYear(data);

};



exports.updateAcademicYear = async (id, data) => {

    return await masterRepository.updateAcademicYear(
        id,
        data
    );

};



exports.deleteAcademicYear = async (id) => {

    return await masterRepository.deleteAcademicYear(id);

};



exports.changeAcademicYearStatus = async (
    id,
    status
) => {

    return await masterRepository.changeAcademicYearStatus(
        id,
        status
    );

};



exports.getAllSubjects = async()=>{

    return await masterRepository.getAllSubjects();

};