//module has req function and after error Next function req it and catch this error with next
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}