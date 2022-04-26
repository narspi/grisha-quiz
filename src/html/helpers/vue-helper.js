module.exports = function(options) {
    let middle =  options.fn(this).trim();
    let bolder = `{{${middle}}}`;
    return bolder;
}