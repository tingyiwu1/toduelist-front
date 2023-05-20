const items = ["one", "two", "three"];

const FlexGround = () => {
  return (
    <>
      <div className="">
        <div className="fixed left-0 top-0 flex h-10 w-screen flex-row bg-gray-500">
          <div className="bg-gray-200">
            <span>one</span>
          </div>
          <div className="bg-gray-200">
            <span>two</span>
          </div>
          <div className="bg-gray-200">
            <span>three</span>
          </div>
        </div>
        <div className="fixed top-10 h-screen w-40 bg-gray-600">
          <ul>
            <li>one</li>
            <li>two</li>
            <li>three</li>
          </ul>
        </div>
        {/* <div className="bg-gray-800">
                wow
            </div> */}
        <div>
          <div className="ml-40 mt-10 bg-gray-400">
            <div className="bg-gray-300">header</div>
            <div className="mx-10 bg-gray-200">
              {items.map((item) => (
                <div className="my-3 flex justify-between bg-gray-100">
                  <div className="flex flex-grow bg-blue-100">
                    <span>{item}</span>
                    <span>{item}</span>
                  </div>
                  <div className="flex flex-grow flex-row-reverse bg-red-100">
                    <div>...</div>
                    <div>...</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlexGround;
