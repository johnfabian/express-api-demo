const isObject = (value) => value !== null && typeof value === 'object';

const optionValue = (option) =>
    isObject(option) && Object.hasOwn(option, 'value') ? option.value : option;

export const getValueId = (value) => {
    const selectedValue = optionValue(value);

    if (selectedValue === undefined || selectedValue === null) return undefined;
    return isObject(selectedValue) ? selectedValue.id : selectedValue;
};

export const getOptionLabel = (options, value, labelKey = 'label') => {
    const valueId = getValueId(value);
    const option = options.find((candidate) => getValueId(candidate) === valueId);

    if (option) return option[labelKey] ?? '';

    const selectedValue = optionValue(value);
    if (selectedValue === undefined || selectedValue === null) return '';
    if (isObject(selectedValue)) return selectedValue[labelKey] ?? '';

    return String(selectedValue);
};
