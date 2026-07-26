const examService = require("./exam.service");


exports.getExams = async(req,res)=>{

    try{

        const data = await examService.getExams();

        res.json({
            success:true,
            data
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



exports.getExamById = async(req,res)=>{

    try{

        const data =
        await examService.getExamById(
            req.params.id
        );


        res.json({
            success:true,
            data
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



exports.createExam = async (req, res) => {

    console.log("REQ BODY =>", req.body);

    try {

        const data = await examService.createExam(req.body);

        res.json({
            success: true,
            data,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};



exports.updateExam = async(req,res)=>{

    try{

        await examService.updateExam(
            req.params.id,
            req.body
        );


        res.json({
            success:true,
            message:"Exam updated"
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



exports.deleteExam = async(req,res)=>{

    try{

        await examService.deleteExam(
            req.params.id
        );


        res.json({
            success:true,
            message:"Exam deleted"
        });


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};


exports.changeExamStatus = async (
    req,
    res
) => {

    try {

        const { status } = req.body;

        await examService.changeExamStatus(
            req.params.id,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Exam status updated successfully."
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};