const FlexGround = () => {
    return (
        <>
            <div className="">
                <div className="flex flex-row bg-gray-500 w-screen h-10 fixed left-0 top-0">
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
                <div className="bg-gray-600 fixed top-10 h-screen w-40">
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
                    <div className="bg-gray-200 ml-40 mt-10">content
                    </div>
                </div>
            </div>
        </>
    )
}

export default FlexGround