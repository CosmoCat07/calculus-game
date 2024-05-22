var InputType;
(function (InputType) {
    InputType[InputType["FORWARD"] = 0] = "FORWARD";
    InputType[InputType["STOP"] = 1] = "STOP";
    InputType[InputType["LEFT"] = 2] = "LEFT";
    InputType[InputType["RIGHT"] = 3] = "RIGHT";
    InputType[InputType["STRAIGHT"] = 4] = "STRAIGHT";
    InputType[InputType["DASH"] = 5] = "DASH";
    InputType[InputType["END_DASH"] = 6] = "END_DASH";
    InputType[InputType["SHOOT"] = 7] = "SHOOT";
})(InputType || (InputType = {}));
export default InputType;
