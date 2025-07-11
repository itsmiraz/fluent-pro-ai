import { TErrorSource, TGenericErrorResponse } from '../interfaces/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const regex = /"([^"]*)"/;
  const extracted_message = err?.message?.match(regex)[1];
  const errorSources: TErrorSource = [
    {
      path: '',
      message: `${extracted_message} is Already Exists`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleDuplicateError;
