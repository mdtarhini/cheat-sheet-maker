import Button from "../Button";
const GenericModal = (props) => {
  const okColor = props.okColor ? props.okColor : "red";
  return (
    <div className="inline-block align-bottom bg-white  rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          {props.icon && (
            <div
              className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 text-xl text-white bg-${okColor}-300`}
            >
              {props.icon}
            </div>
          )}

          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            {props.title && (
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-headline"
              >
                {props.title}
              </h3>
            )}

            {props.text && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">{props.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex flex-row-reverse space-x-2">
        {props.okText && (
          <Button
            className="ml-2 px-4 py-1"
            onClick={(e) => {
              e.stopPropagation();
              props.onOk();
            }}
            loading={props.loading}
            color={okColor}
          >
            {props.okText}
          </Button>
        )}
        <Button
          className="px-4 py-1"
          type="secondary"
          onClick={(e) => {
            e.stopPropagation();
            props.onCancel();
          }}
        >
          {props.cancelText ? props.cancelText : "Cancel"}
        </Button>
      </div>
    </div>
  );
};

export default GenericModal;
