const masterService = require("./master.service");




// Don't touch this route ok this is all conection 

exports.getAllClasses = async (req, res) => {

    const classes = await masterService.getAllClasses();

    res.status(200).json({
        success: true,
        data: classes
    });

};


// close 

/*
|--------------------------------------------------------------------------
| Class Management
|--------------------------------------------------------------------------
*/

exports.getClasses = async (req, res) => {

    const data = await masterService.getClasses();

    res.status(200).json({
        success: true,
        data
    });

};

exports.getClassById = async (req, res) => {

    const data = await masterService.getClassById(req.params.id);

    res.status(200).json({
        success: true,
        data
    });

};

exports.createClass = async (req, res) => {

    const result = await masterService.createClass(req.body);

    res.status(201).json({
        success: true,
        message: "Class created successfully.",
        data: result
    });

};

exports.updateClass = async (req, res) => {

    const result = await masterService.updateClass(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Class updated successfully.",
        data: result
    });

};

exports.deleteClass = async (req, res) => {

    await masterService.deleteClass(req.params.id);

    res.status(200).json({
        success: true,
        message: "Class deleted successfully."
    });

};

exports.changeClassStatus = async (req, res) => {

    const { is_active } = req.body;

    await masterService.changeClassStatus(
        req.params.id,
        is_active
    );

    res.status(200).json({
        success: true,
        message: "Class status updated successfully."
    });

};




// dont touch this controller 

exports.getAllSections = async (req, res) => {

    const sections = await masterService.getSections();

    res.status(200).json({
        success: true,
        data: sections
    });

};
// close

exports.getSections = async (req, res) => {

    const data = await masterService.getSections();

    res.status(200).json({
        success: true,
        data,
    });

};

exports.getSectionById = async (req, res) => {

    const data = await masterService.getSectionById(
        req.params.id
    );

    res.status(200).json({
        success: true,
        data,
    });

};

exports.createSection = async (req, res) => {

    await masterService.createSection(req.body);

    res.status(201).json({
        success: true,
        message: "Section created successfully.",
    });

};

exports.updateSection = async (req, res) => {

    await masterService.updateSection(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Section updated successfully.",
    });

};

exports.deleteSection = async (req, res) => {

    await masterService.deleteSection(req.params.id);

    res.status(200).json({
        success: true,
        message: "Section deleted successfully.",
    });

};

exports.changeSectionStatus = async (req, res) => {

    await masterService.changeSectionStatus(
        req.params.id,
        req.body.is_active
    );

    res.status(200).json({
        success: true,
        message: "Status updated successfully.",
    });

};








// dont touch this controller 

exports.getAllAcademicYears = async (req, res) => {

    const data =
        await masterService.getAllAcademicYears();

    res.status(200).json({

        success: true,

        data,

    });

};
// close 

/*
|--------------------------------------------------------------------------
| Academic Year Management
|--------------------------------------------------------------------------
*/

exports.getAcademicYears = async (req, res) => {

    const data =
        await masterService.getAcademicYears();


    res.status(200).json({

        success:true,

        data,

    });

};



exports.getAcademicYearById = async (req,res)=>{

    const data =
        await masterService.getAcademicYearById(
            req.params.id
        );


    res.status(200).json({

        success:true,

        data,

    });

};



exports.createAcademicYear = async(req,res)=>{


    await masterService.createAcademicYear(
        req.body
    );


    res.status(201).json({

        success:true,

        message:"Academic year created successfully."

    });

};



exports.updateAcademicYear = async(req,res)=>{


    await masterService.updateAcademicYear(
        req.params.id,
        req.body
    );


    res.status(200).json({

        success:true,

        message:"Academic year updated successfully."

    });

};



exports.deleteAcademicYear = async(req,res)=>{


    await masterService.deleteAcademicYear(
        req.params.id
    );


    res.status(200).json({

        success:true,

        message:"Academic year deleted successfully."

    });

};



exports.changeAcademicYearStatus = async(req,res)=>{


    await masterService.changeAcademicYearStatus(
        req.params.id,
        req.body.is_active
    );


    res.status(200).json({

        success:true,

        message:"Status updated successfully."

    });

};



exports.getAllSubjects = async (req,res)=>{

    const data = await masterService.getAllSubjects();

    res.status(200).json({
        success:true,
        data
    });

};



exports.getSectionsByClassId = async(req,res)=>{

    const data =
        await masterService.getSectionsByClassId(
            req.params.class_id
        );


    res.status(200).json({

        success:true,

        data

    });

};