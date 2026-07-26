const Joi = require("joi");

exports.createMarkSchema = Joi.object({
    student_id: Joi.number().integer().positive().required(),

    academic_year_id: Joi.number().integer().positive().required(),

    class_id: Joi.number().integer().positive().required(),

    section_id: Joi.number().integer().positive().required(),

    exam_id: Joi.number().integer().positive().required(),

    subject_id: Joi.number().integer().positive().required(),

    total: Joi.number().min(0).required(),

    obtained: Joi.number()
        .min(0)
        .max(Joi.ref("total"))
        .required()
        .messages({
            "number.max": "Obtained marks cannot be greater than total marks."
        }),

    remark: Joi.string().allow("").optional(),

    status: Joi.string()
        .valid("Active", "Inactive")
        .default("Active")
});

exports.updateMarkSchema = Joi.object({
    total: Joi.number().min(0).required(),

    obtained: Joi.number()
        .min(0)
        .max(Joi.ref("total"))
        .required()
        .messages({
            "number.max": "Obtained marks cannot be greater than total marks."
        }),

    remark: Joi.string().allow("").optional(),

    status: Joi.string()
        .valid("Active", "Inactive")
        .default("Active")
});

exports.bulkCreateMarksSchema = Joi.object({
    marks: Joi.array()
        .items(exports.createMarkSchema)
        .min(1)
        .required()
});