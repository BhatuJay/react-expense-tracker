import { useState, useCallback } from "react";

export function useFormInput(
  initialValue,
  validateFn = () => true,
  errorMessage = "This field is required"
) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const validate = useCallback(
    (val) => {
      const isValid = validateFn(val);
      setError(isValid ? "" : errorMessage);
      return isValid;
    },
    [validateFn, errorMessage]
  );

  const onChange = useCallback(
    (e) => {
      const val = e.target.value;
      setValue(val);
      validate(val);
    },
    [validate]
  );

  const onBlur = useCallback(() => {
    validate(value);
  }, [validate, value]);

  return {
    value,
    onChange,
    onBlur,
    error,
    setError,
    setValue,
  };
}