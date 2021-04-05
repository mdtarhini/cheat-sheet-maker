const Loader = () => {
  return (
    <div className="h-full w-full flex justify-center items-center space-x-8">
      <div className="relative w-12 h-12 flex justify-center items-center">
        <div className="absolute animate-ping w-full h-full flex justify-between">
          {[1, 2, 3, 4, 5, 6].map((line) => {
            return <div key={line} className="h-full w-px bg-blue-500"></div>;
          })}
        </div>
        <div className="absolute animate-ping w-full h-full flex flex-col justify-between">
          {[1, 2, 3, 4, 5, 6].map((line) => {
            return <div key={line} className="h-px w-full bg-blue-500"></div>;
          })}
        </div>
      </div>

      <span className="font-mono text-blue-500">loading...</span>
    </div>
  );
};
export default Loader;
