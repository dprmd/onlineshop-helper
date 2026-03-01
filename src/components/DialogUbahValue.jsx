const DialogUbahValue = ({
  title,
  realStateChangeFunction,
  valueState,
  changeValueFunction,
  changeOpenStateFunction,
  localStorageIdentifier,
}) => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-start pt-20 bg-gray-200">
      <form className="border border-gray-400 rounded-md bg-white p-4 w-[400px]">
        <div className="input-components flex flex-col gap-y-2">
          <label htmlFor={title}>{title}</label>
          <input
            type="number"
            id={title}
            className="border border-gray-400 rounded-md px-1"
            placeholder="Isi Di Sini. . ."
            onChange={(e) => {
              changeValueFunction(e.target.value);
            }}
          />
          <div className="flex gap-x-2 items-center">
            <button
              className="w-full px-2 py-1 text-white rounded-md bg-red-700 hover:bg-red-600"
              onClick={(e) => {
                e.preventDefault();
                changeOpenStateFunction(false);
              }}
            >
              Batal
            </button>
            <button
              className="w-full px-2 py-1 text-white rounded-md bg-green-700 hover:bg-green-600"
              onClick={(e) => {
                e.preventDefault();
                localStorage.setItem(localStorageIdentifier, valueState);
                realStateChangeFunction(Number(valueState));
                changeOpenStateFunction(false);
              }}
            >
              Ubah
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DialogUbahValue;
