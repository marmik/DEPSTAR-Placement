const asyncHandler = (requesthandler) => async(req,res,next) => {
    try {
        await requesthandler(req,res,next);
    } catch (error) {
        res.status(err.code || 500).json({
            success : "fa;se",
            message : err.message
        });
    }
}

module.exports = asyncHandler;