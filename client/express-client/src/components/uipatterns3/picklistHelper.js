const DEFAULT_VALUE_KEY = 'value';
const DEFAULT_LABEL_KEY = 'label';
const DEFAULT_ID_KEY = 'id';

const isObject = (value) => value !== null && typeof value === 'object';

const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

const isOptionWrapper = (option, valueKey, labelKey) =>
    isObject(option) && hasOwn(option, valueKey) && hasOwn(option, labelKey);

const displayValueFor = (value, labelKey) => {
    if (value === undefined || value === null) return '';
    if (!isObject(value)) return String(value);

    const displayValue = value[labelKey];
    return displayValue === undefined ? '' : String(displayValue);
};

const getSelectedValue = (
    selected,
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
) => (isOptionWrapper(selected, valueKey, labelKey) ? selected[valueKey] : selected);

const getSelectedId = (
    selected,
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
    idKey = DEFAULT_ID_KEY,
) => {
    const value = getSelectedValue(selected, labelKey, valueKey);

    if (value === undefined || value === null) return undefined;
    if (!isObject(value)) return value;

    return value[idKey];
};

const selectedValuesMatch = (
    option,
    selected,
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
    idKey = DEFAULT_ID_KEY,
) => {
    const optionValue = getSelectedValue(option, labelKey, valueKey);
    const selectedValue = getSelectedValue(selected, labelKey, valueKey);
    const optionId = getSelectedId(optionValue, labelKey, valueKey, idKey);
    const selectedId = getSelectedId(selectedValue, labelKey, valueKey, idKey);

    if (optionId !== undefined || selectedId !== undefined) {
        return optionId === selectedId;
    }

    return Object.is(optionValue, selectedValue);
};

const getSelectedOption = (
    options,
    selected,
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
    idKey = DEFAULT_ID_KEY,
) =>
    options.find((option) => selectedValuesMatch(option, selected, labelKey, valueKey, idKey)) ??
    null;

const labelFor = (
    option,
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
) => {
    if (isOptionWrapper(option, valueKey, labelKey)) {
        return displayValueFor(option, labelKey);
    }

    return displayValueFor(getSelectedValue(option, labelKey, valueKey), labelKey);
};

const getSelectedLabel = (
    options,
    selected,
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
    idKey = DEFAULT_ID_KEY,
) => {
    const option = getSelectedOption(options, selected, labelKey, valueKey, idKey);

    return labelFor(option ?? selected, labelKey, valueKey);
};

export const createPicklistHelper = (
    labelKey = DEFAULT_LABEL_KEY,
    valueKey = DEFAULT_VALUE_KEY,
    idKey = DEFAULT_ID_KEY,
) => ({
    getSelectedValue: (selected) => getSelectedValue(selected, labelKey, valueKey),
    getSelectedId: (selected) => getSelectedId(selected, labelKey, valueKey, idKey),
    getSelectedLabel: (options, selected) =>
        getSelectedLabel(options, selected, labelKey, valueKey, idKey),
});

export const picklistHelper = {
    getSelectedValue,
    getSelectedId,
    getSelectedLabel,
};

export default picklistHelper;
