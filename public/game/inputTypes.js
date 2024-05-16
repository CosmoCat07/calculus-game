var inputTypes;
(function (inputTypes) {
    inputTypes[inputTypes["FORWARD"] = 0] = "FORWARD";
    inputTypes[inputTypes["STOP"] = 1] = "STOP";
    inputTypes[inputTypes["LEFT"] = 2] = "LEFT";
    inputTypes[inputTypes["RIGHT"] = 3] = "RIGHT";
    inputTypes[inputTypes["STRAIGHT"] = 4] = "STRAIGHT";
    inputTypes[inputTypes["DASH"] = 5] = "DASH";
    inputTypes[inputTypes["END_DASH"] = 6] = "END_DASH";
    inputTypes[inputTypes["SHOOT"] = 7] = "SHOOT";
})(inputTypes || (inputTypes = {}));
export default inputTypes;
