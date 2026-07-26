const repository = require("./feeHead.repository");

exports.createFeeHead = async (data) => {

    const duplicate = await repository.checkDuplicate(
        data.fee_name.trim()
    );

    if (duplicate) {
        throw new Error("Fee Head already exists.");
    }

    const feeHeadId = await repository.createFeeHead({
        fee_name: data.fee_name.trim(),
        description: data.description?.trim() || "",
        status: data.status || "Active",
    });

    return repository.getFeeHeadById(feeHeadId);
};

exports.getAllFeeHeads = async (query) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    return repository.getAllFeeHeads({
        page,
        limit,
        search: query.search || "",
        status: query.status || "",
    });
};

exports.getFeeHeadById = async (id) => {

    const feeHead = await repository.getFeeHeadById(id);

    if (!feeHead) {
        throw new Error("Fee Head not found.");
    }

    return feeHead;
};

exports.updateFeeHead = async (id, data) => {

    const feeHead = await repository.getFeeHeadById(id);

    if (!feeHead) {
        throw new Error("Fee Head not found.");
    }

    await repository.updateFeeHead(id, {
        fee_name: data.fee_name.trim(),
        description: data.description?.trim() || "",
        status: data.status,
    });

    return repository.getFeeHeadById(id);
};

exports.deleteFeeHead = async (id) => {

    const feeHead = await repository.getFeeHeadById(id);

    if (!feeHead) {
        throw new Error("Fee Head not found.");
    }

    await repository.deleteFeeHead(id);

    return true;
};