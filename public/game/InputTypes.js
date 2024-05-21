var InputTypes;
(function (InputTypes) {
    InputTypes[InputTypes["FORWARD"] = 0] = "FORWARD";
    InputTypes[InputTypes["STOP"] = 1] = "STOP";
    InputTypes[InputTypes["LEFT"] = 2] = "LEFT";
    InputTypes[InputTypes["RIGHT"] = 3] = "RIGHT";
    InputTypes[InputTypes["STRAIGHT"] = 4] = "STRAIGHT";
    InputTypes[InputTypes["DASH"] = 5] = "DASH";
    InputTypes[InputTypes["END_DASH"] = 6] = "END_DASH";
    InputTypes[InputTypes["SHOOT"] = 7] = "SHOOT";
})(InputTypes || (InputTypes = {}));
export default InputTypes;
