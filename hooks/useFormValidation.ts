'use client';

import { useCallback, useState } from 'react';

interface UseFormError {
  [key: string]: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<UseFormError>({});

  const validate = useCallback(
    (data: Record<string, any>, schema: any) => {
      try {
        schema.parse(data);
        setErrors({});
        return true;
      } catch (error: any) {
        const newErrors: UseFormError = {};
        error.errors.forEach((err: any) => {
          newErrors[err.path.join('.')] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
    },
    []
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, clearErrors };
}
